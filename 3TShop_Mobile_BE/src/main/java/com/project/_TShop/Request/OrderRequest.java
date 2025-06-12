package com.project._TShop.Request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private Integer idAddress;
    private String note;
    private BigDecimal fee;
    private List<OrderDetailRequest> orderRequests;
}
