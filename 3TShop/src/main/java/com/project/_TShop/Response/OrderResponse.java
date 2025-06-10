package com.project._TShop.Response;

import com.project._TShop.DTO.Order_DetailDTO;
import com.project._TShop.DTO.Order_StatusDTO;
import com.project._TShop.DTO.UserDTO;
import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Order_Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Integer order_id;
    private String name;
    private String phone;
    private String address_line_1;
    private String address_line_2;
    private BigDecimal total_price;
    private Date date;
    private String note;
    private List<Order_DetailDTO> orderDetailDTOS;
    private UserDTO userDTO;
    private Order_StatusDTO orderStatusDTO;
}
