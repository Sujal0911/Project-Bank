package com.project.bank.Service;

import com.project.bank.DTO.AccountDto;
import com.project.bank.DTO.AccountResponseDTO;
import com.project.bank.DTO.MapperClass;
import com.project.bank.Entity.SavingAccount;
import com.project.bank.Enum.TransactionType;
import com.project.bank.GlobalException.DuplicateResource;
import com.project.bank.GlobalException.IllegalArgument;
import com.project.bank.GlobalException.ResourceNotFound;
import com.project.bank.Repository.AccountRepository;
import com.project.bank.Repository.TransactionInfoRepository;
import com.project.bank.Utility.TransactionInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionInfoRepository transactionInfoRepository;
    private final PasswordEncoder passwordEncoder;
    private final MapperClass mapperClass;
//    private final EmailService emailService;

    public AccountResponseDTO createAccount(AccountDto accountdto) {

//         1. Validate account number
//        if (accountdto.getAccountId() == null) {
//            throw new UserNotFound("")
//        }

        // 2. Check whether account already exists
        SavingAccount account =
                accountRepository.findByAccountIdAndIsActiveAndIsDeleted(accountdto.getAccountId(), true, false);

        if (account != null) {
            throw new DuplicateResource("Account id " + accountdto.getAccountId() + " already exists");
        }

        // 3. Business validation
        if (accountdto.getBalance() < 0) {
            throw new IllegalArgument(
                    "Initial balance cannot be negative");
        }

        // 4. Set other business values
        account = new SavingAccount();
        account.setAccountId(accountdto.getAccountId());
        account.setPassword(passwordEncoder.encode(accountdto.getPassword()));
        account.setCustomerName(accountdto.getCustomerName());
        account.setBalance(accountdto.getBalance());

        // 5. Finally save
        accountRepository.save(account);

        AccountResponseDTO dto = mapperClass.toAccountResponseDTO(account);
        return dto;
    }

    @Transactional
    public String deposit(double amount){
        if (amount <= 0) {
            throw new IllegalArgument("Deposit amount must be greater than zero");
        }

        String accountId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        SavingAccount account = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(accountId, true, false);

        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        TransactionInfo transactionInfo = new TransactionInfo();

        transactionInfo.setFromAccountId(account.getAccountId());
        transactionInfo.setTransactionType(TransactionType.Deposit);
        transactionInfo.setAmount(amount);
        transactionInfo.setTime(LocalDateTime.now());

        transactionInfoRepository.save(transactionInfo);
        return "Successfully Deposited: " + amount + " in AccountName: " + account.getAccountId();
    }

    @Transactional
    public String withdraw(double amount){
        if (amount <= 0) {
            throw new IllegalArgument(
                    "Withdrawal amount must be greater than zero"
            );
        }

        String accountId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        SavingAccount account = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(accountId, true, false);

        if (account.getBalance() < amount) {
            throw new IllegalArgument("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        TransactionInfo transactionInfo = new TransactionInfo();

        transactionInfo.setFromAccountId(account.getAccountId());
        transactionInfo.setTransactionType(TransactionType.Withdraw);
        transactionInfo.setAmount(amount);
        transactionInfo.setTime(LocalDateTime.now());

        transactionInfoRepository.save(transactionInfo);
        return "Successfully Withdrawn: " + amount + " from AccountName: " + account.getAccountId();
    }

    public String deleteAccount(String password){

        String accountId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        SavingAccount account = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(accountId, true, false);
        if(!(passwordEncoder.matches(password, account.getPassword()))){
            throw new IllegalArgument("Incorrect Password");
        }

        if(account.getBalance() > 0){
            throw new RuntimeException("First Withdraw or Transfer your Money to another Account");
        }

        account.setActive(false);
        account.setDeleted(true);

        accountRepository.save(account);

        return "AccountId: " + account.getAccountId() + " is successfully Deleted.";
    }

    @Transactional
    public String transfer(String accountId, double amount){
        SavingAccount receiverAccount = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(accountId, true, false);
        if(receiverAccount == null){
            throw new ResourceNotFound("Account not found");
        }

        String senderAccountId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        SavingAccount senderAccount = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(senderAccountId, true, false);
        if(senderAccount.getBalance() < amount){
            throw new RuntimeException("Insufficient Funds");
        }
        senderAccount.setBalance(senderAccount.getBalance() - amount);
        receiverAccount.setBalance(receiverAccount.getBalance() + amount);

        accountRepository.save(receiverAccount);
        accountRepository.save(senderAccount);

        return "Amount: " + amount + " transferred to AccountId: " + receiverAccount.getAccountId();
    }

    public AccountResponseDTO login() {
        String accountId;
        accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        SavingAccount account = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(accountId, true, false);
        return mapperClass.toAccountResponseDTO(account);
    }
}
