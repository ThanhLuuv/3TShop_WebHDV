package com.project._TShop.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class ColorDTO {
    private Integer color_id;
    private String name;
    private String hex;
    private Date createAt;
}
