package com.example.demo.controller;

import com.example.demo.dto.CandidateRequest;
import com.example.demo.model.ResumeProfile;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates") // The base URL for this controller
public class CandidateController {

    private final UserRepository userRepository;

    // Spring automatically injects the Repository here
    public CandidateController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/save")
    public String saveCandidate(@RequestBody CandidateRequest request) {
        // 1. Create the basic User
        User newUser = new User(request.getName(), request.getEmail());

        // 2. Create the Resume Profile with the AI Data
        ResumeProfile profile = new ResumeProfile();
        profile.setResumeScore(request.getResumeScore());
        profile.setProfileSummary(request.getProfileSummary());
        profile.setTopTechnicalSkills(request.getTopTechnicalSkills());

        // 3. Link them together (Bidirectional relationship)
        profile.setUser(newUser);
        newUser.setResumeProfile(profile);

        // 4. Save to Database!
        // Because we used CascadeType.ALL on the User entity, saving the user
        // automatically saves the ResumeProfile and the list of skills too!
        userRepository.save(newUser);

        return "Success! Candidate profile and AI score saved to Neon Database.";
    }
}