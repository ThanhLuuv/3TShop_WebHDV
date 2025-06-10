package com.project._TShop.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project._TShop.DTO.Delevery_InformationDTO;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.DeleveryInformationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/delevery-information")
public class DeleveryInformationController {
    private final DeleveryInformationService deleveryInformationService;

    @GetMapping("/get-by-user")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> getByUser(){
        Response response = deleveryInformationService.getByUsername();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/set-default/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> setDefault(@PathVariable("id") Integer idAddress){
        System.out.print("Xet mac định");
        Response response = deleveryInformationService.setDefault(idAddress);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> deleteAddress(@PathVariable("id") Integer idAddress){
        System.out.print("Xóa địa chỉ");
        Response response = deleveryInformationService.deleteById(idAddress);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> addDelevery(@RequestBody Delevery_InformationDTO delevery_InformationDTO){
        System.out.print(delevery_InformationDTO);
        Response response = deleveryInformationService.createNew(delevery_InformationDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/edit")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Response> editDelevery(@RequestBody Delevery_InformationDTO delevery_InformationDTO){
        System.out.print(delevery_InformationDTO);
        Response response = deleveryInformationService.editDelevery(delevery_InformationDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
