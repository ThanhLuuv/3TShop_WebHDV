package com.project._TShop.Controllers;

import com.project._TShop.Request.ChangeSatusRequest;
import com.project._TShop.Request.GetCategorySoldQuantityRequest;
import com.project._TShop.Request.OrderRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Services.AnalysisService;
import com.project._TShop.Services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analysis")
@RequiredArgsConstructor
public class AnalysisController {
    private final AnalysisService analysisService;


    @GetMapping("/get-revenue")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getRevenue(){
        Response response = analysisService.getRevenue();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/get-revenue-detail")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getRevenueDetail(){
        Response response = analysisService.getRevenueDetail();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/get-category-sold-quantity")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getCategorySoldQuantity(
            @RequestBody GetCategorySoldQuantityRequest request
            ){
        Response response = analysisService.getCategorySoldQuantity(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
