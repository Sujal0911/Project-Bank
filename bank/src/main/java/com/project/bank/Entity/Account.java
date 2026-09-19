package com.project.bank.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@RequiredArgsConstructor
public abstract class Account {

    @Id
    @Column(unique = true)
    private String accountId;
    @Column(nullable = false)
    private String customerName;
    @Column(nullable = false)
    private String password;
    private double balance = 0;
    private boolean isActive = true;
    private boolean isDeleted = false;

}
