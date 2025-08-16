package com.expensetracker.smartsplitter.service.impl;

import com.expensetracker.smartsplitter.model.Expense;
import com.expensetracker.smartsplitter.model.ExpenseParticipant;
import com.expensetracker.smartsplitter.model.Group;
import com.expensetracker.smartsplitter.model.User;
import com.expensetracker.smartsplitter.repository.ExpenseRepository;
import com.expensetracker.smartsplitter.repository.GroupRepository;
import com.expensetracker.smartsplitter.repository.UserRepository;
import com.expensetracker.smartsplitter.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Override
    public Expense addExpense(Long groupId, Long payerId, Expense expense, List<Long> participantIds) {
        // Fetch group and payer
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        User payer = userRepository.findById(payerId)
                .orElseThrow(() -> new RuntimeException("Payer not found"));

        expense.setGroup(group);
        expense.setPaidBy(payer);

        BigDecimal totalAmount = expense.getAmount();
        int participantCount = participantIds.size();
        BigDecimal share = totalAmount.divide(BigDecimal.valueOf(participantCount), 2, BigDecimal.ROUND_HALF_UP);

        List<ExpenseParticipant> participants = participantIds.stream()
                .map(userId -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
                    return ExpenseParticipant.builder()
                            .expense(expense)
                            .user(user)
                            .shareAmount(share)
                            .build();
                })
                .toList();

        expense.setParticipants(participants);
        return expenseRepository.save(expense);
    }
    @Override
    public List<Expense> getExpensesForGroup(Long groupId) {
        return expenseRepository.findByGroupId(groupId);
    }

    @Override
    public List<Expense> getExpensesByUser(Long userId) {
        // Return all expenses where user is involved (either as payer or participant)
        return expenseRepository.findExpensesByUserInvolvement(userId);
    }

    @Override
    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + expenseId));

        // Delete the expense (this will cascade delete participants due to @OneToMany cascade)
        expenseRepository.delete(expense);
    }

}
