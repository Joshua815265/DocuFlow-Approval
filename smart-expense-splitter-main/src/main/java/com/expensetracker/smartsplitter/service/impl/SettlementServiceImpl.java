package com.expensetracker.smartsplitter.service.impl;

import com.expensetracker.smartsplitter.model.*;
import com.expensetracker.smartsplitter.repository.ExpenseRepository;
import com.expensetracker.smartsplitter.repository.GroupRepository;
import com.expensetracker.smartsplitter.repository.SettlementRepository;
import com.expensetracker.smartsplitter.repository.UserRepository;
import com.expensetracker.smartsplitter.repository.GroupMemberRepository;
import com.expensetracker.smartsplitter.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class SettlementServiceImpl implements SettlementService {

    private SettlementRepository settlementRepository;
    private GroupRepository groupRepository;
    private UserRepository userRepository;
    private GroupMemberRepository groupMemberRepository;
    private ExpenseRepository expenseRepository;

    @Autowired
    public  SettlementServiceImpl(SettlementRepository settlementRepository, UserRepository userRepository,
                                 GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
                                 ExpenseRepository expenseRepository) {
        this.settlementRepository = settlementRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Settlement> calculateSettlements(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Track net balances of each user in this group
        Map<Long, BigDecimal> netBalances = new HashMap<>();

        // Get all expenses in this group
        List<Expense> expenses = group.getExpenses();

        for (Expense expense : expenses) {
            BigDecimal totalAmount = expense.getAmount();
            Long payerId = expense.getPaidBy().getId();
            List<ExpenseParticipant> participants = expense.getParticipants();

            // Divide expense among participants
            for (ExpenseParticipant participant : participants) {
                Long participantId = participant.getUser().getId();
                BigDecimal share = participant.getShareAmount();

                // Participant owes money → negative balance
                netBalances.put(participantId,
                        netBalances.getOrDefault(participantId, BigDecimal.ZERO).subtract(share));
            }
            // Payer is owed the entire amount → positive balance
            netBalances.put(payerId,
                    netBalances.getOrDefault(payerId, BigDecimal.ZERO).add(totalAmount));
        }

        // Build settlements from net balances
        List<Settlement> settlements = new ArrayList<>();

        // Convert Map to sortable lists
        List<Map.Entry<Long, BigDecimal>> positive = new ArrayList<>(netBalances.entrySet().stream()
                .filter(e -> e.getValue().compareTo(BigDecimal.ZERO) > 0)
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .toList());

        List<Map.Entry<Long, BigDecimal>> negative = new ArrayList<>(netBalances.entrySet().stream()
                .filter(e -> e.getValue().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Map.Entry.comparingByValue())
                .toList());

        int i = 0, j = 0;
        while (i < negative.size() && j < positive.size()) {
            var debtor = negative.get(i);
            var creditor = positive.get(j);

            BigDecimal debit = debtor.getValue().abs();
            BigDecimal credit = creditor.getValue();

            BigDecimal settleAmount = debit.min(credit);

            Settlement settlement = Settlement.builder()
                    .fromUser(userRepository.findById(debtor.getKey()).get())
                    .toUser(userRepository.findById(creditor.getKey()).get())
                    .amount(settleAmount)
                    .group(group)
                    .build();

            settlements.add(settlement);

            // Update balances
            BigDecimal updatedDebtor = debit.subtract(settleAmount);
            BigDecimal updatedCreditor = credit.subtract(settleAmount);

            if (updatedDebtor.compareTo(BigDecimal.ZERO) == 0) i++;
            else negative.set(i, Map.entry(debtor.getKey(), updatedDebtor.negate()));

            if (updatedCreditor.compareTo(BigDecimal.ZERO) == 0) j++;
            else positive.set(j, Map.entry(creditor.getKey(), updatedCreditor));
        }

        // Clear existing settlements for this group to avoid duplicates
        List<Settlement> existingSettlements = settlementRepository.findByGroupId(groupId);
        settlementRepository.deleteAll(existingSettlements);

        // Save new settlements to database
        if (!settlements.isEmpty()) {
            settlements = settlementRepository.saveAll(settlements);
        }

        return settlements;
    }


    @Override
    public List<Settlement> getSettlementsForUser(Long userId) {
        // Get all groups where the user is a member
        List<GroupMember> userGroups = groupMemberRepository.findByUserId(userId);
        List<Settlement> allSettlements = new ArrayList<>();

        // Calculate settlements for each group the user is in
        for (GroupMember groupMember : userGroups) {
            Long groupId = groupMember.getGroup().getId();

            // Get all expenses for this group
            List<Expense> groupExpenses = expenseRepository.findByGroupId(groupId);

            if (!groupExpenses.isEmpty()) {
                // Calculate settlements for this group
                calculateSettlements(groupId);

                // Get settlements for this user in this group
                List<Settlement> groupSettlements = settlementRepository.findByFromUserIdOrToUserId(userId, userId)
                    .stream()
                    .filter(settlement -> settlement.getGroup().getId().equals(groupId))
                    .collect(Collectors.toList());

                allSettlements.addAll(groupSettlements);
            }
        }

        return allSettlements;
    }

    @Override
    public void markSettlementAsPaid(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        settlement.setPaid(true);
        settlementRepository.save(settlement);
    }

}
