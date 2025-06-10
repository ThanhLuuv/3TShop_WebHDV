package com.project._TShop.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.aspectj.weaver.ast.Or;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders_status")
public class Order_Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_status_id;

    @Column(name="status",columnDefinition = "int",nullable = false)
    private int status;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order_id;

    @Column(name="note",columnDefinition = "LONGTEXT")
    private String note;
    public Order_Status(int status, Date created_at, Order order_id) {
        this.status = status;
        this.created_at = created_at;
        this.order_id = order_id;
    }

    public Order_Status(int status, Date created_at, Order order_id, String note) {
        this.status = status;
        this.created_at = created_at;
        this.order_id = order_id;
        this.note = note;
    }

}
