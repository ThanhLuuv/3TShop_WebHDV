package com.project._TShop.Entities;

import jakarta.persistence.*;
import java.util.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "account")
public class Account implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer account_id;

    @Column(name="username",columnDefinition = "varchar(65)")
    private String username;

    @Column(name="password",columnDefinition = "varchar(65)")
    private String password;

    @Column(name="email",nullable = false)
    private String email;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name="reset_password_token",columnDefinition = "varchar(50)")
    private String resetPasswordToken;
    @Column(name="reset_password_token_expiry")
    private Date resetPasswordTokenExpiry;

    @Column(name="registrationToken",columnDefinition = "varchar(50)")
    private String registrationToken;
    @Column(name = "registration_token_expiry")
    private Date registrationTokenExpiry;

    @Column(name="auth_provider",columnDefinition = "varchar(20)",nullable = false)
    private String auth_provider;
    @Column(name="status",columnDefinition = "BIT",nullable = false)
    private boolean status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "account_role",
            joinColumns = {@JoinColumn(name = "account_id", referencedColumnName = "account_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "role_id")}
    )
    private Collection<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

}
