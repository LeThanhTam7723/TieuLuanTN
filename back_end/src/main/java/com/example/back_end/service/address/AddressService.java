package com.example.back_end.service.address;

import com.example.back_end.dto.request.address.AddressRequest;
import com.example.back_end.dto.request.address.AddressUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.dto.response.address.AddressResponse;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.entity.Address;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.AddressMapper;
import com.example.back_end.repository.AddressRepository;
import com.example.back_end.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AddressService implements IAddressService{
    private final IUserService userService;
    private final AddressMapper addressMapper;
    private final AddressRepository addressRepository;
    @Override
    public AddressResponse createAddress(AddressRequest request) {
        UserResponse currentUser = userService.getCurrentUser();
        System.out.println(request.isDefaultAddress());
        Address address = addressMapper.toEntity(request);
        address.setUser(userService.getUserById(currentUser.getId()));
        Address savedAddress = addressRepository.save(address);
        if (savedAddress == null || savedAddress.getId() == null) {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }
        return addressMapper.toResponse(savedAddress);
    }

    @Override
    public AddressResponse updateAddress(Long id,AddressUpdateRequest request) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        // chỉ cho sửa địa chỉ của chính mình
        Long currentUserId = userService.getCurrentUser().getId();
        if (!address.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not allowed to modify this address");
        }

        addressMapper.updateAddressFromRequest(request, address);

        Address saved = addressRepository.save(address);

        return addressMapper.toResponse(saved);
    }

    @Override
    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Long currentUserId = userService.getCurrentUser().getId();
        if (!address.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not allowed to delete this address");
        }

        addressRepository.delete(address);
    }

    @Override
    public List<AddressResponse> getAddressesOfCurrentUser() {
        Long userId = userService.getCurrentUser().getId();

        List<Address> addresses = addressRepository.findAllByUserId(userId);

        return addresses.stream()
                .map(addressMapper::toResponse)
                .toList();
    }
}
