package me.z233.hdfscloud.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HdfsFileEntity {
    private String name;
    private long len;
    private long modTime;
    private String type;
}
