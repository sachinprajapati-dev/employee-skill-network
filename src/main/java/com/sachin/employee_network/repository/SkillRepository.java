package com.sachin.employee_network.repository;

import com.sachin.employee_network.entity.Skill;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.List;
import java.util.Optional;

public interface SkillRepository extends Neo4jRepository<Skill, String> {

    @Query("MATCH (s:Skill) RETURN s")
    List<Skill> findAll();

    @Query("MATCH (s:Skill) WHERE s.name = $name RETURN s")
    Optional<Skill> findByName(String name);
}