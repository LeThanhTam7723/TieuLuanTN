package com.example.back_end.service.address;

import com.example.back_end.dto.request.address.AddressRequest;
import com.example.back_end.dto.request.address.AddressUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.address.AddressResponse;

import java.util.List;

public interface IAddressService {
    AddressResponse createAddress(AddressRequest request);
    AddressResponse updateAddress(Long id, AddressUpdateRequest request);
    void deleteAddress(Long id);
    List<AddressResponse> getAddressesOfCurrentUser();
}
