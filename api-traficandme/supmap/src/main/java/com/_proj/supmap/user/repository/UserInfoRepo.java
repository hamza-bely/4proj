package com._proj.supmap.user.repository;

import com._proj.supmap.user.model.UserInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepo extends CrudRepository<Integer, UserInfo> {
}
