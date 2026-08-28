package com.sachin.employee_network.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private String id;
    private String name;
    private String email;
    private String department;
    private String designation;
    private List<String> skills;
    private List<String> projects;
    private String managerName;
}