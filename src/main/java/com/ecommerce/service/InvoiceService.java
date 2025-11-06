package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.lowagie.text.Document;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class InvoiceService {

    public byte[] buildInvoicePdf(Order order) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document doc = new Document();
            PdfWriter.getInstance(doc, baos);
            doc.open();

            doc.add(new Paragraph("Invoice #" + order.getId(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
            doc.add(new Paragraph("Order Date: " + String.valueOf(order.getOrderDate())));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.addCell("Product");
            table.addCell("Price");
            table.addCell("Qty");
            table.addCell("Subtotal");

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    String name = item.getProduct() != null ? item.getProduct().getName() : "";
                    double price = (item.getProduct() != null) ? item.getProduct().getPrice() : 0.0;
                    int qty = item.getQuantity();
                    double subtotal = item.getTotalPrice() > 0 ? item.getTotalPrice() : (price * qty);

                    table.addCell(name);
                    table.addCell(String.valueOf(price));
                    table.addCell(String.valueOf(qty));
                    table.addCell(String.valueOf(subtotal));
                }
            }

            doc.add(table);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Total: " + order.getTotalAmount()));

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }
}
