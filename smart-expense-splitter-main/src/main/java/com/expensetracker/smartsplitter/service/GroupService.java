package com.expensetracker.smartsplitter.service;

import com.expensetracker.smartsplitter.model.Group;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GroupService {
    Group createGroup(Group group, Long creatorId);
    void addUserToGroup(Long groupId, Long userId, String currentUserEmail);
    List<Group> getGroupsByUser(Long userId);
    Group getGroupById(Long groupId);
}
