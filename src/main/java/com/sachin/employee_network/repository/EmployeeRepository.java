package com.sachin.employee_network.repository;

import com.sachin.employee_network.entity.Employee;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends Neo4jRepository<Employee, String> {

        @Query("MATCH (e:Employee) RETURN e")
        List<Employee> findAll();

        @Query("MATCH (e:Employee) WHERE e.name = $name RETURN e")
        Optional<Employee> findByName(String name);

        @Query("MATCH (e:Employee) WHERE e.department = $department RETURN e")
        List<Employee> findByDepartment(String department);

        @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
                        "WHERE s.name = $skillName RETURN e")
        List<Employee> findBySkillName(String skillName);

        @Query("MATCH (e1:Employee)-[:WORKS_ON]->(p:Project)<-[:WORKS_ON]-(e2:Employee) " +
                        "WHERE e1.name = $employeeName AND e1 <> e2 RETURN DISTINCT e2")
        List<Employee> findColleagues(String employeeName);

        @Query("MATCH (e:Employee)-[:REPORTS_TO*1..2]->(m:Employee) " +
                        "WHERE e.name = $employeeName RETURN m")
        List<Employee> findManagerChain(String employeeName);

        @Query("MATCH (e:Employee)-[:WORKS_ON]->(p:Project) " +
                        "WHERE p.name = $projectName RETURN e")
        List<Employee> findByProjectName(String projectName);

        @Query("MATCH (e:Employee) WHERE e.id = $id RETURN e")
        Optional<Employee> findById(String id);
}