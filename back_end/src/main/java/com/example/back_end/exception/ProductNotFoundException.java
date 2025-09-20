package com.example.back_end.exception;

public class ProductNotFoundException extends AppException{
        public ProductNotFoundException() {
            super(ErrorCode.PRODUCT_NOT_FOUND);
        }
}
