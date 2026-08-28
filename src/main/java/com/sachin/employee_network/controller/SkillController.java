package com.sachin.employee_network.controller;

import com.sachin.employee_network.dto.request.SkillRequest;
import com.sachin.employee_network.dto.response.SkillResponse;
import com.sachin.employee_network.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping
    public ResponseEntity<SkillResponse> createSkill(@RequestBody SkillRequest request) {
        return ResponseEntity.ok(skillService.createSkill(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable String id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok().build();
    }
}