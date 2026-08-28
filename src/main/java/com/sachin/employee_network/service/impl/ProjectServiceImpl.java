package com.sachin.employee_network.service.impl;

import com.sachin.employee_network.dto.request.ProjectRequest;
import com.sachin.employee_network.dto.response.ProjectResponse;
import com.sachin.employee_network.entity.Project;
import com.sachin.employee_network.repository.ProjectRepository;
import com.sachin.employee_network.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final Neo4jClient neo4jClient;

    @Override
    public List<ProjectResponse> getAllProjects() {
        // Reads via the repository are fine — the internal-id issue only affects
        // save().
        return projectRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        // MERGE on name (the real business key) so calling this twice with the
        // same name updates the existing node instead of creating a duplicate.
        // The id is only generated the first time (ON CREATE); on a repeat call
        // the existing id is kept and returned.
        String newId = UUID.randomUUID().toString();

        String id = neo4jClient.query("""
                MERGE (p:Project {name: $name})
                ON CREATE SET p.id = $newId
                SET p.description = $description, p.status = $status, p.domain = $domain
                RETURN p.id AS id
                """)
                .bind(request.getName()).to("name")
                .bind(newId).to("newId")
                .bind(request.getDescription()).to("description")
                .bind(request.getStatus()).to("status")
                .bind(request.getDomain()).to("domain")
                .fetchAs(String.class)
                .one()
                .orElse(newId);

        Project saved = new Project();
        saved.setId(id);
        saved.setName(request.getName());
        saved.setDescription(request.getDescription());
        saved.setStatus(request.getStatus());
        saved.setDomain(request.getDomain());
        return convertToResponse(saved);
    }

    @Override
    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    private ProjectResponse convertToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setStatus(project.getStatus());
        response.setDomain(project.getDomain());
        return response;
    }
}