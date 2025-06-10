package com.project._TShop.DTO;

import lombok.Data;

@Data
public class SpecificationsDTO {
    private Integer specifications_id;
    private int quantity;
    private int status;
    private SizeDTO sizeDTO;
    private ColorDTO colorDTO;
    private ProductDTO productDTO;
}
