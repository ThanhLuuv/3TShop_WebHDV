package com.project._TShop.DTO;

import lombok.Data;

@Data
public class Order_DetailDTO {
    private Integer order_detail_id;
    private int quantity;
    private OrderDTO orderDTO;
    private SpecificationsDTO specificationsDTO;
}
