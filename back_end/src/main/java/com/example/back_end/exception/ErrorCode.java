package com.example.back_end.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(1002, "Invalid request", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1003, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1004, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1005, "Sai mật khẩu đăng nhập", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    SESSION_EXPIRED(1008, "Your session has expired. Please log in again.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1009, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1010, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INACTIVE_ACC(1011,"Your account had been clock", HttpStatus.LOCKED),
    PRODUCT_NOT_FOUND(1012, "Can not find the product", HttpStatus.NOT_FOUND),
    CATEGORY_EXIST(1013, "Category already exists", HttpStatus.CONFLICT),
    CATEGORY_NOT_FOUND(1014, "Can not find the category", HttpStatus.NOT_FOUND),
    IMAGE_NOT_FOUND(1015, "Can not find the image", HttpStatus.NOT_FOUND),
    BRAND_NOT_FOUND(1016, "Can not find the brand", HttpStatus.NOT_FOUND),
    GENDER_NOT_FOUND(1017, "Can not find the gender", HttpStatus.NOT_FOUND),
    PRODUCT_NAME_EXISTS(1018, "Product name already exists for this brand", HttpStatus.CONFLICT),
    CLOUDINARY_ERROR(1019, "Error occurred while processing image on Cloudinary", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_IMAGE_FORMAT(1020, "Invalid image format. Supported formats: JPG, PNG, GIF", HttpStatus.BAD_REQUEST),
    IMAGE_SIZE_TOO_LARGE(1021, "Image size is too large. Maximum size: 5MB", HttpStatus.BAD_REQUEST),
    COLOR_NOT_FOUND(1022, "Can not find the color", HttpStatus.NOT_FOUND),
    SIZE_NOT_FOUND(1023, "Can not find the size", HttpStatus.NOT_FOUND),
    VARIANT_NOT_FOUND(1024, "Can not find the product variant", HttpStatus.NOT_FOUND),
    VARIANT_EXISTS(1025, "Product variant with this color and size already exists", HttpStatus.CONFLICT),
    CATEGORY_NAME_EXISTS(1026, "Category name already exists", HttpStatus.CONFLICT),
    OPERATION_NOT_SUPPORTED(1027, "This operation is not supported", HttpStatus.METHOD_NOT_ALLOWED),
    PRODUCT_SLUG_EXISTS(1028, "Product slug already exists", HttpStatus.CONFLICT),
    CATEGORY_SLUG_EXISTS(1029, "Category slug already exists", HttpStatus.CONFLICT),
    PHONE_EXISTED(1020, "Số điện thoại đã được sử dụng", HttpStatus.BAD_REQUEST),
    INVALID_PHONE_FORMAT(1021, "Định dạng số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_FULLNAME_FORMAT(1022, "Định dạng họ tên không hợp lệ", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH(1023, "Mật khẩu xác nhận không khớp", HttpStatus.BAD_REQUEST),
    PASSWORD_SAME_AS_OLD(1024, "Mật khẩu mới không được trùng với mật khẩu cũ", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_FORMAT(1025, "Mật khẩu không đáp ứng yêu cầu bảo mật", HttpStatus.BAD_REQUEST),
    USER_AVATAR_TOO_LARGE(1027, "Kích thước ảnh đại diện quá lớn", HttpStatus.BAD_REQUEST),
    CATEGORY_IMAGE_NOT_FOUND(1028, "Category image not found", HttpStatus.NOT_FOUND),
    CATEGORY_IMAGE_ALREADY_EXISTS(1029, "Category image already exists", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1030, "Không tìm thấy đơn hàng", HttpStatus.NOT_FOUND),
    STATUS_NOT_FOUND(1031, "Không tìm thấy trạng thái đơn hàng", HttpStatus.NOT_FOUND),
    DISCOUNT_NOT_FOUND(1032, "Không tìm thấy khuyến mãi", HttpStatus.NOT_FOUND),
    DISCOUNT_CODE_EXISTS(1033, "Mã khuyến mãi đã tồn tại", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1034, "Role not existed", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
