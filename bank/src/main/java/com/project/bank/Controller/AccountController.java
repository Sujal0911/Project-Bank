package com.project.bank.Controller;

import com.project.bank.DTO.AccountDto;
import com.project.bank.DTO.AccountResponseDTO;
import com.project.bank.Service.AccountService;
//import com.project.bank.Service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService service;
//    private final EmailService emailService;

    @PostMapping("/saving")
    public ResponseEntity<AccountResponseDTO> createSavingAccount(
            @Valid @RequestBody AccountDto account) {

        return ResponseEntity.ok(service.createAccount(account));
    }

    @GetMapping("/login")
    public ResponseEntity<AccountResponseDTO> login(){
        return ResponseEntity.ok(service.login());
    }

    @GetMapping("/deposit/{amount}")
    public ResponseEntity<String> deposit(
            @PathVariable double amount) {

        return ResponseEntity.ok(service.deposit(amount));
    }

    @GetMapping("/withdraw/{amount}")
    public ResponseEntity<String> withdraw(
            @PathVariable double amount) {

        return ResponseEntity.ok(service.withdraw(amount));
    }

    @GetMapping("/delete")
    public ResponseEntity<String> delete(
            @RequestParam String password) {

        return ResponseEntity.ok(service.deleteAccount(password));
    }

    @GetMapping("/transfer")
    public ResponseEntity<String> transfer(
            @RequestParam String accountId, double amount) {

        return ResponseEntity.ok(service.transfer(accountId, amount));
    }

//    @PostMapping("/send")
//    public ResponseEntity<String> sendEmail(
//            @RequestParam String to,
//            @RequestParam String subject,
//            @RequestParam String body) {
//
//        emailService.sendEmail("demoaddress09@gmail.com", "EmailService", "Email sent by Bank");
//
//        return ResponseEntity.ok("Email sent successfully");
//    }
}
