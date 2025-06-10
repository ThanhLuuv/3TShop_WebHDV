package com.project._TShop.Controllers;

import com.project._TShop.DTO.CategoryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project._TShop.Response.Response;
import com.project._TShop.Services.CategoryService;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    CategoryService categoryService;
    @GetMapping("/get-all")
    public ResponseEntity<Response> getAll(){
        Response response = categoryService.getAll();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
//    {
//        "name":"Áo Phông",
//            "image":"123223123123123312"
//    }
    @PostMapping("/add-category")
    public ResponseEntity<Response> addCategory(
            @RequestBody CategoryDTO categoryDTO
            ){
        Response response = categoryService.addCategory(categoryDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
//    {
//        "category_id": 1,
//            "name": "Áo thun",
//            "image": "13112312313131231321313123123123123131"
//    }
    @PutMapping("/update-category")
    public ResponseEntity<Response> updateCategory(
            @RequestBody CategoryDTO categoryDTO
    ){
        Response response = categoryService.updateCategory(categoryDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

//    http://localhost:8080/category/delete/1
    @DeleteMapping("/delete/{categoryId}")
    public ResponseEntity<Response> updateCategory(
            @PathVariable int categoryId
    ){
        Response response = categoryService.deleteCategory(categoryId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
