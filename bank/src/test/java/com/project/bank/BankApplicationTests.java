package com.project.bank;

import com.project.bank.Service.EmailService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
class BankApplicationTests {

	@Mock
	private EmailService emailService;

	@Test
	void sendMail() {
		emailService.sendEmail("demoaddress09@gmail.com", "EmailService", "Email sent by Bank Account Created");
		verify(emailService, times(1)).sendEmail("demoaddress09@gmail.com", "EmailService", "Email sent by Bank Account Created");
	}

}
