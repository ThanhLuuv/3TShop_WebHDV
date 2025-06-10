package com.project._TShop.Services;

import com.project._TShop.Response.Response;

public interface AuthenticationStrategy {
    Response authenticate(Object requestData);
}
