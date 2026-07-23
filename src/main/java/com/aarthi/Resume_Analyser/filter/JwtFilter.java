package com.aarthi.Resume_Analyser.filter;

import com.aarthi.Resume_Analyser.util.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import java.util.List;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain) throws ServletException,IOException{
if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
    filterChain.doFilter(request, response);
    return;
}

    String path = request.getServletPath();

    if (path.equals("/api/auth/register") || path.equals("/api/auth/login") || 
    path.equals("/api/auth/sendotp") ||
    path.equals("/api/auth/verifyotp") ||
    path.equals("/api/auth/resetpassword")) {
        filterChain.doFilter(request, response);
        return;
    }
        String authHeader=request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing token");
            return;
        }

        String token=authHeader.substring(7);
        try{
            String email=jwtService.extractEmail(token);
            UsernamePasswordAuthenticationToken authentication =
    new UsernamePasswordAuthenticationToken(
            email,
            null,
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
    );

authentication.setDetails(
    new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
        .buildDetails(request)
);

SecurityContextHolder.getContext().setAuthentication(authentication);
System.out.println(SecurityContextHolder.getContext().getAuthentication());
            System.out.println("Authenticated User:"+ email);

        }
        catch(Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Token");
            return;
        }
        filterChain.doFilter(request,response);

    }

    
}
