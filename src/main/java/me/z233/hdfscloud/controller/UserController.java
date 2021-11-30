package me.z233.hdfscloud.controller;

import lombok.val;
import me.z233.hdfscloud.entity.MessageEntity;
import me.z233.hdfscloud.service.EncryptorService;
import me.z233.hdfscloud.service.HdfsService;
import me.z233.hdfscloud.service.UserService;
import me.z233.hdfscloud.util.CookieUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    HdfsService hdfsService;

    @Autowired
    EncryptorService encryptorService;

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody Map<String, String> form, HttpServletResponse response, HttpServletRequest request) {
        val username = form.get("username");
        val password = form.get("password");
        if (username.trim().isEmpty() || password.trim().isEmpty()) {
            val msg = MessageEntity.builder().text("登录失败：用户名或密码为空").build();
            return new ResponseEntity<>(msg, HttpStatus.FORBIDDEN);
        }
        val user = userService.findByUsername(username);
        if (user != null) {
            val encryptedPassword = userService.getPasswordById(user.getId());
            val realPassword = encryptorService.decrypt(encryptedPassword);
            if (Objects.equals(realPassword, password)) {
                val token = userService.createWebToken(user.getId());
                response.addCookie(CookieUtil.createCookie(token, request));
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                val msg = MessageEntity.builder().text("登录失败：密码错误").build();
                return new ResponseEntity<>(msg, HttpStatus.FORBIDDEN);
            }
        } else {
            val msg = MessageEntity.builder().text("登录失败：用户不存在").build();
            return new ResponseEntity<>(msg, HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<?> register(@RequestBody Map<String, String> form, HttpServletResponse response, HttpServletRequest request) {
        val username = form.get("username");
        val password = form.get("password");
        if (username.trim().isEmpty() || password.trim().isEmpty()) {
            val msg = MessageEntity.builder().text("注册失败：用户名或密码为空").build();
            return new ResponseEntity<>(msg, HttpStatus.FORBIDDEN);
        }
        if (userService.findByUsername(username) == null) {
            // 创建用户云盘文件夹
            try {
                hdfsService.createDir(username);
            } catch (Exception e) {
                val msg = MessageEntity.builder().text("注册失败：创建用户云盘文件夹失败").build();
                return new ResponseEntity<>(msg, HttpStatus.BAD_REQUEST);
            }

            val newUser = userService.addUser(username);
            val encryptedPassword = encryptorService.encrypt(password);
            userService.updatePasswordById(newUser.getId(), encryptedPassword);
            val token = userService.createWebToken(newUser.getId());
            response.addCookie(CookieUtil.createCookie(token, request));
            return new ResponseEntity<>(newUser, HttpStatus.OK);
        } else {
            val msg = MessageEntity.builder().text("注册失败：用户已存在").build();
            return new ResponseEntity<>(msg, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getByToken(HttpServletRequest request) {
        val token = CookieUtil.resolveCookie(request);
        val user = userService.getUserByToken(token);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

}
