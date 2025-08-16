package com.expensetracker.smartsplitter.service.impl;

import com.expensetracker.smartsplitter.dto.GroupDTO;
import com.expensetracker.smartsplitter.dto.GroupMemberDTO;
import com.expensetracker.smartsplitter.dto.UserDto;
import com.expensetracker.smartsplitter.model.Group;
import com.expensetracker.smartsplitter.model.GroupMember;
import com.expensetracker.smartsplitter.model.User;
import com.expensetracker.smartsplitter.repository.GroupMemberRepository;
import com.expensetracker.smartsplitter.repository.GroupRepository;
import com.expensetracker.smartsplitter.repository.UserRepository;
import com.expensetracker.smartsplitter.service.GroupService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Override
    @Transactional
    public Group createGroup(Group group, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        group.setCreatedBy(creator);
        group.setCreatedAt(java.time.LocalDateTime.now());

        Group savedGroup = groupRepository.save(group);

        GroupMember creatorMember = GroupMember.builder()
                .user(creator)
                .group(savedGroup)
                .build();

        groupMemberRepository.save(creatorMember);

        return savedGroup;
    }

    @Override
    public void addUserToGroup(Long groupId, Long userId, String currentUserEmail) {
        // Find the current user making the request
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // Find the user to be added
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Check if the current user has permission to add members to this group
        // Only group creator or existing members can add new members
        boolean isCreator = group.getCreatedBy().getId().equals(currentUser.getId());
        boolean isExistingMember = groupMemberRepository.existsByUserIdAndGroupId(currentUser.getId(), groupId);

        if (!isCreator && !isExistingMember) {
            throw new SecurityException("You don't have permission to add members to this group");
        }

        // Check if the user is already a member
        boolean alreadyMember = groupMemberRepository.existsByUserIdAndGroupId(userId, groupId);
        if (alreadyMember) {
            throw new IllegalArgumentException("User is already a member of this group");
        }

        // Add the user to the group
        GroupMember member = GroupMember.builder()
                .user(user)
                .group(group)
                .build();
        groupMemberRepository.save(member);
    }

    @Override
    public List<Group> getGroupsByUser(Long userId) {
        List<GroupMember> memberships = groupMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(membership -> {
                    Group group = membership.getGroup();
                    // Eagerly fetch members and their user data
                    if (group.getMembers() != null) {
                        group.getMembers().forEach(member -> {
                            // Force loading of user data
                            if (member.getUser() != null) {
                                member.getUser().getEmail(); // This triggers lazy loading
                            }
                        });
                    }
                    return group;
                })
                .toList();
    }


    @Override
    public Group getGroupById(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Eagerly fetch members and their user data to avoid lazy loading issues
        if (group.getMembers() != null) {
            group.getMembers().forEach(member -> {
                // Force loading of user data
                if (member.getUser() != null) {
                    member.getUser().getEmail(); // This triggers lazy loading
                }
            });
        }

        return group;
    }

}
