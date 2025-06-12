package com.project._TShop.Controllers;

import com.project._TShop.DTO.ColorDTO;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.AuthenticationService;
import com.project._TShop.Services.ColorService;
import com.project._TShop.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/color")
@RequiredArgsConstructor

public class ColorController {

    private final AuthenticationService authenticationService;
    private final ColorService colorService;


    @GetMapping("/get-all-colors")
    public ResponseEntity<?> getUserInfo(){
        Response response = colorService.getAllColor();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/add-new-color")
    public ResponseEntity<?> addNewColor(
            @RequestBody ColorDTO colorDTO
            ){
        Response response = colorService.addColor(colorDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PutMapping("/update-color")
    public ResponseEntity<?> updateColor(
            @RequestBody ColorDTO colorDTO
    ){
        Response response = colorService.updateColor(colorDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @DeleteMapping("/delete-color/{colorId}")
    public ResponseEntity<?> deleteColor(
            @PathVariable String colorId
    ){
        Response response = colorService.deleteColor(colorId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
