package com.project._TShop.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specifications")
public class Specifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer specifications_id;

    @Column(name="quantity",columnDefinition = "int",nullable = false)
    private int quantity;

    @Column(name="status",columnDefinition = "int",nullable = true)
    private int status;

    @ManyToOne
    @JoinColumn(name = "size_id", nullable = false)
    private Size size_id;

    @ManyToOne
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
