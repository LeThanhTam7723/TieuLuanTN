package com.example.back_end.service;

import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.LoginRequest;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.InvalidatedToken;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repository.InvalidatedTokenRepository;
import com.example.back_end.repository.RoleRepository;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.cart.CartDetailService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    InvalidatedTokenRepository invalidatedTokenRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private CartDetailService cartDetailService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    private final ModelMapper modelMapper;
    @NonFinal
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValue = true;
        String email="";
        try {
            verifyToken(token);
            email = verifyToken(token).getJWTClaimsSet().getSubject();
        } catch (AppException e){
            isValue = false;
        }
        return IntrospectResponse.builder().valid(isValue).email(email).build();
    }

    public AuthenticationResponse login (LoginRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        UserResponse userDto = modelMapper.map(user, UserResponse.class);

        if(!user.getActive()){
            throw new AppException(ErrorCode.INACTIVE_ACC);
        }
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());
        boolean authenticated =passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println(authenticated);
        if(!authenticated){
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }
        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).currentUser(userDto).authenticated(true).build();
    }

    public void logout(IntrospectRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());
        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);
    }

    public SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if(!(verified && expiryTime.after(new Date()))){
            throw new AppException(ErrorCode.SESSION_EXPIRED);
        }
        if(invalidatedTokenRepository
                .existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        System.out.println(buildScope(user));

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("CDWED.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope",buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header,payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            System.out.println("Can't get toten"+e);
            throw new RuntimeException(e);
        }
    }

    public String createVerifyToken(String email) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("CDWED.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("custorClaim","Custom")
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header,payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot get token",e);
            throw new RuntimeException(e);
        }

    }


    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" "); // dùng khoảng trắng ngăn cách scope
        if(!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> stringJoiner.add(role.getName())); // Lấy tên role
        }
        return stringJoiner.toString();
    }



}
