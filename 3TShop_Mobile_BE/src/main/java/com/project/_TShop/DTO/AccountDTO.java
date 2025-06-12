package com.project._TShop.DTO;

import lombok.Builder;
import lombok.Data;
import java.util.*;

@Data
public class AccountDTO {
    private Integer account_id;
    private String username;
    private String password;
    private String email;
    private Date createAt;
    private String reset_password_token;
    private String auth_provider;
    private boolean status;
    private Collection<RoleDTO> roleDTOs;
}
