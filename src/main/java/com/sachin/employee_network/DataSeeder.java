package com.sachin.employee_network;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final Neo4jClient neo4jClient;

    @Override
    public void run(String... args) {

        // Clear existing data first
        // neo4jClient.query("MATCH (n) DETACH DELETE n").run();

        // Only seed on a truly empty database. Without this check, every
        // restart wipes the whole graph — including anything added later
        // through the API/Postman — and recreates just the original demo data.
        Long existingNodeCount = neo4jClient.query("MATCH (n) RETURN count(n) AS count")
                .fetchAs(Long.class)
                .one()
                .orElse(0L);

        if (existingNodeCount > 0) {
            System.out.println("Database already has data (" + existingNodeCount
                    + " nodes) — skipping seed.");
            return;
        }

        // ---- Skills ----
        String javaId = saveSkill("Java", "Backend", "Expert");
        String springBootId = saveSkill("Spring Boot", "Backend", "Expert");
        String reactId = saveSkill("React", "Frontend", "Intermediate");
        String reactNativeId = saveSkill("React Native", "Mobile", "Intermediate");
        String mysqlId = saveSkill("MySQL", "Database", "Expert");
        String restApiId = saveSkill("REST APIs", "Backend", "Expert");

        // ---- Projects ----
        String paydayId = saveProject("PAYDAY", "Payroll and HRMS Platform", "Active", "HRMS");
        String certReadyId = saveProject("CertReadyHealth", "Healthcare Exam Prep Platform", "Active", "Healthcare");
        String hostelId = saveProject("Hostel Management", "Hostel Management Mobile App", "Active", "Facility");

        // ---- Manager ----
        String managerId = saveEmployee("Rajesh Kumar", "rajesh@stpl.com", "Engineering", "Tech Lead");
        linkSkills(managerId, javaId, springBootId, mysqlId);
        linkProjects(managerId, paydayId);

        // ---- Employee 1 ----
        String emp1Id = saveEmployee("Sachin Prajapati", "sachin@stpl.com", "Engineering", "Full Stack Developer");
        linkSkills(emp1Id, javaId, springBootId, reactNativeId, mysqlId);
        linkProjects(emp1Id, paydayId, certReadyId, hostelId);
        linkManager(emp1Id, managerId);

        // ---- Employee 2 ----
        String emp2Id = saveEmployee("Priya Sharma", "priya@stpl.com", "Engineering", "Frontend Developer");
        linkSkills(emp2Id, reactId, reactNativeId, restApiId);
        linkProjects(emp2Id, paydayId, hostelId);
        linkManager(emp2Id, managerId);

        // ---- Employee 3 ----
        String emp3Id = saveEmployee("Amit Singh", "amit@stpl.com", "Backend", "Backend Developer");
        linkSkills(emp3Id, javaId, springBootId, restApiId, mysqlId);
        linkProjects(emp3Id, certReadyId);
        linkManager(emp3Id, managerId);

        // ---- Employee 4 ----
        String emp4Id = saveEmployee("Neha Gupta", "neha@stpl.com", "Mobile", "Mobile Developer");
        linkSkills(emp4Id, reactId, reactNativeId);
        linkProjects(emp4Id, hostelId, certReadyId);
        linkManager(emp4Id, managerId);

        System.out.println("Data seeded successfully!");
    }

    private String saveSkill(String name, String category, String level) {
        String id = UUID.randomUUID().toString();
        neo4jClient.query("""
                MERGE (s:Skill {id: $id})
                SET s.name = $name, s.category = $category, s.level = $level
                """)
                .bind(id).to("id")
                .bind(name).to("name")
                .bind(category).to("category")
                .bind(level).to("level")
                .run();
        return id;
    }

    private String saveProject(String name, String description, String status, String domain) {
        String id = UUID.randomUUID().toString();
        neo4jClient.query("""
                MERGE (p:Project {id: $id})
                SET p.name = $name, p.description = $description, p.status = $status, p.domain = $domain
                """)
                .bind(id).to("id")
                .bind(name).to("name")
                .bind(description).to("description")
                .bind(status).to("status")
                .bind(domain).to("domain")
                .run();
        return id;
    }

    private String saveEmployee(String name, String email, String department, String designation) {
        String id = UUID.randomUUID().toString();
        neo4jClient.query("""
                MERGE (e:Employee {id: $id})
                SET e.name = $name, e.email = $email, e.department = $department, e.designation = $designation
                """)
                .bind(id).to("id")
                .bind(name).to("name")
                .bind(email).to("email")
                .bind(department).to("department")
                .bind(designation).to("designation")
                .run();
        return id;
    }

    private void linkSkills(String employeeId, String... skillIds) {
        for (String skillId : skillIds) {
            neo4jClient.query("""
                    MATCH (e:Employee {id: $employeeId}), (s:Skill {id: $skillId})
                    MERGE (e)-[:HAS_SKILL]->(s)
                    """)
                    .bind(employeeId).to("employeeId")
                    .bind(skillId).to("skillId")
                    .run();
        }
    }

    private void linkProjects(String employeeId, String... projectIds) {
        for (String projectId : projectIds) {
            neo4jClient.query("""
                    MATCH (e:Employee {id: $employeeId}), (p:Project {id: $projectId})
                    MERGE (e)-[:WORKS_ON]->(p)
                    """)
                    .bind(employeeId).to("employeeId")
                    .bind(projectId).to("projectId")
                    .run();
        }
    }

    private void linkManager(String employeeId, String managerId) {
        neo4jClient.query("""
                MATCH (e:Employee {id: $employeeId}), (m:Employee {id: $managerId})
                MERGE (e)-[:REPORTS_TO]->(m)
                """)
                .bind(employeeId).to("employeeId")
                .bind(managerId).to("managerId")
                .run();
    }
}