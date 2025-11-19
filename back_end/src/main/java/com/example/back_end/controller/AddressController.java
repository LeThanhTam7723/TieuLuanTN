package com.example.back_end.controller;

import com.example.back_end.dto.request.address.AddressRequest;
import com.example.back_end.dto.request.address.AddressUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.address.AddressResponse;
import com.example.back_end.service.address.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
public class AddressController {
    private final AddressService addressService;
    @PostMapping("/create")
    public ApiResponse<AddressResponse> createAddress(@RequestBody AddressRequest request) {
        AddressResponse response = addressService.createAddress(request);
        return ApiResponse.<AddressResponse>builder()
                .code(0)
                .message("Address add successful")
                .result(response)
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<AddressResponse> updateAddress(@PathVariable Long id, @RequestBody AddressUpdateRequest request
    ) {
        AddressResponse response = addressService.updateAddress(id, request);
        return ApiResponse.<AddressResponse>builder()
                .code(0)
                .message("Address update successful")
                .result(response)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ApiResponse.<String>builder()
                .code(0)
                .message("Address delete successful")
                .result("OK")
                .build();
    }
    @GetMapping("/my")
    public ApiResponse<List<AddressResponse>> getMyAddresses() {
        List<AddressResponse> list = addressService.getAddressesOfCurrentUser();
        return ApiResponse.<List<AddressResponse>>builder()
                .code(0)
                .message("Get address list successful")
                .result(list)
                .build();
    }
}
