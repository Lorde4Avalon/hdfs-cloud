package me.z233.hdfscloud;

import me.z233.hdfscloud.controller.HdfsController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import javax.servlet.MultipartConfigElement;

@SpringBootApplication
public class HdfsCloudApplication {

    public static void main(String[] args) {
        SpringApplication.run(HdfsCloudApplication.class, args);
    }

}
