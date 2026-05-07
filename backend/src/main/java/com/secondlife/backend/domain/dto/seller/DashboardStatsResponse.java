package com.secondlife.backend.domain.dto.seller;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private BigDecimal revenue;
    private long newOrders;
    private long views;
    private List<ChartData> chartData;

    @Data
    @Builder
    public static class ChartData {
        private String name;
        private BigDecimal revenue;
    }
}
