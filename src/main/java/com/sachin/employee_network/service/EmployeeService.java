package com.sachin.employee_network.service;

import com.sachin.employee_network.dto.request.EmployeeRequest;
import com.sachin.employee_network.dto.response.EmployeeResponse;
import java.util.List;

public interface EmployeeService {
    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(String id);

    EmployeeResponse createEmployee(EmployeeRequest request);

    List<EmployeeResponse> findBySkill(String skillName);

    List<EmployeeResponse> findByDepartment(String department);

    List<EmployeeResponse> findColleagues(String employeeName);

    List<EmployeeResponse> findManagerChain(String employeeName);

    List<EmployeeResponse> findByProject(String projectName);

    void deleteEmployee(String id);
}