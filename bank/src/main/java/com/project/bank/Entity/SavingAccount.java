package com.project.bank.Entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class SavingAccount extends Account{

    private static final double interestRate = 0.25;
}
