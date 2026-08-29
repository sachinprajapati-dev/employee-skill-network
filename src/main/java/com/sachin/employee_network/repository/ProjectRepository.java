package com.sachin.employee_network.repository;

import com.sachin.employee_network.entity.Project;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends Neo4jRepository<Project, String> {

    @Query("MATCH (p:Project) RETURN p")
    List<Project> findAll();

    @Query("MATCH (p:Project) WHERE p.name = $name RETURN p")
    Optional<Project> findByName(String name);
}