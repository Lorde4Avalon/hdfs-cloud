package me.z233.hdfscloud.util;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import me.z233.hdfscloud.entity.JwtEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtUtil {

    private static String secret = "hellojwt";

    public static String createToken(Integer id, Instant issueAt) {
        // 生成 Token, 7 天过期
        Instant exp = issueAt.plusSeconds(7 * 24 * 60 * 60);
        return createToken(id.toString(), issueAt, exp);
    }

    public static DecodedJWT decode(String token){
        try {
            // 返回 Token 的解码信息
            return JWT.decode(token);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void verifyToken(String token) {
        // 校验 Token
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(JwtUtil.secret)).build();
        verifier.verify(token);
    }


    private static String createToken(String sub, Instant iat, Instant exp) {
        // 生成 Token, 包括用户 uid, 生效和失效日期
        return JWT.create()
                .withClaim("sub", sub)
                .withClaim("iat", Date.from(iat))
                .withClaim("exp", Date.from(exp))
                .sign(Algorithm.HMAC256(JwtUtil.secret));
    }

    private static LocalDateTime getLastLoginTime(Instant newExp) {
        // 获取当前时间的 LocalDateTime 格式
        return LocalDateTime.ofInstant(newExp, ZoneId.systemDefault());
    }

}
