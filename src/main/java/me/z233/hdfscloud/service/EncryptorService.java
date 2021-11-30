package me.z233.hdfscloud.service;

import org.jasypt.encryption.StringEncryptor;
import org.springframework.stereotype.Service;

@Service
public class EncryptorService {
    private StringEncryptor encryptor;

    public EncryptorService(StringEncryptor encryptor) {
        this.encryptor = encryptor;
    }


    public String encrypt(String originPassord) {
        String encryptStr = encryptor.encrypt(originPassord);
        return encryptStr;
    }

    public String decrypt(String encryptedPassword) {
        String decryptStr = encryptor.decrypt(encryptedPassword);
        return decryptStr;
    }
}
