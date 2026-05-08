package com.secondlife.backend.controller;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.dto.address.AddressRequest;
import com.secondlife.backend.dto.address.AddressResponse;
import com.secondlife.backend.service.UserAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/addresses")
@RequiredArgsConstructor
public class UserAddressController {

    private final UserAddressService userAddressService;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<AddressResponse>>> getUserAddresses() {
        return ResponseEntity.ok(BaseResponse.success(userAddressService.getUserAddresses(getCurrentUserId())));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<AddressResponse>> addAddress(
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(BaseResponse.success(userAddressService.addAddress(getCurrentUserId(), request)));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<BaseResponse<AddressResponse>> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(BaseResponse.success(userAddressService.updateAddress(getCurrentUserId(), addressId, request)));
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<BaseResponse<AddressResponse>> setDefaultAddress(
            @PathVariable Long addressId) {
        return ResponseEntity.ok(BaseResponse.success(userAddressService.setDefaultAddress(getCurrentUserId(), addressId)));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<BaseResponse<Void>> deleteAddress(
            @PathVariable Long addressId) {
        userAddressService.deleteAddress(getCurrentUserId(), addressId);
        return ResponseEntity.ok(BaseResponse.success(null));
    }
}
