package me.z233.hdfscloud.service;

import lombok.val;
import me.z233.hdfscloud.entity.UserEntity;
import me.z233.hdfscloud.mapper.UserMapper;
import me.z233.hdfscloud.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class UserService {

    private UserMapper userMapper;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public UserEntity findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public UserEntity findById(int id) {
        return userMapper.findById(id);
    }

    public String getPasswordById(int id) {
        return userMapper.getPasswordById(id);
    }

    public UserEntity addUser(String username) {
        val newUser = new UserEntity();
        newUser.setUsername(username);
        userMapper.insertUser(newUser);
        return newUser;
    }

    public boolean updateTokenById(int id, String token) {
        return userMapper.updateTokenById(id, token);
    }

    public boolean updatePasswordById(int id, String password) {
        return userMapper.updatePasswordById(id, password);
    }

    public UserEntity getUserByToken(String token) {
        val jwtToken = JwtUtil.decode(token);
        val id = Integer.parseInt(jwtToken.getSubject());
        val user = userMapper.findById(id);
        return user;
    }

    @Transactional
    public String createWebToken(int id) {
        // 调用 JwtUtil 工具类的生成 Token 方法
        Instant now = Instant.now();
        String token = JwtUtil.createToken(id, now);
        return token;
    }
}