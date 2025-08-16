package com.expensetracker.smartsplitter.service;

import com.expensetracker.smartsplitter.model.Expense;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExpenseService {
    Expense addExpense(Long groupId, Long payerId, Expense expense, List<Long> participantIds);
    List<Expense> getExpensesForGroup(Long groupId);
    List<Expense> getExpensesByUser(Long userId);
    void deleteExpense(Long expenseId);
}
