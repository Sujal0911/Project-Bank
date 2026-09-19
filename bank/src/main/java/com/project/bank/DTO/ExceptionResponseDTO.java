package com.project.bank.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ExceptionResponseDTO {

    private LocalDateTime time;
    private Integer code;
    private String message;
}
