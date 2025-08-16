package com.expensetracker.smartsplitter.controller;

import com.expensetracker.smartsplitter.dto.ExpenseRequest;
import com.expensetracker.smartsplitter.model.Expense;
import com.expensetracker.smartsplitter.model.ExpenseParticipant;
import com.expensetracker.smartsplitter.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // Add new expense
    @PostMapping("/add")
    public ResponseEntity<Expense> addExpense(
            @RequestParam Long groupId,
            @RequestParam Long payerId,
            @RequestBody ExpenseRequest expenseRequest) {

        Expense expense = expenseService.addExpense(groupId, payerId, expenseRequest.getExpense(), expenseRequest.getParticipantIds());
        return ResponseEntity.ok(expense);
    }

    // Get all expenses for a group
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getExpensesForGroup(@PathVariable Long groupId) {
        List<Expense> expenses = expenseService.getExpensesForGroup(groupId);
        return ResponseEntity.ok(expenses);
    }

    // Get all expenses by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getExpensesByUser(@PathVariable Long userId) {
        List<Expense> expenses = expenseService.getExpensesByUser(userId);

        // Manually construct response to avoid Hibernate proxy serialization issues
        List<Map<String, Object>> response = new ArrayList<>();

        for (Expense expense : expenses) {
            Map<String, Object> expenseData = new HashMap<>();
            expenseData.put("id", expense.getId());
            expenseData.put("title", expense.getTitle());
            expenseData.put("amount", expense.getAmount());
            expenseData.put("createdAt", expense.getCreatedAt());

            // Handle paidBy user
            if (expense.getPaidBy() != null) {
                Map<String, Object> paidBy = new HashMap<>();
                paidBy.put("id", expense.getPaidBy().getId());
                paidBy.put("username", expense.getPaidBy().getUsername());
                paidBy.put("email", expense.getPaidBy().getEmail());
                paidBy.put("mobile", expense.getPaidBy().getMobile());
                expenseData.put("paidBy", paidBy);
            }

            // Handle group (basic info only)
            if (expense.getGroup() != null) {
                Map<String, Object> group = new HashMap<>();
                group.put("id", expense.getGroup().getId());
                group.put("groupName", expense.getGroup().getGroupName());
                expenseData.put("group", group);
            }

            // Handle participants
            List<Map<String, Object>> participants = new ArrayList<>();
            if (expense.getParticipants() != null) {
                for (ExpenseParticipant participant : expense.getParticipants()) {
                    Map<String, Object> participantData = new HashMap<>();
                    participantData.put("id", participant.getId());
                    participantData.put("shareAmount", participant.getShareAmount());

                    // Handle participant user
                    if (participant.getUser() != null) {
                        Map<String, Object> userData = new HashMap<>();
                        userData.put("id", participant.getUser().getId());
                        userData.put("username", participant.getUser().getUsername());
                        userData.put("email", participant.getUser().getEmail());
                        userData.put("mobile", participant.getUser().getMobile());
                        participantData.put("user", userData);
                    }

                    participants.add(participantData);
                }
            }
            expenseData.put("participants", participants);

            response.add(expenseData);
        }

        return ResponseEntity.ok(response);
    }

    // Delete an expense
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Map<String, String>> deleteExpense(@PathVariable Long expenseId) {
        try {
            expenseService.deleteExpense(expenseId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expense deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
