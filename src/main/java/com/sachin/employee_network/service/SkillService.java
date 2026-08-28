package com.sachin.employee_network.service;

import com.sachin.employee_network.dto.request.SkillRequest;
import com.sachin.employee_network.dto.response.SkillResponse;
import java.util.List;

public interface SkillService {
    List<SkillResponse> getAllSkills();

    SkillResponse createSkill(SkillRequest request);

    void deleteSkill(String id);
}