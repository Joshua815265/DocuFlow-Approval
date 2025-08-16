package com.expensetracker.smartsplitter.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class GroupDTO {
    private Long id;
    private String groupName;
    private LocalDateTime createdAt;
    private UserDto createdBy;
    private List<GroupMemberDTO> members;
}
