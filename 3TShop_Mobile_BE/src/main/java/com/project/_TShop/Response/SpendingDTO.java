package com.project._TShop.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpendingDTO {
    private Integer order_id;
    private BigDecimal total_price;
    private Date date;
}
