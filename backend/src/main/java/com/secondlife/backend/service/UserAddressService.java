package com.secondlife.backend.service;

import com.secondlife.backend.dto.address.AddressRequest;
import com.secondlife.backend.dto.address.AddressResponse;

import java.util.List;

public interface UserAddressService {
    List<AddressResponse> getUserAddresses(Long userId);
    AddressResponse addAddress(Long userId, AddressRequest request);
    AddressResponse setDefaultAddress(Long userId, Long addressId);
    void deleteAddress(Long userId, Long addressId);
}
