# Paidhu Full-Stack Docker & AWS Deployment Guide

This guide explains how to build, run locally with Docker, and deploy the Paidhu application (`server`, `frontend`, and `admin`) to **AWS** using Docker containers.

---

## Architecture Overview

```
                          ┌───────────────────────────┐
                          │   AWS ALB / Reverse Proxy │
                          │     (Port 80 / 443 SSL)   │
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼───────────────────────────┐
           │ (Path: / or domain)        │ (Path: /admin or domain)  │ (Path: /api)
           ▼                            ▼                           ▼
┌──────────────────────┐     ┌──────────────────────┐    ┌──────────────────────┐
│   paidhu-frontend    │     │     paidhu-admin     │    │    paidhu-server     │
│   (React + Nginx)    │     │   (React + Nginx)    │    │ (Node.js + Express)  │
│       Port 80        │     │       Port 80        │    │      Port 5000       │
└──────────────────────┘     └──────────────────────┘    └──────────┬───────────┘
                                                                    │
                                                         ┌──────────┴───────────┐
                                                         │ PostgreSQL / Supabase│
                                                         └──────────────────────┘
```

---

## Part 1: Local Docker Setup & Testing

### 1. Configure Environment Variables
Copy `.env.docker.example` to `.env`:
```bash
cp .env.docker.example .env
```
Ensure `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, and `RAZORPAY_KEY_ID` are populated with your credentials.

### 2. Build & Start All Services
```bash
docker compose up --build -d
```

### 3. Verify Container Status
```bash
docker compose ps
```

- **Customer Storefront**: `http://localhost:80` (or `http://localhost`)
- **Admin Dashboard**: `http://localhost:8080`
- **Backend API**: `http://localhost:5000` (Health check: `http://localhost:5000/api/ping`)

### 4. Stop Services
```bash
docker compose down
```

---

## Part 2: Deploying to AWS

You have two primary production-ready methods for deploying to AWS:

---

### Method A: AWS EC2 (Easiest, Cost-Effective & Full Control)

#### Step 1: Launch an EC2 Instance
1. Go to **AWS Console > EC2 > Launch Instance**.
2. **OS**: Ubuntu 24.04 LTS or Amazon Linux 2023 (t3.small or t3.medium recommended).
3. **Security Group Inbound Rules**:
   - `HTTP (Port 80)` -> `0.0.0.0/0`
   - `HTTPS (Port 443)` -> `0.0.0.0/0`
   - `SSH (Port 22)` -> `Your IP`
   - `Custom TCP (Port 8080)` (Optional for Admin) -> `0.0.0.0/0` or restricted IP

#### Step 2: Install Docker & Docker Compose on the Server
SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```
Install Docker:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```
*(Log out and log back in to apply docker group permissions)*

#### Step 3: Clone Code & Configure `.env`
```bash
git clone https://github.com/ramapriya22793/Paidhu-Final.git
cd Paidhu-Final

# Create your production .env file
nano .env
```
Paste your production credentials into `.env`.

#### Step 4: Run Containers
```bash
docker compose up --build -d
```

#### Step 5: (Recommended) Setup Free SSL via Certbot & Nginx Reverse Proxy
To serve the frontend on `https://paidhuethicalfoods.com` and admin on `https://admin.paidhuethicalfoods.com`:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```
Point Nginx proxy to `localhost:80` for customer web and `localhost:8080` for admin, then issue certificates with:
```bash
sudo certbot --nginx -d paidhuethicalfoods.com -d www.paidhuethicalfoods.com -d admin.paidhuethicalfoods.com
```

---

### Method B: AWS ECR + AWS ECS / Fargate (Serverless & Auto-scaling)

#### Step 1: Create Repositories in AWS ECR (Elastic Container Registry)
```bash
aws ecr create-repository --repository-name paidhu-server --region ap-south-1
aws ecr create-repository --repository-name paidhu-frontend --region ap-south-1
aws ecr create-repository --repository-name paidhu-admin --region ap-south-1
```

#### Step 2: Login to AWS ECR
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
```

#### Step 3: Build & Push Images to ECR
```bash
ECR_URI="<AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com"

# 1. Backend Server
docker build -t paidhu-server ./server
docker tag paidhu-server:latest $ECR_URI/paidhu-server:latest
docker push $ECR_URI/paidhu-server:latest

# 2. Customer Frontend
docker build --build-arg VITE_API_URL="https://api.paidhuethicalfoods.com" -t paidhu-frontend ./frontend
docker tag paidhu-frontend:latest $ECR_URI/paidhu-frontend:latest
docker push $ECR_URI/paidhu-frontend:latest

# 3. Admin Dashboard
docker build --build-arg VITE_API_URL="https://api.paidhuethicalfoods.com" -t paidhu-admin ./admin
docker tag paidhu-admin:latest $ECR_URI/paidhu-admin:latest
docker push $ECR_URI/paidhu-admin:latest
```

#### Step 4: Create ECS Task Definitions & Services
1. Go to **AWS ECS > Task Definitions > Create New Task Definition (Fargate)**.
2. Add your container images from ECR.
3. Configure environment variables and secrets via AWS Secrets Manager or Parameter Store.
4. Attach an **Application Load Balancer (ALB)** with HTTPS certificate from AWS ACM.

---

## Quick Reference Commands

| Action | Command |
|---|---|
| **Build & Run** | `docker compose up --build -d` |
| **Check Logs** | `docker compose logs -f` |
| **Check Backend Logs** | `docker compose logs -f server` |
| **Restart Backend** | `docker compose restart server` |
| **Rebuild Single Service** | `docker compose up -d --build server` |
| **Prune Unused Images** | `docker system prune -af` |
| **Check Container Resources** | `docker stats` |
