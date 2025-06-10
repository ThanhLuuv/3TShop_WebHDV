package com.project._TShop.Services;

import com.project._TShop.DTO.Order_DetailDTO;
import com.project._TShop.Entities.*;
import com.project._TShop.Exceptions.ResourceNotFoundException;
import com.project._TShop.Repositories.*;
import com.project._TShop.Request.ChangeSatusRequest;
import com.project._TShop.Request.GetCategorySoldQuantityRequest;
import com.project._TShop.Request.OrderDetailRequest;
import com.project._TShop.Response.OrderResponse;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.text.SimpleDateFormat;

@Service
@RequiredArgsConstructor
public class AnalysisService {
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
    @Autowired
    private final CategoryRepository categoryRepository;

    public Response getRevenue () {
        Response response = new Response();
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            List<Order_Status> orderStatusList3 = orderStatusRepository.findAllByStatus(3)
                    .orElseThrow(() -> new ResourceNotFoundException("Order_status", "status", 3));

            Map<String, BigDecimal> revenueByDate = new HashMap<>();
            Map<String, Integer> status1CountByDate = new HashMap<>();
            Map<String, Integer> status2CountByDate = new HashMap<>();
            Map<String, Integer> status3CountByDate = new HashMap<>();
            Map<String, Integer> quantityByDate = new HashMap<>();
            List<Order_Status> orderStatusList1 = orderStatusRepository.findAllByStatus(1)
                    .orElseThrow(() -> new ResourceNotFoundException("Order_status", "status", 1));
            List<Order_Status> orderStatusList2 = orderStatusRepository.findAllByStatus(2)
                    .orElseThrow(() -> new ResourceNotFoundException("Order_status", "status", 2));
            for (Order_Status orderStatus : orderStatusList3) {

                Order order = orderRepository.findById(orderStatus.getOrder_id().getOrder_id())
                        .orElseThrow(() -> new ResourceNotFoundException("Order", "ID", orderStatus.getOrder_id().getOrder_id()));

                List<Order_Detail> orderDetails = orderDetailRepository.findAllByOrder(order)
                        .orElseThrow(() -> new ResourceNotFoundException("Order_Detail", "order ID", order.getOrder_id()));;
                int totalQuantity = orderDetails.stream().mapToInt(Order_Detail::getQuantity).sum();

                String dateKey = dateFormat.format(orderStatus.getCreated_at());
                BigDecimal totalPrice = order.getTotal_price();

                revenueByDate.merge(dateKey, totalPrice, BigDecimal::add);
                status3CountByDate.merge(dateKey, 1, Integer::sum);
                quantityByDate.merge(dateKey, totalQuantity, Integer::sum);
            }

            for (Order_Status orderStatus : orderStatusList1) {
                String dateKey = dateFormat.format(orderStatus.getCreated_at());
                status1CountByDate.merge(dateKey, 1, Integer::sum);
            }

            for (Order_Status orderStatus : orderStatusList2) {
                String dateKey = dateFormat.format(orderStatus.getCreated_at());
                status2CountByDate.merge(dateKey, 1, Integer::sum);
            }

            List<Map<String, Object>> resultData = new ArrayList<>();
            for (String date : revenueByDate.keySet()) {
                Map<String, Object> data = new HashMap<>();
                data.put("date", date);
                data.put("total_price", revenueByDate.get(date));
                int orderCount = status1CountByDate.getOrDefault(date, 0) +
                        status2CountByDate.getOrDefault(date, 0) +
                        status3CountByDate.getOrDefault(date, 0);
                data.put("total_quantity", quantityByDate.get(date));
                data.put("order_count", orderCount);
                data.put("delivered_order_count",  status3CountByDate.getOrDefault(date, 0));
                resultData.add(data);
            }

            response.setStatus(200);
            response.setMessage("Success");
            response.setDataAnalysis(resultData);
        } catch (ResourceNotFoundException e) {
            response.setStatus(201);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    public Response getRevenueDetail() {
        Response response = new Response();

        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM"); // Định dạng: "yyyy-MM"
            SimpleDateFormat dateOnlyFormat = new SimpleDateFormat("dd"); // Định dạng ngày (dd)

            List<Order_Status> orderStatusList3 = orderStatusRepository.findAllByStatus(3)
                    .orElseThrow(() -> new ResourceNotFoundException("Order_status", "status", 3));

            // Map để lưu tổng doanh thu theo từng tháng của từng năm và theo ngày
            Map<String, Map<String, BigDecimal>> revenueByYearAndMonth = new HashMap<>();
            Map<String, Map<String, Map<String, BigDecimal>>> revenueByMonthAndDate = new HashMap<>();

            for (Order_Status orderStatus : orderStatusList3) {
                Order order = orderRepository.findById(orderStatus.getOrder_id().getOrder_id())
                        .orElseThrow(() -> new ResourceNotFoundException("Order", "ID", orderStatus.getOrder_id().getOrder_id()));

                // Lấy năm, tháng và ngày từ created_at
                String dateKey = dateFormat.format(orderStatus.getCreated_at());
                String[] dateParts = dateKey.split("-");
                String year = dateParts[0];  // Năm
                String month = dateParts[1]; // Tháng
                String day = dateOnlyFormat.format(orderStatus.getCreated_at()); // Ngày

                // Tổng doanh thu
                BigDecimal totalPrice = order.getTotal_price();

                // Cập nhật doanh thu theo năm và tháng
                revenueByYearAndMonth
                        .computeIfAbsent(year, k -> new HashMap<>()) // Tạo mới nếu chưa có năm
                        .merge(month, totalPrice, BigDecimal::add); // Cộng doanh thu cho tháng trong năm

                // Cập nhật doanh thu theo tháng và ngày
                revenueByMonthAndDate
                        .computeIfAbsent(year, k -> new HashMap<>())  // Tạo mới nếu chưa có năm
                        .computeIfAbsent(month, k -> new HashMap<>())  // Tạo mới nếu chưa có tháng
                        .merge(day, totalPrice, BigDecimal::add); // Cộng doanh thu cho ngày trong tháng
            }

            // Tạo danh sách kết quả cho từng năm và doanh thu theo từng tháng và ngày
            List<Map<String, Object>> result = new ArrayList<>();

            for (String year : revenueByYearAndMonth.keySet()) {
                Map<String, Object> yearData = new HashMap<>();
                yearData.put("year", year);

                List<Map<String, Object>> revenueByMonthList = new ArrayList<>();
                Map<String, BigDecimal> monthlyData = revenueByYearAndMonth.get(year);
                for (String month : monthlyData.keySet()) {
                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("month", month);
                    monthData.put("total_price", monthlyData.get(month));

                    // Lấy doanh thu theo ngày trong tháng
                    List<Map<String, Object>> revenueByDateList = new ArrayList<>();
                    Map<String, BigDecimal> dailyData = revenueByMonthAndDate.get(year).get(month);
                    for (String date : dailyData.keySet()) {
                        Map<String, Object> dateData = new HashMap<>();
                        dateData.put("date", date);
                        dateData.put("total_price", dailyData.get(date));
                        revenueByDateList.add(dateData);
                    }

                    monthData.put("revenue_by_date", revenueByDateList);
                    revenueByMonthList.add(monthData);
                }

                yearData.put("revenue_by_month", revenueByMonthList);
                result.add(yearData);
            }

            response.setStatus(200);
            response.setMessage("Success");
            response.setDataAnalysis(result);

        } catch (ResourceNotFoundException e) {
            response.setStatus(201);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }

        return response;

    }

    public Response getCategorySoldQuantity(GetCategorySoldQuantityRequest request) {
        Response response = new Response();

        try {

            List<Order_Status> orderStatuses = orderStatusRepository.findByStatusAndMonthYear( Integer.parseInt(request.getMonth()), Integer.parseInt(request.getYear()))
                    .orElseThrow(()-> new ResourceNotFoundException("Order Status", "month & year", request.getMonth()+"/"+request.getYear()));

            System.out.println("orderStatuses size: "+orderStatuses.size());
            Map<Integer, Integer> categorySales = new HashMap<>(); // Key: category_id, Value: tổng số lượng

            // Duyệt qua từng Order_Status để lấy các Order và Order_Detail
            for (Order_Status orderStatus : orderStatuses) {
                Order order = orderStatus.getOrder_id();  // Lấy Order từ Order_Status
                System.out.println("order id: "+order.getOrder_id());
                List<Order_Detail> orderDetails = orderDetailRepository.findByOrder(order);  // Lấy Order_Detail từ Order
                System.out.println("orderDetails size: "+orderDetails.size());

                // Duyệt qua từng Order_Detail để tính tổng số lượng bán
                for (Order_Detail orderDetail : orderDetails) {
                    Product product = orderDetail.getSpecifications().getProduct();  // Lấy Product từ Order_Detail
                    System.out.println("product: "+product.getProduct_id());

                    Category category = product.getCategory_id();  // Lấy Category từ Product
                    System.out.println("category: "+product.getCategory_id());

                    // Tính tổng số lượng bán theo Category
                    categorySales.put(category.getCategory_id(), categorySales.getOrDefault(category.getCategory_id(), 0) + orderDetail.getQuantity());
                }
            }

            // Chuyển đổi dữ liệu sang dạng yêu cầu
            List<Map<String, Object>> result = new ArrayList<>();
            for (Map.Entry<Integer, Integer> entry : categorySales.entrySet()) {
                System.out.println("category_id: "+entry.getKey());
                Category category = categoryRepository.findById(entry.getKey())
                        .orElseThrow(()->new ResourceNotFoundException("category", "ID", entry.getKey()));
                    Map<String, Object> categoryData = new HashMap<>();
                    categoryData.put("category_name", category.getName());
                    categoryData.put("total_sold", entry.getValue());
                    result.add(categoryData);

            }
            response.setStatus(200);
            response.setDataAnalysis(result);
        } catch (ResourceNotFoundException e) {
            response.setStatus(201);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }
}
