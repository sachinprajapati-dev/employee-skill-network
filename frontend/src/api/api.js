import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'https://employee-skill-network.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Employee APIs
export const getAllEmployees = () => api.get('/employees');
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const findBySkill = (skillName) => api.get(`/employees/by-skill/${skillName}`);
export const findByDepartment = (dept) => api.get(`/employees/by-department/${dept}`);
export const findColleagues = (name) => api.get(`/employees/colleagues/${name}`);
export const findManagerChain = (name) => api.get(`/employees/manager-chain/${name}`);
export const findByProject = (name) => api.get(`/employees/by-project/${name}`);

// Skill APIs
export const getAllSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills', data);

// Project APIs
export const getAllProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);

export default api;