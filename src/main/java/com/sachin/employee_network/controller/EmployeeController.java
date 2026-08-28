package com.sachin.employee_network.controller;

import com.sachin.employee_network.dto.request.EmployeeRequest;
import com.sachin.employee_network.dto.response.EmployeeResponse;
import com.sachin.employee_network.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-skill/{skillName}")
    public ResponseEntity<List<EmployeeResponse>> findBySkill(@PathVariable String skillName) {
        return ResponseEntity.ok(employeeService.findBySkill(skillName));
    }

    @GetMapping("/by-department/{department}")
    public ResponseEntity<List<EmployeeResponse>> findByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(employeeService.findByDepartment(department));
    }

    @GetMapping("/colleagues/{employeeName}")
    public ResponseEntity<List<EmployeeResponse>> findColleagues(@PathVariable String employeeName) {
        return ResponseEntity.ok(employeeService.findColleagues(employeeName));
    }

    @GetMapping("/manager-chain/{employeeName}")
    public ResponseEntity<List<EmployeeResponse>> findManagerChain(@PathVariable String employeeName) {
        return ResponseEntity.ok(employeeService.findManagerChain(employeeName));
    }

    @GetMapping("/by-project/{projectName}")
    public ResponseEntity<List<EmployeeResponse>> findByProject(@PathVariable String projectName) {
        return ResponseEntity.ok(employeeService.findByProject(projectName));
    }
}