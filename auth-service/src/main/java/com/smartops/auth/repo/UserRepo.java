package com.smartops.auth.repo;


import com.smartops.auth.model.User;
import com.smartops.auth.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo  extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Object findByRole(Role owner);
}
