package com.secondlife.backend.controller;

import com.secondlife.backend.domain.dto.category.CategoryResponse;
import com.secondlife.backend.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Lấy danh sách tất cả các danh mục
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryRepository.findAll().stream()
                .map(cat -> CategoryResponse.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .icon(cat.getIcon())
                        .parentId(cat.getParentCategory() != null ? cat.getParentCategory().getId() : null)
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(categories);
    }
}
