# Employee Skill Network

A graph database application built with CognoDB (Neo4j-compatible) 
that models employees, their skills, and projects as a connected graph.

🔗 Live Demo: https://employee-skill-network.vercel.app
🔗 Backend API: https://employee-skill-network.onrender.com

## Why a Graph Database?

Relational databases struggle with relationship queries like:
- "Find all employees who share projects with a given employee"
- "Find the manager chain 2 levels up"

These require multiple JOINs that get slower as data grows.
CognoDB stores relationships as first-class data, making multi-hop 
traversals fast and natural using Cypher queries.

Example: Finding colleagues (employees sharing same project) = 
1 Cypher query vs multiple JOINs in SQL.

## Data Model



Nodes:
- Employee: id, name, email, department, designation
- Skill: id, name, category, level
- Project: id, name, description, status, domain

## Tech Stack

- Backend: Java 17, Spring Boot 4.1.1, Spring Data Neo4j
- Database: CognoDB (Neo4j-compatible graph database)
- Frontend: React 18, Vite, Material UI
- Deploy: Render (backend), Vercel (frontend)

## Key Cypher Queries

### Multi-hop traversal — Find manager chain
```cypher
MATCH (e:Employee)-[:REPORTS_TO*1..2]->(m:Employee)
WHERE e.name = $employeeName
RETURN m
```

### Find colleagues sharing same project
```cypher
MATCH (e1:Employee)-[:WORKS_ON]->(p:Project)<-[:WORKS_ON]-(e2:Employee)
WHERE e1.name = $employeeName AND e1 <> e2
RETURN DISTINCT e2
```

### Find employees by skill
```cypher
MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
WHERE s.name = $skillName
RETURN e
```

### Find employees by project
```cypher
MATCH (e:Employee)-[:WORKS_ON]->(p:Project)
WHERE p.name = $projectName
RETURN e
```

## Setup & Run

### Prerequisites
- Java 17+
- Node.js 18+
- CognoDB account (free tier at console.cognodb.com)

### CognoDB Setup
1. Sign up at https://console.cognodb.com/signup
2. Create a free (c0) instance
3. Save your connection URI and password

### Backend Setup
```bash
git clone https://github.com/sachinprajapati-dev/employee-skill-network
cd employee-skill-network

# Set environment variables
export COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud:7687
export COGNODB_USERNAME=cognodb
export COGNODB_PASSWORD=your_password

./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | Get all employees |
| GET | /api/employees/{id} | Get employee by ID |
| POST | /api/employees | Create employee |
| GET | /api/employees/by-skill/{skill} | Find by skill |
| GET | /api/employees/by-department/{dept} | Find by department |
| GET | /api/employees/colleagues/{name} | Find colleagues |
| GET | /api/employees/manager-chain/{name} | Find manager chain |
| GET | /api/skills | Get all skills |
| GET | /api/projects | Get all projects |

## Features

- View all employees with skills and projects
- Search employees by skill, department, or project
- View colleague connections (graph traversal)
- View manager chain (multi-hop traversal)
- Responsive UI with Material Design
- Graceful error handling for DB unavailability

## Author

Sachin Prajapati
sachinprajapati.one@gmail.com