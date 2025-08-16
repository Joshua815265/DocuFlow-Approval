# 🛠️ Installation Guide - Smart Expense Splitter

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Java 17 or higher** - [Download Java](https://adoptium.net/)
- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 12 or higher** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## 🚀 Quick Start (Recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-expense-splitter.git
cd smart-expense-splitter
```

### 2. Database Setup
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE smart_splitter;
```

### 3. One-Command Start
Choose one of these methods:

#### Option A: NPM Script (Recommended)
```bash
cd frontend
npm install
npm run start:both
```

#### Option B: Windows Batch File
```bash
# Double-click or run:
start-app.bat
```

#### Option C: PowerShell Script
```powershell
.\start-app.ps1
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

## 🔧 Manual Installation

If you prefer to set up each component separately:

### Backend Setup

1. **Navigate to project root**
```bash
cd smart-expense-splitter
```

2. **Configure Database**
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_splitter
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Install Dependencies & Run**
```bash
# Windows
.\mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

## 🗄️ Database Configuration

### PostgreSQL Setup

1. **Install PostgreSQL**
   - Download and install from [postgresql.org](https://www.postgresql.org/download/)
   - Remember your username and password

2. **Create Database**
```sql
-- Connect to PostgreSQL (using psql or pgAdmin)
CREATE DATABASE smart_splitter;

-- Optional: Create dedicated user
CREATE USER expense_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smart_splitter TO expense_user;
```

3. **Update Configuration**
Edit `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_splitter
spring.datasource.username=expense_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## 🔐 Environment Variables

### Backend Environment Variables
Create `.env` file in project root (optional):
```env
DB_URL=jdbc:postgresql://localhost:5432/smart_splitter
DB_USERNAME=expense_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

### Frontend Environment Variables
Create `frontend/.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🧪 Testing the Installation

### 1. Check Backend
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"UP"}
```

### 2. Check Frontend
- Open http://localhost:5173
- You should see the login page

### 3. Test Login
Use pre-configured users:
- Email: `99220040214@klu.ac.in`
- Password: `password123`

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 8080 (Backend)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (Frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### Database Connection Issues
1. Verify PostgreSQL is running
2. Check database name and credentials
3. Ensure database exists
4. Check firewall settings

#### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### Java Issues
1. Verify Java version: `java -version`
2. Check JAVA_HOME environment variable
3. Ensure Maven wrapper has execute permissions

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure database is running and accessible
4. Check firewall and antivirus settings

## 🚀 Production Deployment

### Docker Deployment (Coming Soon)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Production Setup
1. Build frontend: `npm run build`
2. Package backend: `./mvnw clean package`
3. Deploy JAR file to server
4. Configure production database
5. Set up reverse proxy (nginx)

---

**Need help? Check our [troubleshooting guide](TROUBLESHOOTING.md) or open an issue!**
