package com.supinfo.api_traficandme.user.repository;

import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<UserInfo, Integer> {
    Optional<UserInfo> findByEmail(String email);
    boolean existsByEmail(String email);
    UserInfo findOneByEmail(String email);
    long countByStatus(StatusUser status);
}
