package com.aarthi.Resume_Analyser.repository;
import com.aarthi.Resume_Analyser.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository <User,Long> {
Optional<User> findByEmail(String email);
}
