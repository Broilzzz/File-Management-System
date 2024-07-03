package org.ahil.file_manage_backend.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    FILE_CREATE("file:create"),
    FILE_READ("file:read"),
    FILE_UPDATE("file:update"),
    FILE_DELETE("file:delete"),
    FILE_DOWNLOAD("file:download"),
    USER_READ("user:read"),
    USER_UPDATE("user:update"),
    USER_ME("user:me"),
    USER_DELETE("user:delete");

//    USER_CHANGE("user:change");

    @Getter
    private final String permission;
}
