package com.sachin.employee_network.service.impl;

import com.sachin.employee_network.dto.request.SkillRequest;
import com.sachin.employee_network.dto.response.SkillResponse;
import com.sachin.employee_network.entity.Skill;
import com.sachin.employee_network.repository.SkillRepository;
import com.sachin.employee_network.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final Neo4jClient neo4jClient;

    @Override
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SkillResponse createSkill(SkillRequest request) {
        String newId = UUID.randomUUID().toString();

        String id = neo4jClient.query("""
                MERGE (s:Skill {name: $name})
                ON CREATE SET s.id = $newId
                SET s.category = $category, s.level = $level
                RETURN s.id AS id
                """)
                .bind(request.getName()).to("name")
                .bind(newId).to("newId")
                .bind(request.getCategory()).to("category")
                .bind(request.getLevel()).to("level")
                .fetchAs(String.class)
                .one()
                .orElse(newId);

        Skill saved = new Skill();
        saved.setId(id);
        saved.setName(request.getName());
        saved.setCategory(request.getCategory());
        saved.setLevel(request.getLevel());
        return convertToResponse(saved);
    }

    @Override
    public void deleteSkill(String id) {
        skillRepository.deleteById(id);
    }

    private SkillResponse convertToResponse(Skill skill) {
        SkillResponse response = new SkillResponse();
        response.setId(skill.getId());
        response.setName(skill.getName());
        response.setCategory(skill.getCategory());
        response.setLevel(skill.getLevel());
        return response;
    }
}