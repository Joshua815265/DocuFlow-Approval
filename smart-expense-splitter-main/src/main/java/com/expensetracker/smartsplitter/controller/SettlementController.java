package com.expensetracker.smartsplitter.controller;

import com.expensetracker.smartsplitter.model.Settlement;
import com.expensetracker.smartsplitter.model.User;
import com.expensetracker.smartsplitter.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/settlement")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @GetMapping("group/{groupId}")
    public ResponseEntity<List<Settlement>> getAllSettlements(@PathVariable Long groupId) {
        return new ResponseEntity<List<Settlement>>(settlementService.calculateSettlements(groupId), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getSettlementsForUser(@PathVariable Long userId) {
        List<Settlement> settlements = settlementService.getSettlementsForUser(userId);

        // Manually construct response to avoid Hibernate proxy serialization issues
        List<Map<String, Object>> response = new ArrayList<>();

        for (Settlement settlement : settlements) {
            Map<String, Object> settlementData = new HashMap<>();
            settlementData.put("id", settlement.getId());
            settlementData.put("amount", settlement.getAmount());
            settlementData.put("paid", settlement.isPaid());

            // Handle fromUser
            if (settlement.getFromUser() != null) {
                Map<String, Object> fromUser = new HashMap<>();
                fromUser.put("id", settlement.getFromUser().getId());
                fromUser.put("username", settlement.getFromUser().getUsername());
                fromUser.put("email", settlement.getFromUser().getEmail());
                fromUser.put("mobile", settlement.getFromUser().getMobile());
                settlementData.put("fromUser", fromUser);
            }

            if (settlement.getToUser() != null) {
                Map<String, Object> toUser = new HashMap<>();
                toUser.put("id", settlement.getToUser().getId());
                toUser.put("username", settlement.getToUser().getUsername());
                toUser.put("email", settlement.getToUser().getEmail());
                toUser.put("mobile", settlement.getToUser().getMobile());
                settlementData.put("toUser", toUser);
            }

            // Handle group (basic info only)
            if (settlement.getGroup() != null) {
                Map<String, Object> group = new HashMap<>();
                group.put("id", settlement.getGroup().getId());
                group.put("groupName", settlement.getGroup().getGroupName());
                settlementData.put("group", group);
            }

            response.add(settlementData);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/payment/{settlementId}")
    public ResponseEntity<String> markSettlementAsPaid(@PathVariable Long settlementId) {
        settlementService.markSettlementAsPaid(settlementId);
        return ResponseEntity.ok("Settlement marked as paid");
    }
}
