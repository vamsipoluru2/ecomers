// src/main/java/com/ecommerce/service/PaymentService.java
package com.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    private final RazorpayClient client;

    @Value("${razorpay.keySecret}")
    private String secret;

    public PaymentService(
            @Value("${razorpay.keyId}") String keyId,
            @Value("${razorpay.keySecret}") String keySecret) throws Exception {
        this.client = new RazorpayClient(keyId, keySecret);
    }

    /** Create a Razorpay order (amount in paise). */
    public Order createRazorpayOrder(long amountPaise, String receipt) throws Exception {
        JSONObject req = new JSONObject();
        req.put("amount", amountPaise);
        req.put("currency", "INR");
        req.put("receipt", receipt);
        req.put("payment_capture", 1); // auto-capture
        return client.orders.create(req);
    }

    /** Verify signature from Razorpay (HMAC SHA256) */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + '|' + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec =
                new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expected = bytesToHex(hmac);
            // Razorpay sends signature in hex lowercase
            return expected.equalsIgnoreCase(signature) || hmacEquals(signature, hmac);
        } catch (Exception e) { return false; }
    }

    private static boolean hmacEquals(String signature, byte[] hmac) {
        // sometimes signature comes base16/hex; above check handles it
        // keeping this for safety
        String hex = bytesToHex(hmac);
        return hex.equalsIgnoreCase(signature);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
