package me.z233.hdfscloud.service;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;

import lombok.val;
import org.springframework.stereotype.Service;

@Service
public class HdfsService {

    public static final String ANSI_RESET = "\u001B[0m";
    public static final String ANSI_BLACK = "\u001B[30m";
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_YELLOW = "\u001B[33m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_PURPLE = "\u001B[35m";
    public static final String ANSI_CYAN = "\u001B[36m";
    public static final String ANSI_WHITE = "\u001B[37m";

    public static final String HDFS_PATH = "hdfs://localhost:9000/es/";
    private final String HDFS_USER = "fronz";

    /**
     * 搜索 HDFS 中的文件
     *
     * @param beginPath 开始搜索的路径
     * @param key       搜索关键字
     * @return FileStatus[]
     * @throws IOException
     */
    public ArrayList<FileStatus> searchFile(String beginPath, String key) throws IOException {
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        val conf = new Configuration();
        val fs = FileSystem.get(URI.create(HDFS_PATH + beginPath), conf);
        val fileStatusListIterator = fs.listFiles(new Path("/"), true);
        val results = new ArrayList<FileStatus>();
        while (fileStatusListIterator.hasNext()) {
            val fileStatus = fileStatusListIterator.next();
            if (fileStatus.getPath().getName().contains(key)) {
                results.add(fileStatus);
            }
        }
        return results;
    }

    /**
     * 上传文件
     *
     * @param src 本地文件路径
     * @param dst HDFS文件路径
     * @throws IOException
     */
    public void copyFile(String src, String dst) throws IOException {
        dst = HDFS_PATH + dst;
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(URI.create(dst), conf);
        fs.copyFromLocalFile(new Path(src), new Path(dst));
        System.out.println("Copy from: " + src + " to: " + dst);
        fs.close();
    }

    /**
     * 删除文件
     *
     * @param dst HDFS文件路径
     * @throws IOException
     */
    public void deleteFile(String dst) throws IOException {
        dst = HDFS_PATH + dst;
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        try {
            FileSystem fs = FileSystem.get(URI.create(dst), conf);
            fs.deleteOnExit(new Path(dst));
            System.out.println("Delete: " + dst);
            fs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 创建新目录
     *
     * @param dir 要创建的文件夹路径
     * @throws IOException
     */
    public void createDir(String dir) throws IOException {
        dir = HDFS_PATH + dir;
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(URI.create(dir), conf);
        try {
            Path f = new Path(dir);
            if (!fs.exists(f)) {
                fs.mkdirs(f);
            }
            System.out.println("Create dir: " + dir);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 遍历指定目录下的文件和文件夹
     *
     * @param dst
     * @return
     * @throws FileNotFoundException
     * @throws IOException
     */
    public FileStatus[] getDirectory(String dst) throws FileNotFoundException, IOException {
        dst = HDFS_PATH + dst;
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(URI.create(dst), conf);
        FileStatus[] list = null;
        try {
            list = fs.listStatus(new Path(dst));
            if (list == null) {
                for (FileStatus fileStatus : list) {
                    System.out.printf("name: %s, folder: %s, size: %d\n",
                            fileStatus.getPath().getName(), fileStatus.isDirectory(), fileStatus.getLen());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException(e.getMessage());
        }
        return list;
    }

    /**
     * 获取指定文件的输入流
     *
     * @param filePath 目标文件路径
     * @return
     * @throws IOException
     */
    public InputStream getFileInputStream(String filePath) throws IOException {
        filePath = HDFS_PATH + filePath;
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        conf.set("fs.default.name", filePath);
        FileSystem fs = FileSystem.get(conf);
        return fs.open(new Path(filePath));
    }

    /**
     * 重命名文件
     *
     * @param filePath 目标文件路径
     * @param newName  新文件名
     * @throws IOException
     */
    public void renameFile(String filePath, String newName) throws IOException {
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(URI.create(HDFS_PATH + filePath), conf);
        try {
            fs.rename(new Path(HDFS_PATH + filePath), new Path(HDFS_PATH + newName));
            System.out.println("Rename: " + filePath + " to: " + newName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 移动文件
     *
     * @param src
     * @param dst
     * @throws IOException
     */
    public void moveFile(String src, String dst) throws IOException {
        System.setProperty("HADOOP_USER_NAME", HDFS_USER);
        Configuration conf = new Configuration();
        FileSystem fs = FileSystem.get(URI.create(HDFS_PATH + src), conf);
        try {
            fs.rename(new Path(HDFS_PATH + src), new Path(HDFS_PATH + dst));
            System.out.println("Move: " + src + " to: " + dst);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
