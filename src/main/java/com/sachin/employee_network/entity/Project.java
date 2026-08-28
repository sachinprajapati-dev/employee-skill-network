package com.sachin.employee_network.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.neo4j.core.schema.*;
import java.util.UUID;

@Node("Project")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    private String description;
    private String status;
    private String domain;
}