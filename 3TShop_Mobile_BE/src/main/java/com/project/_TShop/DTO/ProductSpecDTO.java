package com.project._TShop.DTO;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecDTO {
    private Integer product_id;
    private String name;
    private String description;
    private String image;
    private BigDecimal price;
    private int sold;
    private Boolean which_gender;
    private Date created_at;
    private int status;
    private String categoryName;
    private List<SpecificationInfo> specifications;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpecificationInfo {
        private String size;
        private String color;
        private int quantity;
    }
}