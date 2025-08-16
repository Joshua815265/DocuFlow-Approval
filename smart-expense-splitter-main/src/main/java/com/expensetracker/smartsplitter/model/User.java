package com.expensetracker.smartsplitter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    // 👇 One user can belong to many GroupMember entries
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Prevent circular reference in JSON serialization
    private List<GroupMember> groups;

    // 👇 Optional: To track groups created by this user (as admin)
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @JsonIgnore // Prevent circular reference in JSON serialization
    private List<Group> createdGroups;

    // 👇 Optional: Expenses this user paid
    @OneToMany(mappedBy = "paidBy")
    @JsonIgnore // Prevent circular reference in JSON serialization
    private List<Expense> paidExpenses;

    // 👇 Optional: Participant entries where this user is involved
    @OneToMany(mappedBy = "user")
    @JsonIgnore // Prevent circular reference in JSON serialization
    private List<ExpenseParticipant> participations;

    // 👇 Optional: Settlements where this user has to pay
    @OneToMany(mappedBy = "fromUser")
    @JsonIgnore // Prevent circular reference in JSON serialization
    private List<Settlement> debts;

    // 👇 Optional: Settlements where this user will receive
    @OneToMany(mappedBy = "toUser")
    @JsonIgnore // Prevent circular reference in JSON serialization
    private List<Settlement> credits;
}
