package com.secondlife.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload một file lên Cloudinary, trong một folder được định nghĩa động
     *
     * @param file File multipart được gửi từ client
     * @param folderName Tên folder (sub-directory) lưu trữ trên Cloudinary
     * @return Map chứa thông tin ảnh đã upload (như "secure_url: ...", "public_id: ...")
     * @throws IOException Nếu quá trình đọc file xảy ra lỗi
     */
    public Map<String, Object> uploadFile(MultipartFile file, String folderName) throws IOException {
        // Cấu hình các tham số upload
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folderName,
                "auto_create_dir", true
        );

        // Upload bằng dạng bytes array của file
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

        return uploadResult;
    }

    /**
     * Xóa file trên Cloudinary bằng publicId (id bao gồm cả đoạn đầu folderName)
     *
     * @param publicId Public ID do Cloudinary trả về lúc upload
     */
    public Map<String, Object> deleteFile(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
