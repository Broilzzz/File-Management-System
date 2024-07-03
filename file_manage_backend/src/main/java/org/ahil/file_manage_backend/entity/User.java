package org.ahil.file_manage_backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ahil.file_manage_backend.enums.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private Integer id;
//    @Column(nullable = false,length = 35)
    private String firstName;
//    @Column(nullable = false,length = 35)
    private String lastName;
    @Column(unique = true,nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private boolean locked;
    private boolean enabled;
    private LocalDateTime lastLogin;
    @Lob
    @Column(name = "profile_picture", columnDefinition = "LONGBLOB")
    private byte[] profilePicture;

    //cascade makes sure that actions applied to parent entity to be automatically applied to it related entities
    //fetch is useful because it loads the related entity on demand when they are accessed to improve performance
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FileMetaData> files;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    //credentials expire after 30 days and need to login after
    @Override
    public boolean isAccountNonExpired() {
        return lastLogin == null || LocalDateTime.now().isBefore(lastLogin.plusDays(30));
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
