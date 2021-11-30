package me.z233.hdfscloud.util;

import lombok.val;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Component
public class CookieUtil {
    public static Cookie createCookie(String token, HttpServletRequest request) {
        val cookie = new Cookie("authorization", token);
        // 7 天过期
        cookie.setMaxAge(7 * 24 * 60 * 60);
//        cookie.setDomain(request.getServerName());
        cookie.setPath(request.getContextPath());
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        return cookie;
    }

    public static String resolveCookie(HttpServletRequest request) {
        val cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (val cookie : cookies) {
            if (cookie.getName().equals("authorization")) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
