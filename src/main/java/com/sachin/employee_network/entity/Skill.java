package com.sachin.employee_network.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.neo4j.core.schema.*;
import java.util.UUID;

@Node("Skill")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    private String category;
    private String level;
}