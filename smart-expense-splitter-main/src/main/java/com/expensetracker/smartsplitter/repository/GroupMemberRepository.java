package com.expensetracker.smartsplitter.repository;

import com.expensetracker.smartsplitter.model.Group;
import com.expensetracker.smartsplitter.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember,Long> {

    @Query("SELECT gm.group FROM GroupMember gm WHERE gm.user.id = :userId")
    List<Group> findGroupsByUserId(@Param("userId") Long userId);
    boolean existsByUserIdAndGroupId(Long userId, Long groupId);
    List<GroupMember> findByUserId(Long userId);

}
