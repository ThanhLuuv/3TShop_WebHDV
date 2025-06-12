package com.project._TShop.DTO;
import java.sql.Date;
import lombok.Data;

@Data
public class UserDTO {
    private Integer user_id;
    private String f_name;
    private String l_name;
    private boolean gender;
    private String phone;
    private String email;
    private String date_of_birth;
    private AccountDTO accountDTO;
}
