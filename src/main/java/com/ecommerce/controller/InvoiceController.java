package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.InvoiceService;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/orders")
public class InvoiceController {

    @Autowired private OrderService orderService;
    @Autowired private InvoiceService invoiceService;

    @GetMapping("/{id}/invoice.pdf")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order == null) return ResponseEntity.notFound().build();
        byte[] pdf = invoiceService.buildInvoicePdf(order);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
