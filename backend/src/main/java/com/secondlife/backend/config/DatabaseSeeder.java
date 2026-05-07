package com.secondlife.backend.config;

import com.secondlife.backend.domain.enums.UserRole;
import com.secondlife.backend.domain.model.Category;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.repository.CategoryRepository;
import com.secondlife.backend.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserAccountRepository userAccountRepository;

    public DatabaseSeeder(CategoryRepository categoryRepository, UserAccountRepository userAccountRepository) {
        this.categoryRepository = categoryRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Khởi tạo Danh mục mẫu nếu database chưa có
        if (categoryRepository.count() == 0) {
            List<Category> predefinedCategories = Arrays.asList(
                    createCategory("Thời trang & Phụ kiện", "Shirt"),
                    createCategory("Đồ điện tử", "Smartphone"),
                    createCategory("Nội thất & Gia dụng", "Sofa"),
                    createCategory("Xe cộ", "Car"),
                    createCategory("Sách & Báo", "Book"),
                    createCategory("Thể thao & Dã ngoại", "Tent"),
                    createCategory("Thú cưng", "Cat"),
                    createCategory("Giải trí & Trò chơi", "Gamepad2"),
                    createCategory("Mẹ & Bé", "Baby"),
                    createCategory("Khác", "Package")
            );
            categoryRepository.saveAll(predefinedCategories);
            System.out.println("Đã khởi tạo thành công 10 danh mục mua bán mẫu!");
        }

        // Khởi tạo User mẫu nếu database chưa có User nào
        if (userAccountRepository.count() == 0) {
            UserAccount u = new UserAccount();
            u.setPassword("$2a$10$abcdefghijklmnopqrstuv");
            u.setRole(UserRole.USER);
            userAccountRepository.save(u);
            System.out.println("Đã khởi tạo thành công User mẫu!");
        }
    }

    private Category createCategory(String name, String icon) {
        Category category = new Category();
        category.setName(name);
        category.setIcon(icon); // Tên Icon tương ứng với React Lucide Icons
        return category;
    }
}
