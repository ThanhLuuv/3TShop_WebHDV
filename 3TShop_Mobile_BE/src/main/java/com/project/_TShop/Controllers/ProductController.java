package com.project._TShop.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project._TShop.DTO.FeedbackDTO;
import com.project._TShop.DTO.ImagesDTO;
import com.project._TShop.DTO.ProductDTO;
import com.project._TShop.DTO.SimilarImage;
import com.project._TShop.Request.ProductWithSpecificationsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.project._TShop.Response.Response;
import com.project._TShop.Services.ProductService;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController()
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping("get-all")
    public ResponseEntity<Response> getAll(){
        Response response = productService.getAll();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("get-hot-products")
    public ResponseEntity<Response> getHotProduct(){
        Response response = productService.getHotProducts();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("get-new-products")
    public ResponseEntity<Response> getNewProduct(){
        Response response = productService.getNewProducts();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

//    {
//        "productDTO": {
//        "name": "Áo thun tay ngắn",
//                "description": "Áo thun tay ngắn, mặc thoáng mát cho mùa hè nóng bức.",
//                "price": 200000,
//                "sold": 3,
//                "which_gender": true,
//                "categoryDTO": {
//            "category_id": 1
//        }
//    },
//        "specificationsDTO": [
//        {
//            "quantity": 2,
//                "colorDTO": {
//            "color_id": 1
//        },
//            "sizeDTO": {
//            "size_id": 1
//        }
//        },
//        {
//            "quantity": 5,
//                "colorDTO": {
//            "color_id": 2
//        },
//            "sizeDTO": {
//            "size_id": 2
//        }
//        }
//    ]
//    }
    @PostMapping("add-product")
    public ResponseEntity<Response> addNewProduct(
            @RequestBody ProductWithSpecificationsRequest request
            ){
        Response response = productService.addProduct(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
//    {
//        "product_id": 12,
//            "status": 0
//    }
    @PutMapping("change-status")
    public ResponseEntity<Response> changeStatus(
            @RequestBody ProductDTO productDTO
    ){
        Response response = productService.changeStatusOfProduct(productDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("get-by-id/{id}")
    public ResponseEntity<Response> getById(
            @PathVariable("id") Integer id
            ){
        Response response = productService.getById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("get-by-ids")
    public ResponseEntity<Response> getByIds(
            @RequestParam("ids") List<String> ids
    ){
        Response response = productService.getByIds(ids);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("get-by-category-id/{id}")
    public ResponseEntity<Response> getByCategory(
            @PathVariable("id") Integer id
            ){
        Response response = productService.getByCategory(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }



    @GetMapping("get-by-name/{name}")
    public ResponseEntity<Response> getByName(@PathVariable("name") String name) {
        Response response = productService.getByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("get-by-category/{id}")
    public ResponseEntity<Response> getByCategoryIgnoreStatus(
            @PathVariable("id") Integer id
    ){
        Response response = productService.getByCategoryIgnoreStatus(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-available-product")
    public ResponseEntity<Response> getAvailable(){
        Response response = productService.getAvailableProduct();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("search")
    public ResponseEntity<Response> searchProduct(
            @RequestParam("name") String product_name
    ){
        Response response = productService.searchByName(product_name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestBody ImagesDTO imagesDTO) {
        Response response = productService.searchByImage(imagesDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/feed-back")
    public ResponseEntity<?> feedBack(@RequestBody FeedbackDTO feedbackDTO) {
        Response response = productService.feedBack(feedbackDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
