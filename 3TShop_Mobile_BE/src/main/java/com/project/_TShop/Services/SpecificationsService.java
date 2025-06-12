package com.project._TShop.Services;


import com.project._TShop.DTO.ProductDTO;
import com.project._TShop.DTO.SpecificationsDTO;
import com.project._TShop.Entities.*;
import com.project._TShop.Exceptions.ResourceNotFoundException;
import com.project._TShop.Repositories.*;
import com.project._TShop.Request.ProductWithSpecificationsRequest;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecificationsService {
@Autowired

    ProductRepository productRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    ColorRepository colorRepository;
    @Autowired
    SizeRepository sizeRepository;
    @Autowired
    SpecificationsRepository specificationsRepository;
    
   public Response getByProduct(Integer productId){
        Response response = new Response();
        try {
            Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Not found product"));
            List<Specifications> specifications = specificationsRepository.findByProduct(product);
            System.out.println("lấy spec 2" + specifications);
            response.setStatus(200);
            response.setMessage("Get success");
            response.setSpecificationsDTOList(Utils.mapSpecificationss(specifications));
        }catch (RuntimeException e){
            response.setStatus(201);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        return response;
    }

    public Response getAll(ProductDTO productDTO){
        Response response = new Response();
        try {
            System.out.println("product_id: "+productDTO.getProduct_id());
            List<Specifications> specifications = specificationsRepository.findAllByProductId(productDTO.getProduct_id())
                    .orElseThrow(()-> new ResourceNotFoundException("Specifications", "ProductId",productDTO.getProduct_id()));
            System.out.println("Specifications found: " + specifications.size());
            List<SpecificationsDTO> specificationsDTOList = specifications.stream()
                    .map(Utils::mapSpecifications)
                    .toList();
            response.setStatus(200);
            response.setSpecificationsDTOList(specificationsDTOList);
        }catch (ResourceNotFoundException e){
            response.setStatus(201);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e);
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response changeStatusOfSpecifications(SpecificationsDTO specificationsDTO) {
        Response response = new Response();
        try{
            System.out.println("specificationsDTO :"+ specificationsDTO.getSpecifications_id());
            Specifications specifications = specificationsRepository.findBySpecificationsId(specificationsDTO.getSpecifications_id())
                    .orElseThrow(()-> new ResourceNotFoundException("Specifications", "Id", specificationsDTO.getSpecifications_id()));
            specifications.setStatus(specificationsDTO.getStatus());
            specificationsRepository.save(specifications);
            response.setStatus(200);
            response.setMessage("Change status specification success");
        }catch (ResourceNotFoundException e){
            response.setStatus(201);
            response.setMessage(e.getMessage());
        }catch (Exception e){
            response.setStatus(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public Response updateSpecifications(SpecificationsDTO specificationsDTO) {
        Response response = new Response();
        System.out.println("specificationsDTO :" + specificationsDTO.getColorDTO().getColor_id());

        try {
            Specifications specifications = specificationsRepository.findBySpecificationsId(specificationsDTO.getSpecifications_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Specifications", "Id", specificationsDTO.getSpecifications_id()));
            Color color = colorRepository.findByColorId(specificationsDTO.getColorDTO().getColor_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Color", "ID", specificationsDTO.getColorDTO().getColor_id()));
            specifications.setColor(color);
            specifications.setQuantity(specificationsDTO.getQuantity());
            specificationsRepository.save(specifications);
            response.setStatus(200);
            response.setMessage("Update specification success");
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
