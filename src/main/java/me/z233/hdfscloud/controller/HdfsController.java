package me.z233.hdfscloud.controller;

import me.z233.hdfscloud.service.HdfsService;
import me.z233.hdfscloud.vo.HdfsFile;
import org.apache.hadoop.fs.FileStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import lombok.val;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

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
            val hdfsFiles = new ArrayList<HdfsFile>();
            if (fileStatuses != null) {
                for (FileStatus fileStatus : fileStatuses) {
                    val tmp = HdfsFile.builder()
                            .name(fileStatus.getPath().getName())
                            .type(fileStatus.isDirectory())
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

    @RequestMapping(value = "/path/{path}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<?> move(@PathVariable String path, @RequestBody String newPath) throws IOException {
        if (path == null)
            return new ResponseEntity<>("Destination is required.", null, HttpStatus.BAD_REQUEST);

        hdfsService.moveFile(path, newPath);

        return new ResponseEntity<>(null, null, HttpStatus.OK);
    }

    @Value("${location.tempDir:}")
    private String tempDir;

    @PostMapping(value = "/path", produces = "application/json")
    public ResponseEntity<?> upload(String path, @RequestParam("file") MultipartFile file) throws IOException {
        if (path == null) path = "/";
        val fileName = file.getOriginalFilename();
        val realTempPath = servletContext.getRealPath("/" + fileName);
        val tempFile = new File(realTempPath);
        file.transferTo(tempFile);
        hdfsService.copyFile(realTempPath, path + "/" + fileName);
        return null;
    }

}
