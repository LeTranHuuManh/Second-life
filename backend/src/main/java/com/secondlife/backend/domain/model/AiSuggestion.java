package com.secondlife.backend.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "ai_suggestions")
public class AiSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;

    @Column(name = "suggested_price", precision = 15, scale = 2)
    private BigDecimal suggestedPrice;

    @Column(name = "suggested_rental_price", precision = 15, scale = 2)
    private BigDecimal suggestedRentalPrice;

    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    @Column(name = "model_version", length = 100)
    private String modelVersion;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public BigDecimal getSuggestedPrice() {
        return suggestedPrice;
    }

    public void setSuggestedPrice(BigDecimal suggestedPrice) {
        this.suggestedPrice = suggestedPrice;
    }

    public BigDecimal getSuggestedRentalPrice() {
        return suggestedRentalPrice;
    }

    public void setSuggestedRentalPrice(BigDecimal suggestedRentalPrice) {
        this.suggestedRentalPrice = suggestedRentalPrice;
    }

    public BigDecimal getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(BigDecimal confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
