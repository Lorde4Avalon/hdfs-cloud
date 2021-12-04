package me.z233.hdfscloud.controller;

import me.z233.hdfscloud.entity.MessageEntity;
import me.z233.hdfscloud.service.HdfsService;
import me.z233.hdfscloud.entity.HdfsFileEntity;
import me.z233.hdfscloud.service.UserService;
import me.z233.hdfscloud.util.CookieUtil;
import org.apache.hadoop.fs.FileStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.val;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HdfsController {

    @Autowired
    private HdfsService hdfsService;

    @Autowired
    private UserService userService;

    @Autowired
    private ServletContext servletContext;

    @GetMapping(value = "/path", produces = "application/json")
    public ResponseEntity<?> list(String path, HttpServletRequest request) throws IOException {
        val user = userService.getUserByToken(CookieUtil.resolveCookie(request));
        if (path == null) path = "/" + user.getUsername();
        try {
            val fileStatuses = hdfsService.getDirectory("/" + user.getUsername() + path);
            val hdfsFiles = new ArrayList<HdfsFileEntity>();
            if (fileStatuses != null) {
                for (FileStatus fileStatus : fileStatuses) {
                    val tmp = HdfsFileEntity.builder()
                            .name(fileStatus.getPath().getName())
                            .type(fileStatus.isDirectory() ? "dir" : "file")
                            .len(fileStatus.getLen())
                            .modTime(fileStatus.getModificationTime())
                            .path(fileStatus.getPath().toString().replace(HdfsService.HDFS_PATH + user.getUsername(), ""))
                            .build();
                    hdfsFiles.add(tmp);
                }
            }
            return new ResponseEntity<>(hdfsFiles, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/path", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<?> delete(@RequestBody Map<String, String> params) throws IOException {

        val username = params.get("username");
        val dst = params.get("dst");

        if (username == null && username.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("未指定目标用户"), null, HttpStatus.FORBIDDEN);
        }

        if (dst == null && dst.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("目标文件不能为空"), null, HttpStatus.FORBIDDEN);
        }
        hdfsService.deleteFile(username + '/' + dst);
        return new ResponseEntity<>(MessageEntity.builder().text("ok").build(), null, HttpStatus.OK);
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
            val fileName = file.getOriginalFilename().replace(" ", "_");
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

    @RequestMapping(value = "/download")
    public ResponseEntity<?> download(String path, HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (path == null || path.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("文件路径不能为空"), null, HttpStatus.FORBIDDEN);
        }

        val token = CookieUtil.resolveCookie(request);
        val user = userService.getUserByToken(token);

        if (user == null) {
            return new ResponseEntity<>(MessageEntity.builder().text("用户不存在"), null, HttpStatus.FORBIDDEN);
        }

        val username = user.getUsername();
        response.reset();
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(path.substring(path.lastIndexOf("/") + 1), "UTF-8"));
        response.setHeader("Content-Transfer-Encoding", "chunked");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/octet-stream");

        try {
            val fileStream = hdfsService.getFileInputStream(username + '/' + path);
            val outputStream = response.getOutputStream();
            val buffer = new byte[1024];
            var len = 0;
            while ((len = fileStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, len);
            }
            outputStream.write(buffer);
            outputStream.flush();
            fileStream.close();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(MessageEntity.builder().text("未知错误"), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(String beginPath, String key, HttpServletRequest request) throws IOException {
        if (beginPath == null || beginPath.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("文件路径不能为空"), null, HttpStatus.FORBIDDEN);
        }

        if (key == null || key.isEmpty()) {
            return new ResponseEntity<>(MessageEntity.builder().text("关键字不能为空"), null, HttpStatus.FORBIDDEN);
        }

        val user = userService.getUserByToken(CookieUtil.resolveCookie(request));

        val fileStatusArrayList = hdfsService.searchFile(user.getUsername() + '/' + beginPath, key);
        val hdfsFileList = new ArrayList<HdfsFileEntity>();

        if (fileStatusArrayList != null) {
            fileStatusArrayList.forEach(fileStatus -> {
                val hdfsFile = HdfsFileEntity.builder()
                        .name(fileStatus.getPath().getName())
                        .type(fileStatus.isDirectory() ? "dir" : "file")
                        .len(fileStatus.getLen())
                        .modTime(fileStatus.getModificationTime())
                        .path(fileStatus.getPath().toString().replace(HdfsService.HDFS_PATH + user.getUsername(), ""))
                        .build();
                hdfsFileList.add(hdfsFile);
            });
        }

        return new ResponseEntity<>(hdfsFileList, HttpStatus.OK);

//        try {
////            return new ResponseEntity<>(results, HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(MessageEntity.builder().text("未知错误"), null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

}
