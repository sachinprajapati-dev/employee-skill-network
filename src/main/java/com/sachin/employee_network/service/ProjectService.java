package com.sachin.employee_network.service;

import com.sachin.employee_network.dto.request.ProjectRequest;
import com.sachin.employee_network.dto.response.ProjectResponse;
import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllProjects();

    ProjectResponse createProject(ProjectRequest request);

    void deleteProject(String id);
}