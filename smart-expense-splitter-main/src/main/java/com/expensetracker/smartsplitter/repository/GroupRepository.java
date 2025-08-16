package com.expensetracker.smartsplitter.repository;

import com.expensetracker.smartsplitter.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group,Long> {
}
