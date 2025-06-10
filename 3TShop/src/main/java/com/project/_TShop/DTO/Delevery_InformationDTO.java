package com.project._TShop.DTO;

import java.util.Date;

import lombok.Data;

@Data
public class Delevery_InformationDTO {
    private Integer de_infor_id;
    private String name;
    private String phone;
    private String address_line_1;
    private String address_line_2;
    private boolean is_default;
    private Date create_at;
    private UserDTO userDTO;

    public void setIs_default(boolean is_default) {
        this.is_default = is_default;
    }
}
