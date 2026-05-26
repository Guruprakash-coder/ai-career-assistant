package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "resume_profiles")
public class ResumeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer resumeScore;

    @Column(columnDefinition = "TEXT") // Tells Postgres to allow long paragraphs
    private String profileSummary;

    // This creates a separate mini-table specifically to hold the list of skills!
    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private List<String> topTechnicalSkills;

    // Links this profile back to a specific User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // --- Constructors ---
    public ResumeProfile() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public Integer getResumeScore() { return resumeScore; }
    public void setResumeScore(Integer resumeScore) { this.resumeScore = resumeScore; }
    public String getProfileSummary() { return profileSummary; }
    public void setProfileSummary(String profileSummary) { this.profileSummary = profileSummary; }
    public List<String> getTopTechnicalSkills() { return topTechnicalSkills; }
    public void setTopTechnicalSkills(List<String> topTechnicalSkills) { this.topTechnicalSkills = topTechnicalSkills; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}