package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA automatically provides save(), findById(), findAll(), etc.

    // If we ever need to find a user by their email, we just declare it here!
    User findByEmail(String email);
}