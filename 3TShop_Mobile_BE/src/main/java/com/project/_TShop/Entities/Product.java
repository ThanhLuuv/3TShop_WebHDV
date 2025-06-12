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
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer product_id;
    
    @Column(name="name",columnDefinition = "varchar(65)",nullable = false)
    private String name;

    @Column(name="description",columnDefinition = "nvarchar(255)",nullable = false)
    private String description;

    @Column(name="image",columnDefinition = "LONGTEXT",nullable = true)
    private String image;

    @Column(name = "price", precision = 12, scale = 0)
    private BigDecimal price;

    @Column(name="sold",columnDefinition = "int",nullable = false)
    private int sold;

    @Column(name="which_gender",columnDefinition = "BIT",nullable = false)
    private Boolean  which_gender;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @Column(name="status",columnDefinition = "int",nullable = false)
    private int status;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category_id;

}


