package org.ahil.file_manage_backend.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.ahil.file_manage_backend.enums.Permission.*;


@RequiredArgsConstructor
public enum Role {

    //permission for different roles
    EMPLOYEE(Set.of(FILE_CREATE, FILE_READ, FILE_UPDATE, FILE_DOWNLOAD,USER_ME, USER_UPDATE)),
    MANAGER(Set.of(FILE_CREATE, FILE_READ, FILE_UPDATE, FILE_DOWNLOAD, USER_READ, USER_ME, USER_UPDATE)),
    CEO(Set.of(FILE_CREATE, FILE_READ, FILE_UPDATE, FILE_DELETE, FILE_DOWNLOAD, USER_READ, USER_UPDATE, USER_ME)),
    ADMIN(Set.of(FILE_CREATE, FILE_READ, FILE_UPDATE, FILE_DELETE, FILE_DOWNLOAD, USER_READ, USER_UPDATE, USER_DELETE, USER_ME));

    @Getter
    //dont want duplicates
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
