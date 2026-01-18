package com.example.back_end.dto.request.address;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
    private String receiver;
    private String phone;
    private String address;
    @JsonProperty("isDefault")
    private boolean defaultAddress;
}
