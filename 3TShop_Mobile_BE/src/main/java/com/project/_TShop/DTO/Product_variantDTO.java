package com.project._TShop.DTO;

import java.util.List;

import lombok.Data;

@Data
public class Product_variantDTO {
    private ProductDTO productDTO;
    private Integer quantity;
    private List<SizeDTO> sizeDTOs;
    private List<ColorDTO> colorDTOs;
}
