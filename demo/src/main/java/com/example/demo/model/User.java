package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // "user" is a reserved keyword in PostgreSQL, so we name the table "users"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    // A user has exactly one resume profile
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ResumeProfile resumeProfile;

    // --- Constructors ---
    public User() {}

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public ResumeProfile getResumeProfile() { return resumeProfile; }
    public void setResumeProfile(ResumeProfile resumeProfile) { this.resumeProfile = resumeProfile; }
}