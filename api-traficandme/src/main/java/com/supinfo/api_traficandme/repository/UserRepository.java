package com.supinfo.api_traficandme.repository;

import com.supinfo.api_traficandme.entity.UserInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository  extends CrudRepository<UserInfo, Integer> {
    UserInfo findByEmail(String email);
}
