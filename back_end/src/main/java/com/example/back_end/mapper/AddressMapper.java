package com.example.back_end.mapper;

import com.example.back_end.dto.request.address.AddressRequest;
import com.example.back_end.dto.request.address.AddressUpdateRequest;
import com.example.back_end.dto.response.address.AddressResponse;
import com.example.back_end.entity.Address;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true) // set sau
    @Mapping(source = "defaultAddress", target = "defaultAddress")
    Address toEntity(AddressRequest request);

    @Mapping(source = "defaultAddress", target = "defaultAddress")
    AddressResponse toResponse(Address address);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateAddressFromRequest(AddressUpdateRequest request, @MappingTarget Address address);
}
