package com.project.bank.Security;

import com.project.bank.Entity.Account;
import com.project.bank.Repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByAccountIdAndIsActiveAndIsDeleted(username, true, false);
        if(account == null) throw new UsernameNotFoundException("Account not Found");
        return new UserDetailsImpl(account);
    }
}
