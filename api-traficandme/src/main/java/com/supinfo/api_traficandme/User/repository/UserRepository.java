package com.supinfo.api_traficandme.User.repository;

import com.supinfo.api_traficandme.User.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<UserInfo, Integer> {
    Optional<UserInfo> findByEmail(String email);
}
