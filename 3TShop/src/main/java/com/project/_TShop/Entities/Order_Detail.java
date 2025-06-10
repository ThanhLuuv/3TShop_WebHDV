package com.project._TShop.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders_detail")
public class Order_Detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_detail_id;
    
    @Column(name="quantity",columnDefinition = "int",nullable = false)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    public Order_Detail(int quantity, Order order, Specifications specifications) {
        this.quantity = quantity;
        this.order = order;
        this.specifications = specifications;
    }

    @ManyToOne
    @JoinColumn(name = "specifications_id")
    private Specifications specifications;
}
