package me.z233.hdfscloud.entity;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
public class ResultEntity<T> {

    private T data;
    private boolean status = true;
    private String errMsg = "";

    public ResultEntity(T data) {
        this.data = data;
    }
}
