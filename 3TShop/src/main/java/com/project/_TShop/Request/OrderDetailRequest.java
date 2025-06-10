package com.project._TShop.Request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailRequest {
    private Integer colorId;
    private Integer productId;
    private int quantity;
    private Integer sizeId;
}
