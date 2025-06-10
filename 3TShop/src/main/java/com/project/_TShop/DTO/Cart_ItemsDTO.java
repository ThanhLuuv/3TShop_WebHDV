package com.project._TShop.DTO;

import java.util.Date;

import lombok.Data;

@Data
public class Cart_ItemsDTO {
    private Integer card_item_id;
    private int quantity;
    private Date create_at;
    private CartDTO cartDTO;
    private SpecificationsDTO specificationsDTO;
}
