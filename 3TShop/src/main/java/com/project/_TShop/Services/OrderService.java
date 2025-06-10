package com.project._TShop.Services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import com.project._TShop.DTO.OrderDTO;
import com.project._TShop.DTO.Order_DetailDTO;
import com.project._TShop.DTO.Order_StatusDTO;
import com.project._TShop.Exceptions.ResourceNotFoundException;
import com.project._TShop.Request.ChangeSatusRequest;
import com.project._TShop.Response.OrderResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Color;
import com.project._TShop.Entities.Delevery_Infomation;
import com.project._TShop.Entities.Order;
import com.project._TShop.Entities.Order_Detail;
import com.project._TShop.Entities.Order_Status;
import com.project._TShop.Entities.Product;
import com.project._TShop.Entities.Size;
import com.project._TShop.Entities.Specifications;
import com.project._TShop.Entities.User;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.CartItemsRepository;
import com.project._TShop.Repositories.ColorRepository;
import com.project._TShop.Repositories.DeleveryInformationRepository;
import com.project._TShop.Repositories.OrderDetailRepository;
import com.project._TShop.Repositories.OrderRepository;
import com.project._TShop.Repositories.OrderStatusRepository;
import com.project._TShop.Repositories.ProductRepository;
import com.project._TShop.Repositories.SizeRepository;
import com.project._TShop.Repositories.SpecificationsRepository;
import com.project._TShop.Repositories.UserRepository;
import com.project._TShop.Request.OrderDetailRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.AppLogger;
import com.project._TShop.Utils.Utils;

import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeleveryInformationRepository deleveryInformationRepository;
    private final SizeRepository sizeRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final ProductRepository productRepository;
    private final SpecificationsRepository specificationsRepository;
    private final CartItemsRepository cartItemsRepository;
    private final ColorRepository colorRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Response createOrder(String username, Integer idAddress, String note, BigDecimal fee, List<OrderDetailRequest> orderRequests) {
        Response response = new Response();
        System.out.println("order-status note: " + note);
        try {
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Not found account"));
            User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Not found user"));
            Delevery_Infomation delevery_Infomation = deleveryInformationRepository.findById(idAddress)
                .orElseThrow(() -> new RuntimeException("Not found address"));
            Date date = new Date();
            Order order = new Order(
                delevery_Infomation.getName(),
                delevery_Infomation.getPhone(),
                delevery_Infomation.getAddress_line_1(),
                delevery_Infomation.getAddress_line_2(),
                BigDecimal.ZERO,
                date,
                user
            );
            orderRepository.save(order);
            BigDecimal totalPrice = BigDecimal.ZERO;
            for (OrderDetailRequest orderRequest : orderRequests) {
                Integer productId = orderRequest.getProductId();
                Integer colorId = orderRequest.getColorId();
                Integer sizeId = orderRequest.getSizeId();
                Integer quantity = orderRequest.getQuantity();

                Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Not found product"));
                Color color = colorRepository.findById(colorId)
                    .orElseThrow(() -> new RuntimeException("Not found color"));
                Size size = sizeRepository.findById(sizeId)
                    .orElseThrow(() -> new RuntimeException("Not found size"));

                Specifications specifications = specificationsRepository.findByColorAndSizeAndProduct(color, size, product)
                    .orElseThrow(() -> new RuntimeException("Not found specifications")); 
                BigDecimal price = specifications.getProduct().getPrice().multiply(BigDecimal.valueOf(quantity));
                totalPrice = totalPrice.add(price).add(fee);
                Order_Detail orderDetail = new Order_Detail(quantity, order, specifications);
                orderDetailRepository.save(orderDetail);
                specifications.setQuantity(specifications.getQuantity() - 1);
                specificationsRepository.save(specifications);
            }
            order.setTotal_price(totalPrice);
            orderRepository.save(order);
            Order_Status orderStatus = new Order_Status(1, date, order, note);
            AppLogger.getInstance().info("order-status: " +orderStatus);
            orderStatusRepository.save(orderStatus);

            for (OrderDetailRequest orderRequest : orderRequests) {
                Integer productId = orderRequest.getProductId();
                Integer colorId = orderRequest.getColorId();
                Integer sizeId = orderRequest.getSizeId();
                
                Specifications specifications = specificationsRepository.findByColorAndSizeAndProduct(
                    colorRepository.findById(colorId).get(),
                    sizeRepository.findById(sizeId).get(),
                    productRepository.findById(productId).get()
                )
                    .orElseThrow(()-> new RuntimeException("Not found specificatións"));

                cartItemsRepository.deleteBySpecifications(specifications);
            }

            response.setMessage("Order created successfully!");
            response.setOrderDTO(Utils.mapOrder(order));
            response.setStatus(200);
        } catch (RuntimeException e) {
            response.setStatus(202);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            AppLogger.getInstance().equals("Error "+ e.toString());
            response.setMessage("Error: " + e.toString());
            response.setStatus(500);
            e.printStackTrace();
        }
        return response;
    }

    public Response getOrders(int status) {
        Response response = new Response();
            try{
                List<Order_Status> orderStatusList = new ArrayList<>();
                if(status == 0){
                    orderStatusList = orderStatusRepository.findAll();
                }else{
                    orderStatusList = orderStatusRepository.findAllByStatus(status)
                            .orElseThrow(()-> new ResourceNotFoundException("Order_status", "status", status));
                }
                System.out.print("list order_status size:"+orderStatusList.size());
                List<OrderResponse> orderResponses = new ArrayList<>();

                if (!orderStatusList.isEmpty()){
                    for (Order_Status order_status:orderStatusList) {
                        Order order = orderRepository.findById(order_status.getOrder_id().getOrder_id())
                                .orElseThrow(()-> new ResourceNotFoundException("Order", "ID", order_status.getOrder_id().getOrder_id()));
                        List<Order_Detail> orderDetail = orderDetailRepository.findAllByOrder(order)
                                .orElseThrow(()-> new ResourceNotFoundException("Order_detail", "ID", order_status.getOrder_id().getOrder_id()));
                        List<Order_DetailDTO> orderDetailDTOS = orderDetail.stream()
                                .map(Utils::mapOrderDetail)
                                .toList();
                        User user = userRepository.findById(order.getUser_id().getUser_id())
                                .orElseThrow(()-> new ResourceNotFoundException("User", "ID", order.getUser_id().getUser_id()));
                        OrderResponse orderResponse = OrderResponse.builder()
                                .orderDetailDTOS(orderDetailDTOS)
                                .order_id(order.getOrder_id())
                                .address_line_1(order.getAddress_line_1())
                                .address_line_2(order.getAddress_line_2())
                                .name(order.getName())
                                .phone(order.getPhone())
                                .total_price(order.getTotal_price())
                                .date(order.getDate())
                                .note(order_status.getNote())
                                .userDTO(Utils.mapUser(user))
                                .orderStatusDTO(Utils.mapOrder_Status(order_status))
                                .build();
                        orderResponses.add(orderResponse);
                    }
                }
                response.setStatus(200);
                response.setOrderResponses(orderResponses);

            }catch (ResourceNotFoundException e){
                response.setStatus(201);
                response.setMessage(e.getMessage());
            }catch (Exception e){
                response.setStatus(500);
                response.setMessage(e.getMessage());
            }

        return response;
    }

    public Response changeStatusOfOrder(ChangeSatusRequest changeSatusRequest) {
        Response response = new Response();
        try{
            Order order = orderRepository.findById(changeSatusRequest.getOrder_id())
                    .orElseThrow(()-> new ResourceNotFoundException("Order", "ID", changeSatusRequest.getOrder_id()));
            Order_Status orderStatus = orderStatusRepository.findByOrder(order)
                    .orElseThrow(()-> new ResourceNotFoundException("Order status", "ID", order.getOrder_id()));
            if(changeSatusRequest.getStatus() == 3){
                List<Order_Detail> orderDetails = orderDetailRepository.findAllByOrder(order)
                        .orElseThrow(()-> new ResourceNotFoundException("OrderDetail", "Order ID", order.getOrder_id()));
                for (Order_Detail orderDetail: orderDetails) {
                    Specifications specification = specificationsRepository.findById(orderDetail.getSpecifications().getSpecifications_id())
                            .orElseThrow(()-> new ResourceNotFoundException("Specification", "ID", orderDetail.getSpecifications().getSpecifications_id()));
                    Product product = productRepository.findById(specification.getProduct().getProduct_id())
                            .orElseThrow(()-> new ResourceNotFoundException("Product", "ID", specification.getProduct().getProduct_id()));
                    product.setSold(product.getSold()+ orderDetail.getQuantity());
                    productRepository.save(product);
                }
            }else if(changeSatusRequest.getStatus() == 4){
                List<Order_Detail> orderDetails = orderDetailRepository.findAllByOrder(order)
                        .orElseThrow(()-> new ResourceNotFoundException("OrderDetail", "Order ID", order.getOrder_id()));
                for (Order_Detail orderDetail: orderDetails) {
                    Specifications specification = specificationsRepository.findById(orderDetail.getSpecifications().getSpecifications_id())
                            .orElseThrow(()-> new ResourceNotFoundException("Specification", "ID", orderDetail.getSpecifications().getSpecifications_id()));
                    orderStatus.setNote(changeSatusRequest.getNote());
                    orderStatus.setCreated_at(new Date());
                    specification.setQuantity(specification.getQuantity()+ orderDetail.getQuantity());
                    specificationsRepository.save(specification);
                }
            }
            orderStatus.setStatus(changeSatusRequest.getStatus());
            orderStatusRepository.save(orderStatus);
            response.setStatus(200);
            response.setMessage("Change status success");
        }catch (ResourceNotFoundException e){
            response.setStatus(201);
            response.setMessage(e.getMessage());
        }catch (Exception e){
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response getOrderByStatus(int status) {
        Response response = new Response();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            User user = userRepository.findByAccount(account)
                    .orElseThrow(() -> new RuntimeException("User not found"));
    
            List<Order> orders = orderRepository.findAllByUser(user);
            if (!orders.isEmpty()) {
                List<OrderResponse> orderResponses = new ArrayList<>();
    
                for (Order order : orders) {
                    Order_Status orderStatus = orderStatusRepository.findByOrder(order)
                            .orElseThrow(() -> new RuntimeException("Order status not found"));
                    
                    if (orderStatus.getStatus() == status) {
                        List<Order_Detail> orderDetails = orderDetailRepository.findAllByOrder(order)
                                .orElseThrow(() -> new RuntimeException("Not found order detail!"));
                        List<Order_DetailDTO> orderDetailDTOs = orderDetails.stream()
                                .map(Utils::mapOrderDetail)
                                .toList();
    
                        OrderResponse orderResponse = OrderResponse.builder()
                                .orderDetailDTOS(orderDetailDTOs)
                                .order_id(order.getOrder_id())
                                .address_line_1(order.getAddress_line_1())
                                .address_line_2(order.getAddress_line_2())
                                .name(order.getName())
                                .phone(order.getPhone())
                                .note(orderStatus.getNote())
                                .total_price(order.getTotal_price())
                                .date(order.getDate())
                                .userDTO(Utils.mapUser(user))
                                .orderStatusDTO(Utils.mapOrder_Status(orderStatus))
                                .build();
                        orderResponses.add(orderResponse);
                    }
                }
    
                if (!orderResponses.isEmpty()) {
                    response.setStatus(200);
                    response.setOrderResponses(orderResponses);
                } else {
                    response.setStatus(202);
                    response.setMessage("No orders with the specified status");
                }
            } else {
                response.setStatus(202);
                response.setMessage("No orders found");
            }
        } catch (RuntimeException e) {
            response.setStatus(201);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }    
}
