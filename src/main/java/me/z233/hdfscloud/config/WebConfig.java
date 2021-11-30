package me.z233.hdfscloud.config;


import me.z233.hdfscloud.filter.HttpInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class WebConfig extends WebMvcConfigurationSupport {

    private final HttpInterceptor httpInterceptor;

    @Autowired
    public WebConfig(HttpInterceptor httpInterceptor) {
        this.httpInterceptor = httpInterceptor;
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 跨域相关配置, 并让 authorization 可在响应头中出现
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedHeaders("*")
                .allowedMethods("*")
                .allowCredentials(true)
                .maxAge(1000L);
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        // 设置自定义的拦截器, 拦截 api 请求
        // 排除 login 和 register 请求
        registry.addInterceptor(httpInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/login", "/api/register", "/static/**");
        super.addInterceptors(registry);
    }

}
