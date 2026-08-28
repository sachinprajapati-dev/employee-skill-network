package com.sachin.employee_network.repository;

import com.sachin.employee_network.entity.Skill;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import java.util.Optional;

public interface SkillRepository extends Neo4jRepository<Skill, String> {
    Optional<Skill> findByName(String name);
}