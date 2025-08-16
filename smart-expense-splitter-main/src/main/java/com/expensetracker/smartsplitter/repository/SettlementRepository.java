package com.expensetracker.smartsplitter.repository;

import com.expensetracker.smartsplitter.model.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement,Long> {
    List<Settlement> findByFromUserIdOrToUserId(Long fromUserId, Long toUserId);
    List<Settlement> findByGroupId(Long groupId);
}
