package com.project._TShop.Request;

import lombok.Data;

import java.util.List;

@Data
public class ChangeSatusRequest {
    private Integer order_id;
    private String note;
    private int status;
}
