package com.secondlife.backend.dto.address;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponse {
    private Long id;
    private String name;
    private String phoneNumber;
    private String address;
    private Boolean isDefault;
}
