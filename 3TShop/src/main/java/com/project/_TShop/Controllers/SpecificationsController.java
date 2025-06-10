package com.project._TShop.Controllers;


import com.project._TShop.DTO.ProductDTO;
import com.project._TShop.DTO.SpecificationsDTO;
import com.project._TShop.Request.ProductWithSpecificationsRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.ProductService;
import com.project._TShop.Services.SpecificationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/specifications")
public class SpecificationsController {

    @Autowired
    SpecificationsService specificationsService;
  
    @GetMapping("/get-by-product/{id}")
    public ResponseEntity<Response> getByProduct(@PathVariable("id") int productId){
        Response response = specificationsService.getByProduct(productId);
        System.out.print("Lấy spec");
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @GetMapping("get-all")
    public ResponseEntity<Response> getAll(
            @RequestBody ProductDTO productDTO
    ){
        Response response = specificationsService.getAll(productDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
//    {
//        "specifications_id": 14,
//            "status": 0
//    }
    @PutMapping("change-status")
    public ResponseEntity<Response> changeStatus(
            @RequestBody SpecificationsDTO specificationsDTO
    ){
        Response response = specificationsService.changeStatusOfSpecifications(specificationsDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

//    {
//        "specifications_id": 14,
//            "colorDTO":{
//        "color_id":2
//    },
//        "quantity":20
//    }
    @PutMapping("update")
    public ResponseEntity<Response> update(
            @RequestBody SpecificationsDTO specificationsDTO
    ) {
        Response response = specificationsService.updateSpecifications(specificationsDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
