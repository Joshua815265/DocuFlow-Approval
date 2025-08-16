package com.expensetracker.smartsplitter.repository;

import com.expensetracker.smartsplitter.model.ExpenseParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseParticipantRepository extends JpaRepository<ExpenseParticipant,Long> {
}
