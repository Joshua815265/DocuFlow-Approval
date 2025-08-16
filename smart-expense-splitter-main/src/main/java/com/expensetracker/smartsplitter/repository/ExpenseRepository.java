package com.expensetracker.smartsplitter.repository;

import com.expensetracker.smartsplitter.model.Expense;
import com.expensetracker.smartsplitter.model.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    List<Expense> findByGroupId(Long groupId);        // For getExpensesForGroup
    List<Expense> findByPaidById(Long userId);        // For expenses paid by user

    // Get all expenses where user is involved (either as payer or participant)
    @Query("SELECT DISTINCT e FROM Expense e LEFT JOIN e.participants p WHERE e.paidBy.id = :userId OR p.user.id = :userId")
    List<Expense> findExpensesByUserInvolvement(@Param("userId") Long userId);
}
