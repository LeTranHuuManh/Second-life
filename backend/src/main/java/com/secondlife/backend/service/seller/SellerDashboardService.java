package com.secondlife.backend.service.seller;

import com.secondlife.backend.domain.dto.seller.DashboardStatsResponse;
import com.secondlife.backend.repository.CustomerOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SellerDashboardService {

    private final CustomerOrderRepository customerOrderRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(Long sellerId) {
        BigDecimal revenue = customerOrderRepository.sumRevenueBySellerId(sellerId);
        long newOrders = customerOrderRepository.countOrdersBySellerId(sellerId);
        
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        // Mocking views and chart data for now since we don't have tracking tables yet
        long views = 120 + new java.util.Random().nextInt(200); 

        List<DashboardStatsResponse.ChartData> chartData = new ArrayList<>();
        chartData.add(DashboardStatsResponse.ChartData.builder().name("T1").revenue(BigDecimal.valueOf(1200)).build());
        chartData.add(DashboardStatsResponse.ChartData.builder().name("T2").revenue(BigDecimal.valueOf(3000)).build());
        chartData.add(DashboardStatsResponse.ChartData.builder().name("T3").revenue(BigDecimal.valueOf(4500)).build());
        chartData.add(DashboardStatsResponse.ChartData.builder().name("T4").revenue(BigDecimal.valueOf(2000)).build());
        chartData.add(DashboardStatsResponse.ChartData.builder().name("T5").revenue(revenue).build());

        return DashboardStatsResponse.builder()
                .revenue(revenue)
                .newOrders(newOrders)
                .views(views)
                .chartData(chartData)
                .build();
    }
}
