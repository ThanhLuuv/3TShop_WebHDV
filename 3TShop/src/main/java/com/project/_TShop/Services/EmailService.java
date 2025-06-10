package com.project._TShop.Services;

import com.project._TShop.Entities.Account;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public static String getSiteURL(HttpServletRequest req){
        String siteURL = req.getRequestURL().toString();
        return siteURL.replace(req.getServletPath(),""); //remove /forgot-password in localhost/forgotpassword
    }
    public void sendVerificationEmail(Account account, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        String siteURL = getSiteURL(req);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom("thienplpp965@gmail.com", "3TSHOP");
        helper.setTo(account.getEmail());
//        String verifyURL = siteURL + "/verify?code=" + account.getRegistrationToken();
        String verifyURL = "http://localhost:3003/verify?code=" + account.getRegistrationToken();

        System.out.println(verifyURL);

        String subject = "Xác nhận đăng kí tài khoản";
        String content = "<p>Xin chào, </p>"
                + "<p>Hãy nhấn vào đường dẫn bên dưới để xác nhận .</p>"
                + "<p><b><a href=\"" + verifyURL + "\">Xác nhận đăng kí<a/></b></p>";

        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }
    public void sendOtpEmail(Account user) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String subject = "Xác nhận đăng ký tài khoản";
        String content = "<h3>Xin chào " + user.getUsername() + ",</h3>" +
                "<p>Vui lòng sử dụng mã OTP dưới đây để xác nhận đăng ký tài khoản:</p>" +
                "<h2>" + user.getRegistrationToken() + "</h2>" +
                "<p>Mã này có hiệu lực trong 10 phút.</p>" +
                "<p>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>" +
                "<p>Trân trọng,<br>Đội ngũ 3TShop</p>";

        helper.setTo(user.getEmail());
        helper.setSubject(subject);
        helper.setText(content, true); // true để hỗ trợ HTML
        helper.setFrom("thienplpp965@gmail.com", "3TShop");

        mailSender.send(message);
    }
    public void sendEmailToResetPassword(Account account, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        String siteURL = getSiteURL(req);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom("thienplpp965@gmail.com", "3TSHOP");
        helper.setTo(account.getEmail());
//        String verifyURL = siteURL + "/reset-password?code=" + account.getResetPasswordToken();
        String verifyURL = "http://localhost:3003/reset-password?code=" + account.getResetPasswordToken();

        System.out.println(verifyURL);

        String subject = "Đặt lại mật khẩu";
        String content = "<p>Xin chào, </p>"
                + "<p>Hãy nhấn vào đường dẫn bên dưới để đổi mật khẩu mới .</p>"
                + "<p><b><a href=\"" + verifyURL + "\">Nhấn để đặt lại mật khẩu<a/></b></p>";

        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }

    public void sendEmailToResetPasswordMobile(Account account, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom("thienplpp965@gmail.com", "3TSHOP");
        helper.setTo(account.getEmail());

        // Tạo link trung gian HTTPS
        String resetToken = account.getResetPasswordToken();
        String webLink = "https://presently-prepared-albacore.ngrok-free.app/api/v1/auth/reset-password-gate?token=" + resetToken; // Thay bằng domain thật của bạn

        String subject = "Đặt lại mật khẩu";
        String content = "<p>Xin chào,</p>"
                + "<p>Nhấn vào đường dẫn bên dưới để đặt lại mật khẩu trong ứng dụng:</p>"
                + "<p><b><a href=\"" + webLink + "\">Đặt lại mật khẩu</a></b></p>"
                + "<p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>";

        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }
}
