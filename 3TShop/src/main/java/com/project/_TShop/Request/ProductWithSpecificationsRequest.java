package com.project._TShop.Request;

import com.project._TShop.DTO.ImagesDTO;
import com.project._TShop.DTO.ProductDTO;
import com.project._TShop.DTO.SpecificationsDTO;
import lombok.Data;

import java.util.List;
@Data
public class ProductWithSpecificationsRequest {
    private ProductDTO productDTO;
    private List<ImagesDTO> imagesDTOS;
    private List<SpecificationsDTO> specificationsDTO;
}
