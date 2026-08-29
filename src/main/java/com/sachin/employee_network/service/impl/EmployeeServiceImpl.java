package com.sachin.employee_network.service.impl;

import com.sachin.employee_network.dto.request.EmployeeRequest;
import com.sachin.employee_network.dto.response.EmployeeResponse;
import com.sachin.employee_network.entity.Employee;
import com.sachin.employee_network.entity.Skill;
import com.sachin.employee_network.entity.Project;
import com.sachin.employee_network.repository.EmployeeRepository;
import com.sachin.employee_network.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final Neo4jClient neo4jClient;

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse getEmployeeById(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return convertToResponse(employee);
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        String employeeId = UUID.randomUUID().toString();

        neo4jClient.query("""
                MERGE (e:Employee {id: $id})
                SET e.name = $name, e.email = $email, e.department = $department, e.designation = $designation
                """)
                .bind(employeeId).to("id")
                .bind(request.getName()).to("name")
                .bind(request.getEmail()).to("email")
                .bind(request.getDepartment()).to("department")
                .bind(request.getDesignation()).to("designation")
                .run();

        List<String> skillNames = new ArrayList<>();
        if (request.getSkillNames() != null) {
            for (String skillName : request.getSkillNames()) {
                String skillId = findOrCreateSkill(skillName);
                linkEmployeeToSkill(employeeId, skillId);
                skillNames.add(skillName);
            }
        }

        List<String> projectNames = new ArrayList<>();
        if (request.getProjectNames() != null) {
            for (String projectName : request.getProjectNames()) {
                String projectId = findOrCreateProject(projectName);
                linkEmployeeToProject(employeeId, projectId);
                projectNames.add(projectName);
            }
        }

        String managerName = null;
        if (request.getManagerName() != null) {
            var managerRow = neo4jClient.query("""
                    MATCH (m:Employee {name: $name})
                    RETURN m.id AS id, m.name AS name
                    """)
                    .bind(request.getManagerName()).to("name")
                    .fetch()
                    .one();

            if (managerRow.isPresent()) {
                String managerId = (String) managerRow.get().get("id");
                managerName = (String) managerRow.get().get("name");
                linkEmployeeToManager(employeeId, managerId);
            }
        }

        EmployeeResponse response = new EmployeeResponse();
        response.setId(employeeId);
        response.setName(request.getName());
        response.setEmail(request.getEmail());
        response.setDepartment(request.getDepartment());
        response.setDesignation(request.getDesignation());
        response.setSkills(skillNames);
        response.setProjects(projectNames);
        response.setManagerName(managerName);
        return response;
    }

    @Override
    public List<EmployeeResponse> findBySkill(String skillName) {
        return employeeRepository.findBySkillName(skillName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> findByDepartment(String department) {
        return employeeRepository.findByDepartment(department)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> findColleagues(String employeeName) {
        return employeeRepository.findColleagues(employeeName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> findManagerChain(String employeeName) {
        return employeeRepository.findManagerChain(employeeName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> findByProject(String projectName) {
        return employeeRepository.findByProjectName(projectName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }

    private String findOrCreateSkill(String skillName) {
        String newId = UUID.randomUUID().toString();
        return neo4jClient.query("""
                MERGE (s:Skill {name: $name})
                ON CREATE SET s.id = $newId, s.category = $category, s.level = $level
                RETURN s.id AS id
                """)
                .bind(skillName).to("name")
                .bind(newId).to("newId")
                .bind("General").to("category")
                .bind("Intermediate").to("level")
                .fetchAs(String.class)
                .one()
                .orElse(newId);
    }

    private String findOrCreateProject(String projectName) {
        String newId = UUID.randomUUID().toString();
        return neo4jClient.query("""
                MERGE (p:Project {name: $name})
                ON CREATE SET p.id = $newId, p.status = $status, p.domain = $domain
                RETURN p.id AS id
                """)
                .bind(projectName).to("name")
                .bind(newId).to("newId")
                .bind("Active").to("status")
                .bind("General").to("domain")
                .fetchAs(String.class)
                .one()
                .orElse(newId);
    }

    private void linkEmployeeToSkill(String employeeId, String skillId) {
        neo4jClient.query("""
                MATCH (e:Employee {id: $employeeId}), (s:Skill {id: $skillId})
                MERGE (e)-[:HAS_SKILL]->(s)
                """)
                .bind(employeeId).to("employeeId")
                .bind(skillId).to("skillId")
                .run();
    }

    private void linkEmployeeToProject(String employeeId, String projectId) {
        neo4jClient.query("""
                MATCH (e:Employee {id: $employeeId}), (p:Project {id: $projectId})
                MERGE (e)-[:WORKS_ON]->(p)
                """)
                .bind(employeeId).to("employeeId")
                .bind(projectId).to("projectId")
                .run();
    }

    private void linkEmployeeToManager(String employeeId, String managerId) {
        neo4jClient.query("""
                MATCH (e:Employee {id: $employeeId}), (m:Employee {id: $managerId})
                MERGE (e)-[:REPORTS_TO]->(m)
                """)
                .bind(employeeId).to("employeeId")
                .bind(managerId).to("managerId")
                .run();
    }

    private EmployeeResponse convertToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setName(employee.getName());
        response.setEmail(employee.getEmail());
        response.setDepartment(employee.getDepartment());
        response.setDesignation(employee.getDesignation());

        if (employee.getSkills() != null) {
            response.setSkills(employee.getSkills()
                    .stream()
                    .map(Skill::getName)
                    .collect(Collectors.toList()));
        }

        if (employee.getProjects() != null) {
            response.setProjects(employee.getProjects()
                    .stream()
                    .map(Project::getName)
                    .collect(Collectors.toList()));
        }

        if (employee.getManager() != null) {
            response.setManagerName(employee.getManager().getName());
        }

        return response;
    }
}