package com.expensetracker.smartsplitter.controller;

import com.expensetracker.smartsplitter.model.Group;
import com.expensetracker.smartsplitter.model.GroupMember;
import com.expensetracker.smartsplitter.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/groups")
    public ResponseEntity<Group> createGroup(@RequestBody Group group, @RequestParam Long creatorId) {
        return new ResponseEntity<>(groupService.createGroup(group, creatorId), HttpStatus.CREATED);
    }

    @PostMapping("/groups/{groupId}/users/{userId}")
    public ResponseEntity<String> addUserToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            groupService.addUserToGroup(groupId, userId, currentUserEmail);
            return ResponseEntity.ok("User added to group successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: " + e.getMessage());
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found: " + e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/groups")
    public ResponseEntity<List<Map<String, Object>>> getAllGroups(@PathVariable Long userId) {
        List<Group> groups = groupService.getGroupsByUser(userId);

        // Manually construct response to avoid Hibernate proxy serialization issues
        List<Map<String, Object>> response = new ArrayList<>();

        for (Group group : groups) {
            Map<String, Object> groupData = new HashMap<>();
            groupData.put("id", group.getId());
            groupData.put("groupName", group.getGroupName());
            groupData.put("createdAt", group.getCreatedAt());

            // Handle createdBy user
            if (group.getCreatedBy() != null) {
                Map<String, Object> createdBy = new HashMap<>();
                createdBy.put("id", group.getCreatedBy().getId());
                createdBy.put("username", group.getCreatedBy().getUsername());
                createdBy.put("email", group.getCreatedBy().getEmail());
                createdBy.put("mobile", group.getCreatedBy().getMobile());
                groupData.put("createdBy", createdBy);
            }

            // Handle members list (basic info only for list view)
            List<Map<String, Object>> members = new ArrayList<>();
            if (group.getMembers() != null) {
                for (GroupMember member : group.getMembers()) {
                    Map<String, Object> memberData = new HashMap<>();
                    memberData.put("id", member.getId());
                    memberData.put("joinedAt", member.getJoinedAt());

                    // Handle user data
                    if (member.getUser() != null) {
                        Map<String, Object> userData = new HashMap<>();
                        userData.put("id", member.getUser().getId());
                        userData.put("username", member.getUser().getUsername());
                        userData.put("email", member.getUser().getEmail());
                        userData.put("mobile", member.getUser().getMobile());
                        memberData.put("user", userData);
                    }

                    members.add(memberData);
                }
            }
            groupData.put("members", members);

            response.add(groupData);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<Map<String, Object>> getGroupById(@PathVariable Long id) {
        Group group = groupService.getGroupById(id);

        // Manually construct response to avoid Hibernate proxy serialization issues
        Map<String, Object> response = new HashMap<>();
        response.put("id", group.getId());
        response.put("groupName", group.getGroupName());
        response.put("createdAt", group.getCreatedAt());

        // Handle createdBy user
        if (group.getCreatedBy() != null) {
            Map<String, Object> createdBy = new HashMap<>();
            createdBy.put("id", group.getCreatedBy().getId());
            createdBy.put("username", group.getCreatedBy().getUsername());
            createdBy.put("email", group.getCreatedBy().getEmail());
            createdBy.put("mobile", group.getCreatedBy().getMobile());
            response.put("createdBy", createdBy);
        }

        // Handle members list
        List<Map<String, Object>> members = new ArrayList<>();
        if (group.getMembers() != null) {
            for (GroupMember member : group.getMembers()) {
                Map<String, Object> memberData = new HashMap<>();
                memberData.put("id", member.getId());
                memberData.put("joinedAt", member.getJoinedAt());

                // Handle user data
                if (member.getUser() != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", member.getUser().getId());
                    userData.put("username", member.getUser().getUsername());
                    userData.put("email", member.getUser().getEmail());
                    userData.put("mobile", member.getUser().getMobile());
                    memberData.put("user", userData);
                }

                members.add(memberData);
            }
        }
        response.put("members", members);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

