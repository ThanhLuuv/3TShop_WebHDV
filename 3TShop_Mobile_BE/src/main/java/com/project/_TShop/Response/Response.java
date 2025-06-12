package com.project._TShop.Response;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.project._TShop.DTO.*;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
    private int status;
    private String message;
    private String token;
    private String role;

    private String expirationTime;

    private UserDTO userDTO;
    private AccountDTO accountDTO;
    private CartDTO cartDTO;
    private Cart_ItemsDTO cart_ItemsDTO;
    private CategoryDTO categoryDTO;
    private ColorDTO colorDTO;
    private Delevery_InformationDTO delevery_InformationDTO;
    private ImagesDTO imagesDTO;
    private Order_DetailDTO order_DetailDTO;
    private Order_StatusDTO order_StatusDTO;
    private OrderDTO orderDTO;
    private ProductDTO productDTO;
    private RoleDTO roleDTO;
    private SizeDTO sizeDTO;
    private SpecificationsDTO specificationsDTO;
    private OrderResponse orderResponse;
    private float distance;

    private List<UserDTO> userDTOList;
    private List<AccountDTO> accountDTOList;
    private List<CartDTO> cartDTOList;
    private List<Cart_ItemsDTO> cart_ItemsDTOList;
    private List<CategoryDTO> categoryDTOList;
    private List<ColorDTO> colorDTOList;
    private List<Delevery_InformationDTO> delevery_InformationDTOList;
    private List<ImagesDTO> imagesDTOList;
    private List<Order_DetailDTO> order_DetailDTOList;
    private List<Order_StatusDTO> order_StatusDTOList;
    private List<OrderDTO> orderDTOList;
    private List<ProductDTO> productDTOList;
    private List<RoleDTO> roleDTOList;
    private List<SizeDTO> sizeDTOList;
    private List<SpecificationsDTO> specificationsDTOList;
    private List<OrderResponse> orderResponses;

    private List<Map<String, Object>> dataAnalysis;
    private Map<String, Object> dataAnalysisMap;
    private List<ProductSpecDTO> productSpecDTOList;

    private List<OrderStatusNumberDTO> orderStatusNumberDTOList;
    private List<SpendingDTO> spendingDTOList;

}