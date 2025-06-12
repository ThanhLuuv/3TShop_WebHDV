package com.project._TShop.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cart_items")
public class Cart_Items {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cart_items_id;

    @Column(name="quantity",columnDefinition = "int",nullable = false)
    private int quantity;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "specifications_id")
    private Specifications specifications;

    public Cart_Items(int quantity, Cart cart, Specifications specifications) {
        this.quantity = quantity;
        this.cart = cart;
        this.specifications = specifications;
        this.created_at = new Date();
    }
    
}
