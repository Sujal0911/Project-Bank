package com.project.bank.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AccountResponseDTO {

    private String accountId;
    private String customerName;
    private double balance;
}
