package com.project.bank.Repository;

import com.project.bank.Entity.Account;
import com.project.bank.Entity.SavingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    SavingAccount findByAccountIdAndIsActiveAndIsDeleted(String accountId, boolean isActive, boolean isDeleted);

}
