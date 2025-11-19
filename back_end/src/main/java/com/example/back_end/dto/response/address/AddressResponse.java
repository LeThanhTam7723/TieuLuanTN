package com.example.back_end.dto.response.address;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Long id;
    private String receiver;
    private String phone;
    private String address;
    @JsonProperty("isDefault")
    private boolean defaultAddress;
}
