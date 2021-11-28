package me.z233.hdfscloud.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HdfsFile {
    private String name;
    private long len;
    private long modTime;
    private String type;

    public static class HdfsFileBuilder {
        private String type;

        public HdfsFileBuilder type(boolean isDir) {
            this.type = isDir ? "dir" : "file";
            return this;
        }

    }

}
