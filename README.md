# 🚀 SmartOps AI

An **AI-powered distributed system monitoring and incident management platform** designed to track microservices health, stream real-time logs, and detect anomalies in a scalable architecture.

---

## 📌 Overview

SmartOps AI is a full-stack enterprise-grade system that helps developers and DevOps teams:

* Monitor distributed microservices
* Stream logs in real-time
* Detect failures and anomalies
* Manage alerts efficiently

The system follows a **microservices architecture** with centralized authentication and event-driven communication.

---

## 🧩 Tech Stack

### 🔹 Backend

* Java 17
* Spring Boot (Microservices)
* Spring Cloud (Eureka, API Gateway)
* Spring Security (JWT Authentication)
* Apache Kafka (Event Streaming)
* WebSocket (Real-time communication)
* MongoDB (Logs & Monitoring Data)
* MySQL (User Authentication)

### 🔹 Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* WebSocket Client Integration

### 🔹 DevOps & Tools

* Docker & Docker Compose
* Git & GitHub
* Postman (API Testing)

---

## 🏗️ System Architecture

### 🔹 Core Components

* **API Gateway**

  * Central entry point
  * Handles JWT authentication
  * Routes requests to services

* **Service Registry (Eureka)**

  * Enables service discovery
  * Dynamic service registration

* **Auth Service**

  * User login & registration
  * JWT token generation

* **Monitoring Service**

  * Collects logs from services
  * Stores logs in MongoDB
  * Streams logs via WebSocket

* **Alert Service**

  * Generates alerts based on conditions
  * Notifies system on anomalies

* **Kafka**

  * Event-driven communication between services
  * Decouples system components

* **Frontend Dashboard**

  * Displays logs in real-time
  * Shows system health & alerts

---

## 📁 Project Structure

```
smartops-ai/
├── api-gateway/
├── auth-service/
├── monitoring-service/
├── alert-service/
├── service-registry/
├── smartops-dashboard/
└── docker-compose.yml
```

---

## 🔐 Key Features

* ✅ JWT-based Authentication via API Gateway
* ✅ Role-based access control (extendable)
* ✅ Real-time log streaming using WebSockets
* ✅ Kafka-based asynchronous communication
* ✅ Centralized service monitoring
* ✅ Alert generation system
* ✅ Scalable microservices architecture

---

## ⚙️ How to Run the Project

### 🔹 Prerequisites

* Java 17
* Node.js (v18+)
* Docker (optional but recommended)
* MongoDB & MySQL running locally

---

### 🔹 Run Backend Services

Start services in the following order:

1. **Service Registry**

```bash
cd service-registry
./mvnw spring-boot:run
```

2. **API Gateway**

```bash
cd api-gateway
./mvnw spring-boot:run
```

3. **Other Services**

```bash
cd auth-service
./mvnw spring-boot:run

cd monitoring-service
./mvnw spring-boot:run

cd alert-service
./mvnw spring-boot:run
```

---

### 🔹 Run Frontend

```bash
cd smartops-dashboard
npm install
npm run dev
```

Frontend will run on:
👉 http://localhost:3000

---

### 🔹 Run with Docker (Optional)

```bash
docker-compose up --build
```

---

## 🔄 Workflow

1. User logs in → JWT generated
2. Requests go through API Gateway
3. Services communicate via Kafka
4. Logs are sent to Monitoring Service
5. WebSocket streams logs to frontend
6. Alerts generated if anomalies detected

---

## 📊 Future Enhancements

* 🤖 AI-based anomaly detection (Gemini / ML integration)
* 📈 Advanced analytics dashboard
* 🔔 Notification system (Email/SMS)
* 👥 Role-based access control (Admin/User)
* ☁️ Cloud deployment (AWS/GCP)

---

## 🧠 Key Learnings

* Microservices architecture design
* Event-driven systems using Kafka
* Real-time communication using WebSockets
* Secure API design with JWT
* Scalable system architecture

---

## 📬 Contact

**Vivek Kushwaha**

* GitHub: https://github.com/ivivekkushwah
* LinkedIn: www.linkedin.com/in/ivivekkushwaha

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
