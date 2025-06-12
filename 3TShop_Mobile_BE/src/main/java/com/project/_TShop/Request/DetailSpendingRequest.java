package com.project._TShop.Request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DetailSpendingRequest {
    private String month;
    private String year;
}
