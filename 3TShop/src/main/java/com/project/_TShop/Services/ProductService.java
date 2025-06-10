package com.project._TShop.Services;

import java.util.*;
import java.util.stream.Collectors;

import com.project._TShop.DTO.*;
import com.project._TShop.Entities.*;
import com.project._TShop.Exceptions.ResourceNotFoundException;
import com.project._TShop.Repositories.*;
import com.project._TShop.Request.ProductWithSpecificationsRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ProductService {
@Autowired

    ProductRepository productRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    ColorRepository colorRepository;
    @Autowired
    SizeRepository sizeRepository;
    @Autowired
    SpecificationsRepository specRepo;
    @Autowired
    ImagesRepository imageRepository;
    @Autowired
    UserSearchHistoryRepository searchHistoryRepository;

    public Response getAll(){
        Response response = new Response();
        try {
            List<Product> products = productRepository.findAll();
            response.setStatus(200);
            response.setMessage("Get all product success");
            response.setProductDTOList(Utils.mapProducts(products));
        } catch (Exception e) {
            System.out.println(e);
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response getAvailableProduct(){
        Response response = new Response();
        try {
            List<Product> products = productRepository.findAvailableProducts();
            response.setStatus(200);
            response.setMessage("Get all product success");
            response.setProductDTOList(Utils.mapProducts(products));
        } catch (Exception e) {
            System.out.println(e);
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response getById(Integer id){
        Response response = new Response();
        try {
            Optional<Product> product = productRepository.findById(id);
            if(product.isPresent()){
                response.setStatus(200);
                response.setMessage("Get product success");
                response.setProductDTO(Utils.mapProduct(product.get()));
            }else{
                response.setStatus(201);
                response.setMessage("Not found product");
            }
        } catch (Exception e) {
            System.out.println(e);
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    // public Response getByCategory(Integer id){
    //     Response response = new Response();
    //     try {
    //         Optional<Category> category = categoryRepository.findById(id);
    //         if(category.isPresent()){
    //             List<Product> products = productRepository.findByCategory(category.get().getCategory_id());
    //             response.setStatus(200);
    //             response.setMessage("Get products success");
    //             response.setProductDTOList(Utils.mapProducts(products));
    //         }else{
    //             response.setStatus(202);
    //             response.setMessage("Not found categorys");
    //         }
    //     } catch (Exception e) {
    //         System.out.println(e);
    //         response.setStatus(500);
    //         response.setMessage("Server error");
    //     }
    //     return response;
    // }

    public Response getHotProducts() {
        Response response = new Response();
        try {
            List<Product> products = productRepository.findAvailableProducts();
            products.sort(Comparator.comparingInt(Product::getSold).reversed());
            List<Product> top10Products = products.stream().limit(10).toList();
            response.setStatus(200);
            response.setMessage("Get hot products success");
            response.setProductDTOList(Utils.mapProducts(top10Products));
        } catch (Exception e) {
            System.out.println("Lỗi: " + e.getMessage());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    // public Response getByCategory(Integer idCategory) {
    //     Response response = new Response();
    //     try {
    //         Category category = categoryRepository.findById(idCategory)
    //             .orElseThrow(() -> new RuntimeException("Category not found"));
    //         List<Product> products = productRepository.findAvailableProducts();
    //         List<Product> filteredProducts = products.stream()
    //             .filter(product -> product.getCategory_id().equals(category)) 
    //             .limit(10) 
    //             .toList();
    //         response.setStatus(200);
    //         response.setMessage("Get products by category success");
    //         response.setProductDTOList(Utils.mapProducts(filteredProducts));
    //     } catch (RuntimeException e) {
    //         response.setStatus(202);
    //         response.setMessage(e.getMessage());
    //     } catch (Exception e) {
    //         System.out.println("Lỗi: " + e.getMessage());
    //         response.setStatus(500);
    //         response.setMessage("Server error");
    //     }
    //     return response;
    // } 
    
    // public Response getByName(String name) {
    //     Response response = new Response();
    //     try {
    //         String formattedName = name.replace("-", " ");
            
    //         List<Product> products = productRepository.findByNameContainingIgnoreCase(formattedName);
            
    //         if (products.isEmpty()) {
    //             response.setStatus(202);
    //             response.setMessage("Không tìm thấy sản phẩm với tên: " + formattedName);
    //         } else {
    //             response.setStatus(200);
    //             response.setMessage("Tìm thấy sản phẩm thành công");
    //             response.setProductDTOList(Utils.mapProducts(products));
    //         }
    //     } catch (Exception e) {
    //         System.out.println("Lỗi: " + e.getMessage());
    //         response.setStatus(500);
    //         response.setMessage("Lỗi máy chủ");
    //     }
    //     return response;
    // }    

     private ProductSpecDTO mapToProductSpecDTO(Product product, List<Specifications> specs) {
        List<ProductSpecDTO.SpecificationInfo> specInfoList = specs.stream()
            .map(spec -> ProductSpecDTO.SpecificationInfo.builder()
                .size(spec.getSize_id().getName())
                .color(spec.getColor().getHex())
                .quantity(spec.getQuantity())
                .build())
            .collect(Collectors.toList());

        return ProductSpecDTO.builder()
            .product_id(product.getProduct_id())
            .name(product.getName())
            .description(product.getDescription())
            .image(product.getImage())
            .price(product.getPrice())
            .sold(product.getSold())
            .which_gender(product.getWhich_gender())
            .created_at(product.getCreated_at())
            .status(product.getStatus())
            .categoryName(product.getCategory_id().getName())
            .specifications(specInfoList)
            .build();
    }

    public Response getByCategory(Integer idCategory) {
        Response response = new Response();
        try {
            Category category = categoryRepository.findById(idCategory)
                .orElseThrow(() -> new RuntimeException("Category not found"));
            
            List<Product> products = productRepository.findAvailableProducts();
            List<Product> filteredProducts = products.stream()
                .filter(product -> product.getCategory_id().equals(category))
                .limit(10)
                .collect(Collectors.toList());

            List<ProductSpecDTO> productSpecDTOs = filteredProducts.stream()
                .map(product -> {
                    List<Specifications> specs = specRepo
                        .findByProductAndStatus(product, 1); 
                    return mapToProductSpecDTO(product, specs);
                })
                .collect(Collectors.toList());

            response.setStatus(200);
            response.setMessage("Get products by category success");
            response.setProductSpecDTOList(productSpecDTOs);
        } catch (RuntimeException e) {
            response.setStatus(202);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            System.out.println("Lỗi: " + e.getMessage());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }
   
    public Response getByName(String name) {
        Response response = new Response();
        try {
            String formattedName = name.replace("-", " ");
           
            List<Product> products = productRepository.findByNameContainingIgnoreCase(formattedName);
           
            if (products.isEmpty()) {
                response.setStatus(202);
                response.setMessage("Không tìm thấy sản phẩm với tên: " + formattedName);
            } else {
                List<ProductSpecDTO> productSpecDTOs = products.stream()
                    .map(product -> {
                        List<Specifications> specs = specRepo
                            .findByProductAndStatus(product, 1);
                        return mapToProductSpecDTO(product, specs);
                    })
                    .collect(Collectors.toList());

                response.setStatus(200);
                response.setMessage("Tìm thấy sản phẩm thành công");
                response.setProductSpecDTOList(productSpecDTOs);
            }
        } catch (Exception e) {
            System.out.println("Lỗi: " + e.getMessage());
            response.setStatus(500);
            response.setMessage("Lỗi máy chủ");
        }
        return response;
    }

    public Response getNewProducts() {
        Response response = new Response();
        try {
            List<Product> products = productRepository.findAvailableProducts();
            products.sort(Comparator.comparing(Product::getCreated_at).reversed());
            List<Product> top10NewProducts = products.stream().limit(10).toList();
            response.setStatus(200);
            response.setMessage("Get new products success");
            response.setProductDTOList(Utils.mapProducts(top10NewProducts));
        } catch (Exception e) {
            System.out.println("Lỗi: " + e.getMessage());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;

    }
    @Transactional
    public Response addProduct(ProductWithSpecificationsRequest request) {

        Response response = new Response();
        try {
            ProductDTO productDTO = request.getProductDTO();
            List<SpecificationsDTO> specificationsDTOList = request.getSpecificationsDTO();
            List<ImagesDTO> imagesDTOS = request.getImagesDTOS();
            Category category = categoryRepository.findByCategoryId(productDTO.getCategoryDTO().getCategory_id());
            if (category == null) {
                response.setStatus(201);
                response.setMessage("Category not found");
                return response;
            }
            for (SpecificationsDTO spec : specificationsDTOList) {
                colorRepository.findByColorId(spec.getColorDTO().getColor_id())
                        .orElseThrow(()-> new ResourceNotFoundException("Color", "ID", spec.getColorDTO().getColor_id()));
                sizeRepository.findBySizeId(spec.getSizeDTO().getSize_id())
                        .orElseThrow(()-> new ResourceNotFoundException("Size", "ID", spec.getSizeDTO().getSize_id()));
            }

            var product = Product.builder()
                    .name(productDTO.getName())
                    .description(productDTO.getDescription())
                    .price(productDTO.getPrice())
                    .sold(productDTO.getSold())
                    .which_gender(productDTO.getWhich_gender())
                    .image(imagesDTOS.get(0).getImage_data())
                    .created_at(new Date())
                    .category_id(category)
                    .status(1)
                    .build();
            Product savedProduct = productRepository.save(product); // Save the Product only after validation

            for (ImagesDTO imageDTO: imagesDTOS) {
                var image = Images.builder()
                        .image_data(imageDTO.getImage_data())
                        .product(product)
                        .build();
                imageRepository.save(image);
            }
            for (SpecificationsDTO spec : specificationsDTOList) {
                Color color = colorRepository.findByColorId(spec.getColorDTO().getColor_id())
                        .orElseThrow(()-> new ResourceNotFoundException("Color", "ID", spec.getColorDTO().getColor_id()));
                Size size = sizeRepository.findBySizeId(spec.getSizeDTO().getSize_id())
                        .orElseThrow(()-> new ResourceNotFoundException("Size", "ID", spec.getSizeDTO().getSize_id()));
                if (size != null && color != null) {
                    var specification = Specifications.builder()
                            .color(color)
                            .product(savedProduct)
                            .size_id(size)
                            .quantity(spec.getQuantity())
                            .status(1)
                            .build();
                    specRepo.save(specification);
                }
            }
            productRepository.flush();
            imageRepository.flush();
            specRepo.flush();
//            try {
//                RestTemplate restTemplate = new RestTemplate();
//                String apiUrl = "http://localhost:5000/api/train";
//                ResponseEntity<String> pythonResponse = restTemplate.postForEntity(apiUrl, null, String.class);
//                System.out.println("Python API Response: " + pythonResponse.getBody());
//            } catch (Exception ex) {
//                System.err.println("Failed to call Python API: " + ex.getMessage());
//            }
//            response.setStatus(200);
//            response.setMessage("Add new product and specification success");
            new Thread(() -> {
                try {
                    RestTemplate restTemplate = new RestTemplate();
                    String apiUrl = "http://localhost:5000/api/train";
                    ResponseEntity<String> pythonResponse = restTemplate.postForEntity(apiUrl, null, String.class);
                    System.out.println("Python API Response: " + pythonResponse.getBody());
                } catch (Exception ex) {
                    System.err.println("Failed to call Python API: " + ex.getMessage());
                }
            }).start();
            response.setStatus(200);
            response.setMessage("Add new product and specification success");
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

    public Response changeStatusOfProduct(ProductDTO productDTO) {
        Response response = new Response();
        try {
            Product product = productRepository.findByProductId(productDTO.getProduct_id())
                    .orElseThrow(()-> new ResourceNotFoundException("Product", "ID", productDTO.getProduct_id()));
            product.setStatus(productDTO.getStatus());
            productRepository.save(product);
            response.setStatus(200);
            response.setMessage("Change status success");
        }catch (ResourceNotFoundException e){
            response.setStatus(201);
            response.setMessage(e.getMessage());
        }catch (Exception e){
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response searchByName(String productName) {
        System.out.println("Product name: "+productName);
        Response response = new Response();
        try {
            List<Product> products = productRepository.findByNameContaining(productName)
                    .orElseThrow(()-> new ResourceNotFoundException("Product", "name", productName));
            List<ProductDTO> productsDTOList = products.stream()
                    .map(Utils::mapProduct)
                    .toList();
            response.setStatus(200);
            response.setProductDTOList(productsDTOList);
        }catch (ResourceNotFoundException e){
            response.setStatus(201);
            response.setMessage(e.getMessage());
        }catch (Exception e){
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response getByCategoryIgnoreStatus(Integer idCategory) {
        Response response = new Response();
        try {
            List<Product> products = productRepository.findByCategory(idCategory);
            response.setStatus(200);
            response.setMessage("Get products by category success");
            response.setProductDTOList(Utils.mapProducts(products));
        } catch (RuntimeException e) {
            response.setStatus(202);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            System.out.println("Lỗi: " + e.getMessage());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }
    public Response searchByImage(ImagesDTO imagesDTO) {
        Response response = new Response();
        try {
            UserSearchHistory searchHistory = new UserSearchHistory();
            searchHistory.setSearchImage(imagesDTO.getImage_data());
            searchHistory.setSearchedAt(new Date());
            UserSearchHistory searchHistoried = searchHistoryRepository.save(searchHistory);

            String pythonApiUrl = "http://localhost:5000/api/find-similar-images";
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> responseFromPy = restTemplate.
                    postForEntity(pythonApiUrl, imagesDTO.getImage_data(), String.class);
            ObjectMapper objectMapper = new ObjectMapper();

            List<SimilarImage> similarImages = objectMapper.readValue(responseFromPy.getBody(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, SimilarImage.class));
            List<Product> productDTOAvailable = productRepository.findAvailableProducts();
            List<Product> resultList = new ArrayList<>();
            System.out.println(similarImages.get(0));
//            searchHistory.setSimilarityScore(similarImages.get(0).getDistance());

            for (SimilarImage e: similarImages) {
                Product product = productRepository.findById(e.getProduct_id())
                        .orElseThrow(()-> new ResourceNotFoundException("Product", "ID", e.getProduct_id()));
                if(productDTOAvailable.contains(product)){
                    resultList.add(product);
                }
            }
            List<ProductSpecDTO> productSpecDTOs = resultList.stream()
                    .map(product -> {
                        List<Specifications> specs = specRepo
                            .findByProductAndStatus(product, 1);
                        return mapToProductSpecDTO(product, specs);
                    })
                    .collect(Collectors.toList());
            response.setStatus(200);
            response.setMessage(searchHistoried.getSearchId().toString());
            response.setProductSpecDTOList(productSpecDTOs);
            //test git
        } catch (Exception e) {
            System.out.print(e.toString());
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response feedBack(FeedbackDTO feedbackDTO) {
        Response response = new Response();
        try {
            UserSearchHistory searchHistory = searchHistoryRepository.findById(feedbackDTO.getSearchId())
                    .orElseThrow(()-> new ResourceNotFoundException("SearchHistory", "ID", feedbackDTO.getSearchId()));
            searchHistory.setFeedback(feedbackDTO.isFeedback());
            String pythonApiUrl = "http://localhost:5000/api/user-feedback";  // Update with your actual Python API URL
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("image_data", searchHistory.getSearchImage());
            payload.put("product_id", feedbackDTO.getProduct_id());
            payload.put("feedback", feedbackDTO.isFeedback());
            System.out.println("product_id"+ feedbackDTO.getProduct_id());
            System.out.println("image_data"+ searchHistory.getSearchImage());
            System.out.println("feedback"+ feedbackDTO.isFeedback());

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> responseFromPy = restTemplate.postForEntity(
                    pythonApiUrl,  // The Python API URL
                    requestEntity, // The HttpEntity containing payload and headers
                    String.class   // Response type
            );
            // Handle response from Python API
            if (responseFromPy.getStatusCode().is2xxSuccessful()) {
                response.setStatus(200);
                response.setMessage("Feedback sent successfully");
            } else {
                response.setStatus(responseFromPy.getStatusCodeValue());
                response.setMessage("Failed to send feedback");
            }


        }catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }

    public Response getByIds(List<String> ids) {
        Response response = new Response();
        try {
            List<Product> resultList = new ArrayList<>();
            for (String id : ids) {
                Product product = productRepository.findById(Integer.parseInt(id))
                        .orElseThrow(()-> new ResourceNotFoundException("Product", "id", id));
                if (product != null) {
                    resultList.add(product);
                }
            }
            List<ProductSpecDTO> productSpecDTOs = resultList.stream()
                    .map(product -> {
                        List<Specifications> specs = specRepo
                                .findByProductAndStatus(product, 1);
                        return mapToProductSpecDTO(product, specs);
                    })
                    .collect(Collectors.toList());
            response.setStatus(200);
            response.setProductSpecDTOList(productSpecDTOs);
        }catch (Exception e){
            response.setStatus(500);
            response.setMessage("Server error");
        }
        return response;
    }
}
