package com.example.demo.dto;
//Data transfer object

import java.util.List;

public class CandidateRequest {
    private String name;
    private String email;
    private Integer resumeScore;
    private String profileSummary;
    private List<String> topTechnicalSkills;

    // --- Getters and Setters ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getResumeScore() { return resumeScore; }
    public void setResumeScore(Integer resumeScore) { this.resumeScore = resumeScore; }
    public String getProfileSummary() { return profileSummary; }
    public void setProfileSummary(String profileSummary) { this.profileSummary = profileSummary; }
    public List<String> getTopTechnicalSkills() { return topTechnicalSkills; }
    public void setTopTechnicalSkills(List<String> topTechnicalSkills) { this.topTechnicalSkills = topTechnicalSkills; }
}