package org.ahil.file_manage_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.ahil.file_manage_backend.entity.User;
import org.ahil.file_manage_backend.repository.UserRepository;
import org.ahil.file_manage_backend.service.JwtService;
//import org.ahil.filesharingmanagement.service.impl.UserServiceImpl;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.thymeleaf.util.StringUtils;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
//        System.out.println("filter flag1:"+authHeader);

        if(StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader, "Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUserName(jwt);

        //if user is there but not connected yet
        if(!StringUtils.isEmpty(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null){
            //extract user from database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            //if the token is valid for that user
//            System.out.println("jwtsuthfilter token valid flag: "+jwtService.isTokenValid(jwt, userDetails));
            if(jwtService.isTokenValid(jwt, userDetails)){
//                System.out.println("token valid flag");
                User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(()-> new IllegalStateException("user not found"));
                // Check if last login was more than 30 days ago
                System.out.println("flag for user role: "+user.getRole());
                if (user.getLastLogin() != null && LocalDateTime.now().isAfter(user.getLastLogin().plusDays(1))) {
                    System.out.println("user 1 day login over flag");
                    response.sendRedirect("http://localhost:5173/");
                    return;
                }

                //create an authToken and build and set it
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("token verification done flag");
            }
        }
        //pass on to the next filters
        filterChain.doFilter(request,response);







    }
}
