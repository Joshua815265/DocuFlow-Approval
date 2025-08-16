package com.expensetracker.smartsplitter.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GroupMemberDTO {
    private Long id;
    private UserDto user;
    private LocalDateTime joinedAt;
}
