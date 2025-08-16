package com.expensetracker.smartsplitter.dto;

import com.expensetracker.smartsplitter.model.Expense;
import lombok.Data;

import java.util.List;

@Data
public class ExpenseRequest {
    private Expense expense;
    private List<Long> participantIds;
}
