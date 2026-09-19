package com.project.bank.Utility;

import com.project.bank.Enum.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class TransactionInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;
    @Column(nullable = false)
    private String fromAccountId;
    private String toAccountId;
    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private TransactionType transactionType;
    @Column(nullable = false)
    private double amount;
    @Column(nullable = false)
    private LocalDateTime time;
}
