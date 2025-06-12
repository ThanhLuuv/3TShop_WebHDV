package com.project._TShop.Utils;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.project._TShop.DTO.AccountDTO;
import com.project._TShop.DTO.CartDTO;
import com.project._TShop.DTO.Cart_ItemsDTO;
import com.project._TShop.DTO.CategoryDTO;
import com.project._TShop.DTO.ColorDTO;
import com.project._TShop.DTO.Delevery_InformationDTO;
import com.project._TShop.DTO.ImagesDTO;
import com.project._TShop.DTO.OrderDTO;
import com.project._TShop.DTO.Order_DetailDTO;
import com.project._TShop.DTO.Order_StatusDTO;
import com.project._TShop.DTO.ProductDTO;
import com.project._TShop.DTO.RoleDTO;
import com.project._TShop.DTO.SizeDTO;
import com.project._TShop.DTO.SpecificationsDTO;
import com.project._TShop.DTO.UserDTO;
import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Cart;
import com.project._TShop.Entities.Cart_Items;
import com.project._TShop.Entities.Category;
import com.project._TShop.Entities.Color;
import com.project._TShop.Entities.Delevery_Infomation;
import com.project._TShop.Entities.Images;
import com.project._TShop.Entities.Order;
import com.project._TShop.Entities.Order_Detail;
import com.project._TShop.Entities.Order_Status;
import com.project._TShop.Entities.Product;
import com.project._TShop.Entities.Role;
import com.project._TShop.Entities.Size;
import com.project._TShop.Entities.Specifications;
import com.project._TShop.Entities.User;

public class Utils {
    public static UserDTO mapUser(User user){
        UserDTO userDTO = new UserDTO();
        userDTO.setAccountDTO(mapAccount(user.getAccount()));
        userDTO.setDate_of_birth(user.getDate_of_birth());
        userDTO.setEmail(user.getEmail());
        userDTO.setF_name(user.getF_name());
        userDTO.setGender(user.isGender());
        userDTO.setL_name(user.getL_name());
        userDTO.setPhone(user.getPhone());
        userDTO.setUser_id(user.getUser_id());
        return userDTO;
    }

    public static AccountDTO mapAccount(Account account){
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccount_id(account.getAccount_id());
        accountDTO.setUsername(account.getUsername());
        accountDTO.setPassword(account.getPassword());
        accountDTO.setEmail(account.getEmail());
        accountDTO.setStatus(account.isStatus());
        accountDTO.setCreateAt(account.getCreatedAt());
        accountDTO.setReset_password_token(account.getResetPasswordToken());
        accountDTO.setRoleDTOs(mapRoles(account.getRoles()));
        return accountDTO;
    }

    public static RoleDTO mapRole(Role role){
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setRole_id(role.getRole_id());
        roleDTO.setName(role.getName());
        return roleDTO;
    }

    public static Delevery_InformationDTO mapDelevery_Information(Delevery_Infomation delevery_Infomation){
        Delevery_InformationDTO delevery_InformationDTO = new Delevery_InformationDTO();
        delevery_InformationDTO.setAddress_line_1(delevery_Infomation.getAddress_line_1());
        delevery_InformationDTO.setAddress_line_2(delevery_Infomation.getAddress_line_2());
        delevery_InformationDTO.setCreate_at(delevery_Infomation.getCreated_at());
        delevery_InformationDTO.setDe_infor_id(delevery_Infomation.getDe_infor_id());
        delevery_InformationDTO.setIs_default(delevery_Infomation.is_default());
        delevery_InformationDTO.setName(delevery_Infomation.getName());
        delevery_InformationDTO.setPhone(delevery_Infomation.getPhone());
        delevery_InformationDTO.setUserDTO(mapUser(delevery_Infomation.getUser_id()));
        return delevery_InformationDTO;
    }

    public static ProductDTO mapProduct(Product product){
        ProductDTO productDTO = new ProductDTO();
        productDTO.setCategoryDTO(mapCategory(product.getCategory_id()));
        productDTO.setCreate_at(product.getCreated_at());
        productDTO.setDescription(product.getDescription());
        productDTO.setName(product.getName());
        productDTO.setImage(product.getImage());
        productDTO.setPrice(product.getPrice());
        productDTO.setProduct_id(product.getProduct_id());
        productDTO.setSold(product.getSold());
        productDTO.setStatus(product.getStatus());
        productDTO.setWhich_gender(product.getWhich_gender());
        return productDTO;
    }

    public static CategoryDTO mapCategory(Category category){
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setCategory_id(category.getCategory_id());
        categoryDTO.setCreate_at(category.getCreated_at());
        categoryDTO.setImage(category.getImage());
        categoryDTO.setName(category.getName());
        categoryDTO.setStatus(category.getStatus());
        return categoryDTO;
    }

    public static ImagesDTO mapImages(Images images){
        ImagesDTO imagesDTO = new ImagesDTO();
        imagesDTO.setImage_data(images.getImage_data());
        imagesDTO.setImage_id(images.getImage_id());
        imagesDTO.setProductDTO(mapProduct(images.getProduct()));
        return imagesDTO;
    }

    public static OrderDTO mapOrder(Order order){
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setAddress_line_1(order.getAddress_line_1());
        orderDTO.setAddress_line_2(order.getAddress_line_2());
        orderDTO.setDate(order.getDate());
        orderDTO.setName(order.getName());
        orderDTO.setOrder_id(order.getOrder_id());
        orderDTO.setPhone(order.getPhone());
        orderDTO.setTotal_price(order.getTotal_price());
        orderDTO.setUserDTO(mapUser(order.getUser_id()));
        return orderDTO;
    }

    public static ColorDTO mapColor(Color color){
        ColorDTO colorDTO = new ColorDTO();
        colorDTO.setColor_id(color.getColor_id());
        colorDTO.setHex(color.getHex());
        colorDTO.setCreateAt(color.getCreatedAt());
        colorDTO.setName(color.getName());
        return colorDTO;
    }

    public static Order_DetailDTO mapOrderDetail(Order_Detail order_Detail){
        Order_DetailDTO order_DetailDTO = new Order_DetailDTO();
        order_DetailDTO.setOrderDTO(mapOrder(order_Detail.getOrder()));
        order_DetailDTO.setOrder_detail_id(order_Detail.getOrder_detail_id());
        order_DetailDTO.setSpecificationsDTO(mapSpecifications(order_Detail.getSpecifications()));
        order_DetailDTO.setQuantity(order_Detail.getQuantity());
        return order_DetailDTO;
    }

    public static SizeDTO mapSize(Size size){
        SizeDTO sizeDTO = new SizeDTO();
        sizeDTO.setName(size.getName());
        sizeDTO.setSize_id(size.getSize_id());
        return sizeDTO;
    }

    public static CartDTO mapCart(Cart cart){
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCart_id(cart.getCart_id());
        cartDTO.setAccountDTO(mapAccount(cart.getAccount()));
        return cartDTO;
    }

    public static Cart_ItemsDTO mapCart_Items(Cart_Items cart_Items){
        Cart_ItemsDTO cart_ItemsDTO = new Cart_ItemsDTO();
        cart_ItemsDTO.setCard_item_id(cart_Items.getCart_items_id());
        cart_ItemsDTO.setCartDTO(mapCart(cart_Items.getCart()));
        cart_ItemsDTO.setCreate_at(cart_Items.getCreated_at());
        cart_ItemsDTO.setSpecificationsDTO(mapSpecifications(cart_Items.getSpecifications()));
        cart_ItemsDTO.setQuantity(cart_Items.getQuantity());
        return cart_ItemsDTO;
    }

    public static SpecificationsDTO mapSpecifications(Specifications specifications){
        SpecificationsDTO specificationsDTO = new SpecificationsDTO();
        specificationsDTO.setColorDTO(mapColor(specifications.getColor()));
        specificationsDTO.setProductDTO(mapProduct(specifications.getProduct()));
        specificationsDTO.setQuantity(specifications.getQuantity());
        specificationsDTO.setSizeDTO(mapSize(specifications.getSize_id()));
        specificationsDTO.setStatus(specifications.getStatus());
        specificationsDTO.setSpecifications_id(specifications.getSpecifications_id());
        return specificationsDTO;

    }

    public static Order_StatusDTO mapOrder_Status(Order_Status order_Status){
        Order_StatusDTO order_StatusDTO = new Order_StatusDTO();
        order_StatusDTO.setCreate_at(order_Status.getCreated_at());
        order_StatusDTO.setOrderDTO(mapOrder(order_Status.getOrder_id()));
        order_StatusDTO.setOrder_status_id(order_Status.getOrder_status_id());
        order_StatusDTO.setNote(order_Status.getNote());
        order_StatusDTO.setStatus(order_Status.getStatus());
        return order_StatusDTO;
    }

    public static Collection<RoleDTO> mapRoles(Collection<Role> roles) {
        return roles.stream()
                    .map(Utils::mapRole)
                    .collect(Collectors.toList());
    }

    public static List<UserDTO> mapUsers(List<User> users){
        return users.stream().map(Utils::mapUser).collect(Collectors.toList());
    }
    public static List<OrderDTO> mapOrders(List<Order> orders){
        return orders.stream().map(Utils::mapOrder).collect(Collectors.toList());
    }
    public static List<ProductDTO> mapProducts(List<Product> products){
        return products.stream().map(Utils::mapProduct).collect(Collectors.toList());
    }
    public static List<ColorDTO> mapColors(List<Color> colors){
        return colors.stream().map(Utils::mapColor).collect(Collectors.toList());
    }
    public static List<CategoryDTO> mapCategories(List<Category> categories){
        return categories.stream().map(Utils::mapCategory).collect(Collectors.toList());
    }
    public static List<Cart_ItemsDTO> mapCartItems(List<Cart_Items> cart_Items){
        return cart_Items.stream().map(Utils::mapCart_Items).collect(Collectors.toList());
    }
    public static List<SpecificationsDTO> mapSpecificationss(List<Specifications> specifications){
        return specifications.stream().map(Utils::mapSpecifications).collect(Collectors.toList());
    }
    public static List<Delevery_InformationDTO> mapDelevery_InformationDTOs(List<Delevery_Infomation> specifications){
        return specifications.stream().map(Utils::mapDelevery_Information).collect(Collectors.toList());
    }
}
