package com.project._TShop.Services;

import java.util.Date;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project._TShop.DTO.Delevery_InformationDTO;
import com.project._TShop.Entities.Account;
import com.project._TShop.Entities.Delevery_Infomation;
import com.project._TShop.Entities.User;
import com.project._TShop.Repositories.AccountRepository;
import com.project._TShop.Repositories.DeleveryInformationRepository;
import com.project._TShop.Repositories.UserRepository;
import com.project._TShop.Response.Response;
import com.project._TShop.Utils.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleveryInformationService {
    private final DeleveryInformationRepository deleveryInformationRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public Response getByUsername(){
        Response response = new Response();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            System.out.println("username"+username);
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
            User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));
            List<Delevery_Infomation> deleveryInformations = deleveryInformationRepository.findByUser(user);
            if(deleveryInformations.size() > 0){
                response.setStatus(200);
                response.setDelevery_InformationDTOList(Utils.mapDelevery_InformationDTOs(deleveryInformations));
            }else{
                response.setStatus(202);
                response.setMessage("Delevery is empty");
            }
        }catch(RuntimeException e){
            response.setStatus(400);
            response.setMessage(e.getMessage());
            System.out.println("lỗi "+ e.getMessage());
        }
        catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        return response;
    }

    public Response createNew(Delevery_InformationDTO delevery_InformationDTO){
        Response response = new Response();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
            User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Delevery_Infomation delevery_InfomationDefault = deleveryInformationRepository.findDefaultByUser(user);
            boolean isDefault = delevery_InfomationDefault == null;
            Delevery_Infomation delevery_Infomation = 
                new Delevery_Infomation(delevery_InformationDTO.getName(), 
                                        delevery_InformationDTO.getPhone(), 
                                        delevery_InformationDTO.getAddress_line_1(), 
                                        delevery_InformationDTO.getAddress_line_2(), 
                                        isDefault, new Date(), user);
            deleveryInformationRepository.save(delevery_Infomation);
            response.setStatus(200);
            response.setMessage("Create success");
        }catch(RuntimeException e){
            response.setStatus(202);
            System.out.print("lỗi: " + e.getMessage());
            response.setMessage(e.getMessage());
        } 
        catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        return response;
    }

    public Response editDelevery(Delevery_InformationDTO delevery_InformationDTO){
        Response response = new Response();
        try {
            Delevery_Infomation delevery_Infomation = deleveryInformationRepository.findById(delevery_InformationDTO.getDe_infor_id())
                .orElseThrow(()-> new RuntimeException("Not found delevery information"));
            delevery_Infomation.setAddress_line_1(delevery_InformationDTO.getAddress_line_1());
            delevery_Infomation.setAddress_line_2(delevery_InformationDTO.getAddress_line_2());
            delevery_Infomation.setName(delevery_Infomation.getName());
            delevery_Infomation.setPhone(delevery_InformationDTO.getPhone());
            deleveryInformationRepository.save(delevery_Infomation);
            response.setStatus(200);
            response.setMessage("Create success");
        }catch(RuntimeException e){
            response.setStatus(202);
            System.out.print("lỗi: " + e.getMessage());
            response.setMessage(e.getMessage());
        } 
        catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        return response;
    }

    @Transactional
    public Response setDefault(Integer idAddress){
        Response response = new Response();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

            User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));


            Delevery_Infomation delevery_InfomationDefault = deleveryInformationRepository.findDefaultByUser(user);
            delevery_InfomationDefault.set_default(false);
            deleveryInformationRepository.save(delevery_InfomationDefault);

            Delevery_Infomation delevery_Infomation = deleveryInformationRepository.findById(idAddress)
                .orElseThrow(()-> new RuntimeException("Not found address"));
            delevery_Infomation.set_default(true);
            deleveryInformationRepository.save(delevery_Infomation);

            response.setStatus(200);
            response.setMessage("Create success");
        }catch(RuntimeException e){
            response.setStatus(202);
            System.out.print("lỗi: " + e.getMessage());
            response.setMessage(e.getMessage());
        } 
        catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        return response;
    }

    public Response deleteById(Integer idAddress){
        Response response = new Response();
        try {
            Delevery_Infomation delevery_Infomation = deleveryInformationRepository.findById(idAddress)
                .orElseThrow(()-> new RuntimeException("Not found address"));
            deleveryInformationRepository.delete(delevery_Infomation);
            response.setStatus(200);
            response.setMessage("Create success");
        }catch(RuntimeException e){
            response.setStatus(202);
            System.out.print("lỗi: " + e.getMessage());
            response.setMessage(e.getMessage());
        } 
        catch (Exception e) {
            response.setStatus(500);
            response.setMessage("Error server");
        }
        return response;
    }
}
