# 🚀 SmartOps AI

An AI-powered observability and incident management platform built using Spring Boot Microservices, Apache Kafka, Gemini AI, MongoDB, MySQL, and Next.js.

SmartOps AI helps DevOps teams and developers monitor distributed systems, analyze incidents, generate intelligent insights, and visualize service health through a modern real-time dashboard.

---

# 📌 Overview

SmartOps AI is a full-stack enterprise-grade platform designed to:

* Monitor microservice health in real-time
* Collect and stream application logs
* Detect service failures and anomalies
* Generate alerts automatically
* Analyze incidents using Gemini AI
* Provide root-cause analysis and recommendations
* Visualize operational metrics through analytics dashboards

The platform follows an event-driven microservices architecture using Apache Kafka and Spring Cloud.

---

# 🧩 Tech Stack

## Backend

* Java 21
* Spring Boot 3.5
* Spring Cloud Gateway
* Eureka Service Discovery
* Spring Security
* JWT Authentication
* Apache Kafka
* MongoDB
* MySQL
* WebSocket
* Gemini AI API
* Maven

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Recharts
* Axios

## DevOps & Tools

* Docker
* Docker Compose
* Git & GitHub
* Postman
* MongoDB Compass

---

# 🏗️ System Architecture

```text
                    ┌─────────────────┐
                    │     Frontend    │
                    │   Next.js App   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   API Gateway   │
                    │ JWT Validation  │
                    └────────┬────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼

┌─────────────┐    ┌────────────────┐    ┌────────────────┐
│ Auth Service│    │ Monitoring Svc │    │ Alert Service  │
└─────────────┘    └────────────────┘    └────────────────┘
                          │
                          ▼
                    Apache Kafka
                          │
                          ▼
                  ┌───────────────┐
                  │ Insight Svc   │
                  │ Gemini AI     │
                  └───────┬───────┘
                          │
                          ▼
                    MongoDB Atlas
```

---

# 📦 Microservices

## 🔐 Auth Service

Responsible for:

* User Registration
* User Login
* JWT Token Generation
* Profile Management
* Password Updates

---

## 🌐 API Gateway

Responsible for:

* Centralized Routing
* JWT Validation
* Request Filtering
* Service Communication

---

## 📡 Monitoring Service

Responsible for:

* Service Health Monitoring
* Log Collection
* Response Time Tracking
* Kafka Log Publishing
* Real-time Metrics Collection

---

## 🚨 Alert Service

Responsible for:

* Alert Generation
* Incident Tracking
* Severity Classification
* Kafka Event Publishing

---

## 🤖 Insight Service

Responsible for:

* Consuming Alert Events
* Gemini AI Integration
* Root Cause Analysis
* Impact Assessment
* AI Recommendations
* Confidence Scoring

---

## 🔍 Eureka Service Registry

Responsible for:

* Service Discovery
* Dynamic Registration
* Load-balanced Communication

---

# ✨ Key Features

* ✅ JWT Authentication
* ✅ Profile Management
* ✅ Microservices Architecture
* ✅ Service Discovery using Eureka
* ✅ API Gateway Security
* ✅ Apache Kafka Event Streaming
* ✅ Real-time Monitoring
* ✅ Alert Management System
* ✅ Gemini AI Integration
* ✅ AI-powered Incident Analysis
* ✅ Analytics Dashboard
* ✅ Responsive UI
* ✅ Scalable Architecture

---

# 📊 Dashboard Modules

## Dashboard

* Service Overview
* System Health
* Response Time Metrics
* Availability Metrics

## Monitoring

* Service Status Tracking
* Response Time Monitoring
* Log Collection

## Analytics

* Availability Percentage
* Response Time Analytics
* Service Health Metrics
* Operational Insights

## AI Insights

* Root Cause Analysis
* Impact Assessment
* AI Recommendations
* Confidence Scoring

## Profile Management

* User Information
* Password Management
* Account Settings

---

# ⚙️ Running the Project

## Prerequisites

* Java 21
* Node.js 20+
* MongoDB
* MySQL
* Apache Kafka
* Zookeeper
* Maven

---

## Start Infrastructure

### Eureka Server

```bash
cd service-registry
mvn spring-boot:run
```

### API Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

### Auth Service

```bash
cd auth-service
mvn spring-boot:run
```

### Monitoring Service

```bash
cd monitoring-service
mvn spring-boot:run
```

### Alert Service

```bash
cd alert-service
mvn spring-boot:run
```

### Insight Service

```bash
cd insight-service
mvn spring-boot:run
```

### Frontend

```bash
cd smartops-dashboard
npm install
npm run dev
```

---

# 🔄 Workflow

1. User logs in using JWT Authentication
2. API Gateway validates tokens
3. Monitoring Service collects service health data
4. Logs are streamed through Kafka
5. Alert Service generates incidents
6. Insight Service consumes alerts
7. Gemini AI analyzes incidents
8. AI Insights are stored in MongoDB
9. Dashboard visualizes operational data

---

# 🎯 Project Highlights

* Enterprise-grade Microservices Architecture
* Event-Driven Communication using Kafka
* AI-powered Incident Analysis
* Real-time Monitoring Dashboard
* Centralized Authentication
* Scalable Cloud-ready Design

---

# 👨‍💻 Author

Vivek Kushwaha

GitHub:
https://github.com/ivivekkushwah

LinkedIn:
https://www.linkedin.com/in/ivivekkushwaha


---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
