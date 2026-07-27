package com.ucsc.kpi_dashboard.Configurations;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtProvider {

    static SecretKey secretKey = Keys.hmacShaKeyFor(JwtConstant.JWT_SECRET.getBytes());

    public String generateJwtToken(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String roles = populateAuthorities(authorities);

        return Jwts.builder().issuedAt(new Date()).expiration(new Date(new Date().getTime() + 8640000))
                .claim("email",authentication.getName())
                .claim("authorities",roles)
                .signWith(secretKey).compact();

    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<String>();
        for (GrantedAuthority grantedAuthority : authorities) {
            auths.add(grantedAuthority.getAuthority());
        }

        return String.join(",", auths);
    }
}
