package com.ecommerce.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {
    public void send(String phone, String message) {
        // Stub for now. Integrate Twilio later.
        System.out.println("[SmsService] SMS to " + phone + ": " + message);
    }
}
