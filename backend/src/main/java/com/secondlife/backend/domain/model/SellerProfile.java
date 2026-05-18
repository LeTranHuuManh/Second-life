package com.secondlife.backend.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "seller_profiles")
public class SellerProfile extends BaseEntity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserAccount user;

    @Column(name = "shop_name", length = 150)
    private String shopName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "address", length = 500)
    private String address;


    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;

    @Column(name = "cover_image_url", length = 1000)
    private String coverImageUrl;

    @Column(name = "response_rate", length = 30)
    private String responseRate;

    @Column(name = "response_time", length = 100)
    private String responseTime;

    @Column(name = "rating", nullable = false, precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "rating_count", nullable = false)
    private Long ratingCount = 0L;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public UserAccount getUser() {
        return user;
    }

    public void setUser(UserAccount user) {
        this.user = user;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getResponseRate() {
        return responseRate;
    }

    public void setResponseRate(String responseRate) {
        this.responseRate = responseRate;
    }

    public String getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(String responseTime) {
        this.responseTime = responseTime;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Long getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Long ratingCount) {
        this.ratingCount = ratingCount;
    }

    public LocalDate getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(LocalDate joinedDate) {
        this.joinedDate = joinedDate;
    }
}
