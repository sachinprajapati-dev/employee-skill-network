package com.sachin.employee_network.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    private String name;
    private String email;
    private String department;
    private String designation;
    private List<String> skillNames;
    private List<String> projectNames;
    private String managerName;
}