package com.expensetracker.smartsplitter.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "expense_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which expense this participant is part of
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    // Who owes the share
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The amount this user owes in the expense
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal shareAmount;
}
