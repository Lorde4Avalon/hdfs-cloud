package me.z233.hdfscloud.controller;

import me.z233.hdfscloud.entity.MessageEntity;
import me.z233.hdfscloud.service.HdfsService;
import me.z233.hdfscloud.entity.HdfsFileEntity;
import org.apache.hadoop.fs.FileStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.val;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HdfsController {

    @Autowired
    private HdfsService hdfsService;

    @Autowired
    private ServletContext servletContext;

    @GetMapping(value = "/path", produces = "application/json")
    public ResponseEntity<?> list(String path) throws IOException {
        if (path == null) path = "/";
        try {
            val fileStatuses = hdfsService.getDirectory(path);
            val hdfsFiles = new ArrayList<HdfsFileEntity>();
            if (fileStatuses != null) {
                for (FileStatus fileStatus : fileStatuses) {
                    val tmp = HdfsFileEntity.builder()
                            .name(fileStatus.getPath().getName())
                            .type(fileStatus.isDirectory() ? "dir" : "file")
                            .len(fileStatus.getLen())
                            .modTime(fileStatus.getModificationTime())
                            .build();
                    hdfsFiles.add(tmp);
                }
            }
            return new ResponseEntity<>(hdfsFiles, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/path/{path}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<?> delete(@PathVariable String path) throws IOException {
        if (path == null)
            return new ResponseEntity<>("Destination is required.", null, HttpStatus.BAD_REQUEST);

        hdfsService.deleteFile(path);
        return new ResponseEntity<>(null, null, HttpStatus.OK);
    }

    @RequestMapping(value = "/path", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<?> move(@RequestBody Map<String, String> params) throws IOException {
        val username = params.get("username");
        val src = params.get("src");
        val dst = params.get("dst");

        if (username == null && username.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("未指定目标用户"), null, HttpStatus.FORBIDDEN);
        }

        if (dst == null && dst.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("目标文件夹不能为空"), null, HttpStatus.FORBIDDEN);
        }

        if (src != null && !src.isEmpty()) {
            hdfsService.moveFile(username + '/' + src, username + '/' + dst);
            return new ResponseEntity<>(MessageEntity.builder().text("ok").build(), HttpStatus.OK);
        } else {
            hdfsService.createDir(username + '/' + dst);
            return new ResponseEntity<>(MessageEntity.builder().text("ok").build(), HttpStatus.OK);
        }
    }

    @Value("${location.tempDir:}")
    private String tempDir;

    @PostMapping(value = "/path", produces = "application/json")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file, @RequestParam("username") String username, @RequestParam("dst") String dst) throws IOException {

        if (username == null && username.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("未指定目标用户"), null, HttpStatus.FORBIDDEN);
        }

        if (dst == null && dst.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("目标文件夹不能为空"), null, HttpStatus.FORBIDDEN);
        }

        try {
            val fileName = file.getOriginalFilename();
            val realTempPath = servletContext.getRealPath("/" + fileName);
            val tempFile = new File(realTempPath);
            file.transferTo(tempFile);
            hdfsService.copyFile(realTempPath, "/" + username + "/" + dst + "/" + fileName);
            return new ResponseEntity<>(MessageEntity.builder().text("ok").build(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(MessageEntity.builder().text("ok").build(), HttpStatus.OK);
        }
    }


}
