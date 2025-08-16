package com.expensetracker.smartsplitter.service;

import com.expensetracker.smartsplitter.model.Settlement;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SettlementService {
    List<Settlement> calculateSettlements(Long groupId);
    List<Settlement> getSettlementsForUser(Long userId);
    void markSettlementAsPaid(Long settlementId);
}
