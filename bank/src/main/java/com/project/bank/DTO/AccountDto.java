package com.project.bank.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDto {

    @NotBlank(message = "AccountId can't be null")
    private String accountId;
    @NotBlank(message = "CustomerName can't be null")
    private String customerName;
    @NotBlank(message = "Password can't be null")
    @Setter(AccessLevel.NONE)
    private String password;
    private double balance;

}
