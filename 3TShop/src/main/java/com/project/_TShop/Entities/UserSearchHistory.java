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
@Table(name = "user_search_history")
public class UserSearchHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer searchId;

    @Column(name="search_image",columnDefinition = "LONGTEXT",nullable = false)

    private String searchImage;

    @Column(name = "searched_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date searchedAt;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = true)
    private Product product;

//    @Column(name = "similarity_score", columnDefinition = "DOUBLE", nullable = true)
//    private Double similarityScore;

    @Column(name = "feedback", columnDefinition = "TINYINT", nullable = true)
    private Boolean feedback; // Đánh giá của người dùng (1: tốt, 0: không tốt, NULL: chưa đánh giá)
}
