package me.z233.hdfscloud.mapper;

import me.z233.hdfscloud.entity.UserEntity;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    UserEntity findById(@Param("id") int id);

    @Select("SELECT * FROM user WHERE username = #{username}")
    UserEntity findByUsername(@Param("username") String username);

    @Select("SELECT password FROM user WHERE id = #{id}")
    String getPasswordById(@Param("id") int id);

    @Insert("INSERT INTO user (username) values (#{user.username})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertUser(@Param("user") UserEntity user);

    @Update("UPDATE user SET token = #{token} WHERE id = #{id}")
    boolean updateTokenById(@Param("id") int id, @Param("token") String token);

    @Update("UPDATE user SET nickname = #{nickname} WHERE id = #{id}")
    boolean updateNicknameById(@Param("id") int id, @Param("nickname") String nickname);

    @Update("UPDATE user SET password = #{password} WHERE id = #{id}")
    boolean updatePasswordById(@Param("id") int id, @Param("password") String password);

    @Update("UPDATE user SET nickname= #{user.nickname} WHERE id = #{user.id}")
    boolean updateUser(@Param("user") UserEntity user);
}
