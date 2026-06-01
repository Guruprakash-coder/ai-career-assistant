package com.example.demo.repository;

import com.example.demo.model.ResumeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeProfileRepository extends JpaRepository<ResumeProfile, Long> {
}