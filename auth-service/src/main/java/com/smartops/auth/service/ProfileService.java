package com.smartops.auth.service;



import com.smartops.auth.dto.ChangePasswordRequest;
import com.smartops.auth.dto.ProfileRequest;
import com.smartops.auth.dto.ProfileResponse;
import com.smartops.auth.model.User;
import com.smartops.auth.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepo userRepository;

    private final PasswordEncoder passwordEncoder;

    public ProfileResponse getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return mapToResponse(user);
    }

    public ProfileResponse updateProfile(
            Long userId,
            ProfileRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        return mapToResponse(user);
    }

    public void changePassword(
            Long userId,
            ChangePasswordRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    private ProfileResponse mapToResponse(User user) {

        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}