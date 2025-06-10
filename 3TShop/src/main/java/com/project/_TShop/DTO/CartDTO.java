package com.project._TShop.DTO;

import com.project._TShop.Entities.Account;
import lombok.Data;

@Data
public class CartDTO {
    private Integer cart_id;
    private AccountDTO accountDTO;
}
