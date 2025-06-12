package com.project._TShop.DTO;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class ProductDTO {
    private Integer product_id;
    private String name;
    private BigDecimal price;
    private String description;
    private String image;
    private int sold;
    private Boolean which_gender;
    private Date create_at;
    private int status;
    private CategoryDTO categoryDTO;
}
