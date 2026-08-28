package com.sachin.employee_network.repository;

import com.sachin.employee_network.entity.Project;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import java.util.Optional;

public interface ProjectRepository extends Neo4jRepository<Project, String> {
    Optional<Project> findByName(String name);
}