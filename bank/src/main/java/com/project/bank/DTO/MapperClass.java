package com.project.bank.DTO;

import com.project.bank.Entity.SavingAccount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MapperClass {

    AccountResponseDTO toAccountResponseDTO(SavingAccount savingAccount);

    SavingAccount toSavingAccount(AccountDto accountDto);
}
