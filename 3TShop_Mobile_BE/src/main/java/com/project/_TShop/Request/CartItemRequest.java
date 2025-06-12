package com.project._TShop.Request;

import lombok.Data;

@Data
public class CartItemRequest {
    private Integer productId;
    private Integer spec_id;
    private Integer quantity;
}
