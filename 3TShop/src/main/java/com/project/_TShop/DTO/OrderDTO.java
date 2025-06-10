package com.project._TShop.DTO;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class OrderDTO {
    private Integer order_id;
    private String name;
    private String phone;
    private String address_line_1;
    private String address_line_2;
    private BigDecimal total_price;
    private Date date;
    private UserDTO userDTO;
}
