package com.project._TShop.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delevery_infomation")
public class Delevery_Infomation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer de_infor_id;
    
    @Column(name="name",columnDefinition = "varchar(65)",nullable = false)
    private String name;

    @Column(name="phone",columnDefinition = "varchar(10)",nullable = false)
    private String phone;

    @Column(name="address_line_1",columnDefinition = "varchar(255)",nullable = false)
    private String address_line_1;

    @Column(name="address_line_2",columnDefinition = "varchar(255)",nullable = false)
    private String address_line_2;

    @Column(name="is_default",nullable = false)
    private boolean is_default;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user_id;

    public Delevery_Infomation(String name, String phone, String address_line_1, String address_line_2,
            boolean is_default, Date created_at, User user_id) {
        this.name = name;
        this.phone = phone;
        this.address_line_1 = address_line_1;
        this.address_line_2 = address_line_2;
        this.is_default = is_default;
        this.created_at = created_at;
        this.user_id = user_id;
    }

}
