package com.secondlife.backend.service.seller;

import com.secondlife.backend.domain.dto.seller.ShopProfileResponse;
import com.secondlife.backend.domain.dto.seller.ShopProfileUpdateRequest;
import com.secondlife.backend.domain.model.SellerProfile;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.model.UserProfile;
import com.secondlife.backend.repository.CustomerOrderRepository;
import com.secondlife.backend.repository.ProductRepository;
import com.secondlife.backend.repository.SellerProfileRepository;
import com.secondlife.backend.repository.UserAccountRepository;
import com.secondlife.backend.service.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class SellerProfileService {

    private static final DateTimeFormatter JOINED_DATE_FORMATTER = DateTimeFormatter.ofPattern("MM/yyyy");

    private final SellerProfileRepository sellerProfileRepository;
    private final UserAccountRepository userAccountRepository;
    private final ProductRepository productRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final CloudinaryService cloudinaryService;

    public SellerProfileService(
            SellerProfileRepository sellerProfileRepository,
            UserAccountRepository userAccountRepository,
            ProductRepository productRepository,
            CustomerOrderRepository customerOrderRepository,
            CloudinaryService cloudinaryService
    ) {
        this.sellerProfileRepository = sellerProfileRepository;
        this.userAccountRepository = userAccountRepository;
        this.productRepository = productRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional(readOnly = true)
    public ShopProfileResponse getShopProfile(Long sellerId) {
        UserAccount user = userAccountRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        SellerProfile profile = sellerProfileRepository.findByUserId(sellerId).orElse(null);

        long totalProducts = productRepository.countBySeller_Id(sellerId);
        long totalOrders = customerOrderRepository.countOrdersBySellerId(sellerId);

        return toResponse(user, profile, totalOrders, totalProducts);
    }

    @Transactional
    public ShopProfileResponse updateProfile(
            Long sellerId,
            ShopProfileUpdateRequest request,
            MultipartFile avatar,
            MultipartFile coverImage
    ) throws IOException {
        UserAccount user = userAccountRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        SellerProfile profile = sellerProfileRepository.findByUserId(sellerId)
                .orElseGet(() -> createDefaultProfile(user));

        if (request.getDescription() != null) {
            profile.setDescription(request.getDescription());
        }
        
        if (request.getShopName() != null && !request.getShopName().trim().isEmpty()) {
            profile.setShopName(request.getShopName());
        }

        if (request.getAddress() != null) {
            profile.setAddress(request.getAddress());
        }

        if (request.getPhone() != null && user.getProfile() != null) {
            user.getProfile().setPhone(request.getPhone());
            userAccountRepository.save(user); // Also saves UserProfile dynamically due to cascade
        }

        if (avatar != null && !avatar.isEmpty()) {
            String folderName = "sellers/" + sellerId + "/avatar";
            String avatarUrl = cloudinaryService.uploadFile(avatar, folderName)
                    .get("secure_url")
                    .toString();
            profile.setAvatarUrl(avatarUrl);
        }

        if (coverImage != null && !coverImage.isEmpty()) {
            String folderName = "sellers/" + sellerId + "/cover";
            String coverImageUrl = cloudinaryService.uploadFile(coverImage, folderName)
                    .get("secure_url")
                    .toString();
            profile.setCoverImageUrl(coverImageUrl);
        }

        sellerProfileRepository.save(profile);

        long totalProducts = productRepository.countBySeller_Id(sellerId);
        long totalOrders = customerOrderRepository.countOrdersBySellerId(sellerId);

        return toResponse(user, profile, totalOrders, totalProducts);
    }

    private SellerProfile createDefaultProfile(UserAccount user) {
        SellerProfile profile = new SellerProfile();
        profile.setUser(user);
        profile.setShopName(resolveShopName(user, null));

        UserProfile userProfile = user.getProfile();
        if (userProfile != null) {
            profile.setAddress(userProfile.getAddress());
            profile.setAvatarUrl(userProfile.getAvatarUrl());
            profile.setJoinedDate(userProfile.getJoinDate());
        }

        if (profile.getJoinedDate() == null) {
            profile.setJoinedDate(LocalDate.now());
        }

        return profile;
    }

    private ShopProfileResponse toResponse(
            UserAccount user,
            SellerProfile profile,
            long totalOrders,
            long totalProducts
    ) {
        UserProfile userProfile = user.getProfile();

        String name = resolveShopName(user, profile);
        String avatar = resolveAvatar(profile, userProfile);
        String coverImage = profile != null ? profile.getCoverImageUrl() : null;

        String address = profile != null && StringUtils.hasText(profile.getAddress())
                ? profile.getAddress()
                : userProfile != null ? userProfile.getAddress() : null;
                
        String phone = userProfile != null ? userProfile.getPhone() : null;

        String joinedDate = formatJoinedDate(profile, userProfile);

        return ShopProfileResponse.builder()
                .id(user.getId())
                .name(name)
                .phone(phone)
                .avatar(avatar)
                .coverImage(coverImage)
                .address(address)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .joinedDate(joinedDate)
                .rating(profile != null ? profile.getRating() : null)
                .ratingCount(profile != null ? profile.getRatingCount() : 0L)
                .description(profile != null ? profile.getDescription() : null)
                .responseRate(profile != null ? profile.getResponseRate() : null)
                .responseTime(profile != null ? profile.getResponseTime() : null)
                .build();
    }

    private String resolveShopName(UserAccount user, SellerProfile profile) {
        if (profile != null && StringUtils.hasText(profile.getShopName())) {
            return profile.getShopName();
        }

        UserProfile userProfile = user.getProfile();
        if (userProfile != null && StringUtils.hasText(userProfile.getFullName())) {
            return userProfile.getFullName();
        }

        return "Shop " + user.getId();
    }

    private String resolveAvatar(SellerProfile profile, UserProfile userProfile) {
        if (profile != null && StringUtils.hasText(profile.getAvatarUrl())) {
            return profile.getAvatarUrl();
        }

        if (userProfile != null && StringUtils.hasText(userProfile.getAvatarUrl())) {
            return userProfile.getAvatarUrl();
        }

        return null;
    }

    private String formatJoinedDate(SellerProfile profile, UserProfile userProfile) {
        LocalDate joinedDate = null;

        if (profile != null && profile.getJoinedDate() != null) {
            joinedDate = profile.getJoinedDate();
        } else if (userProfile != null && userProfile.getJoinDate() != null) {
            joinedDate = userProfile.getJoinDate();
        }

        return joinedDate != null ? joinedDate.format(JOINED_DATE_FORMATTER) : null;
    }
}
