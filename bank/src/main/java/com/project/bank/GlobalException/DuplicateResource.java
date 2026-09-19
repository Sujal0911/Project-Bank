package com.project.bank.GlobalException;

public class DuplicateResource extends RuntimeException {
    public DuplicateResource(String message) {
        super(message);
    }
}
