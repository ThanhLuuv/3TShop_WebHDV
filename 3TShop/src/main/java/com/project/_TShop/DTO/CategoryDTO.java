package com.project._TShop.DTO;

import java.util.Date;

import lombok.Data;

@Data
public class CategoryDTO {
    private Integer category_id;
    private String name;
    private int status;
    private String image;
    private Date create_at;
}
