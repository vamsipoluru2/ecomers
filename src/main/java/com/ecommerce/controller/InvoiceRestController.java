// src/main/java/com/ecommerce/controller/InvoiceRestController.java
package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.InvoiceService;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class InvoiceRestController {

    @Autowired 
    private OrderService orderService;

    @Autowired 
    private InvoiceService invoiceService;

    // ✅ Download invoice PDF (same logic, no JSP)
    @GetMapping("/{id}/invoice.pdf")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdf = invoiceService.buildInvoicePdf(order);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
