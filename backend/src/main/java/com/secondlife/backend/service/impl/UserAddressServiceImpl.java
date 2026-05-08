package com.secondlife.backend.service.impl;

import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.model.UserAddress;
import com.secondlife.backend.dto.address.AddressRequest;
import com.secondlife.backend.dto.address.AddressResponse;
import com.secondlife.backend.repository.UserAccountRepository;
import com.secondlife.backend.repository.UserAddressRepository;
import com.secondlife.backend.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAddressServiceImpl implements UserAddressService {

    private final UserAddressRepository userAddressRepository;
    private final UserAccountRepository userAccountRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(Long userId) {
        return userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasAddress = !userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId).isEmpty();
        
        // Nếu user chưa có địa chỉ nào, địa chỉ đầu tiên sẽ là mặc định
        boolean isDefault = !hasAddress || (request.getIsDefault() != null && request.getIsDefault());

        if (isDefault && hasAddress) {
            resetDefaultAddresses(userId);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .isDefault(isDefault)
                .build();

        return mapToResponse(userAddressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (request.getIsDefault() != null && request.getIsDefault() && !address.getIsDefault()) {
            resetDefaultAddresses(userId);
        }

        address.setName(request.getName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddress(request.getAddress());
        
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }

        return mapToResponse(userAddressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (!address.getIsDefault()) {
            resetDefaultAddresses(userId);
            address.setIsDefault(true);
            userAddressRepository.save(address);
        }

        return mapToResponse(address);
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        boolean wasDefault = address.getIsDefault();
        userAddressRepository.delete(address);

        if (wasDefault) {
            List<UserAddress> remaining = userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
            if (!remaining.isEmpty()) {
                UserAddress newDefault = remaining.get(0);
                newDefault.setIsDefault(true);
                userAddressRepository.save(newDefault);
            }
        }
    }

    private void resetDefaultAddresses(Long userId) {
        List<UserAddress> currentDefaults = userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId)
                .stream()
                .filter(UserAddress::getIsDefault)
                .collect(Collectors.toList());

        for (UserAddress defaultAddress : currentDefaults) {
            defaultAddress.setIsDefault(false);
            userAddressRepository.save(defaultAddress);
        }
    }

    private AddressResponse mapToResponse(UserAddress address) {
        return AddressResponse.builder()
                .id(address.getId())
                .name(address.getName())
                .phoneNumber(address.getPhoneNumber())
                .address(address.getAddress())
                .isDefault(address.getIsDefault())
                .build();
    }
}
