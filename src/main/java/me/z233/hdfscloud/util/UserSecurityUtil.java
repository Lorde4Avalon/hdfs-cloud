package me.z233.hdfscloud.util;


import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import me.z233.hdfscloud.entity.JwtEntity;
import me.z233.hdfscloud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.Instant;
import java.time.ZoneId;

import lombok.val;

@Component
public class UserSecurityUtil {

    @Autowired
    private UserService userService;


    public boolean verifyWebToken(HttpServletRequest req, HttpServletResponse resp) {
        // 获取请求头中的 cookies 信息
        val cookies = req.getCookies();
        if (cookies == null) {
            return false;
        }
        String token = null;
        for (int i = 0; i < cookies.length; i++) {
            if (cookies[i].getName().equals("authorization")) {
                token = cookies[i].getValue();
            }
        }
        // 如果为空直接返回 false
        if (token == null) {
            return false;
        }
        // 解码 Token 信息, 如果为空直接返回 false
        DecodedJWT jwtToken = JwtUtil.decode(token);
        if (jwtToken == null) {
            return false;
        }
        // 获取 Token 信息中的用户 id 信息
        int id = Integer.parseInt(jwtToken.getSubject());
        if (userService.findById(id) == null) {
            return false;
        }
        try {
            // 继续校验
            JwtUtil.verifyToken(token);
        } catch (SignatureVerificationException e) {
            // 出现签名校验异常直接返回 false
            return false;
        } catch (TokenExpiredException e) {
            // 如果过期, 生成新的 Token
            String newToken = userService.createWebToken(id);
            if (newToken == null) {
                return false;
            }
            resp.addCookie(CookieUtil.createCookie(newToken, req));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        // 设置返回头中的 token
        resp.addCookie(CookieUtil.createCookie(token, req));
        return true;
    }
}
