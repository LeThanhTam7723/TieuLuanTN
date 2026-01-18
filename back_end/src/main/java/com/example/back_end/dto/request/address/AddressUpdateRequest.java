package com.example.back_end.dto.request.address;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressUpdateRequest {
    private String receiver;
    private String phone;
    private String address;
}
