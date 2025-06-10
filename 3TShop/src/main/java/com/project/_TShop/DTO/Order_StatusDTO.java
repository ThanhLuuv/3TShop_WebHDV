package com.project._TShop.DTO;

import java.util.Date;

import lombok.Data;

@Data
public class Order_StatusDTO {
    private Integer order_status_id;
    private int status;
    private Date create_at;
    private String note;
    private OrderDTO orderDTO;
}
