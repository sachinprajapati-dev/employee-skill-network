package com.sachin.employee_network.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.neo4j.core.schema.*;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Node("Employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    private String email;
    private String department;
    private String designation;

    @Relationship(type = "HAS_SKILL", direction = Relationship.Direction.OUTGOING)
    private List<Skill> skills = new ArrayList<>();

    @Relationship(type = "WORKS_ON", direction = Relationship.Direction.OUTGOING)
    private List<Project> projects = new ArrayList<>();

    @Relationship(type = "REPORTS_TO", direction = Relationship.Direction.OUTGOING)
    private Employee manager;
}