# Smart Expense Splitter

A modern, elegant expense splitting application with beautiful UI transitions and animations.

## 🚀 Quick Start

### Prerequisites
- Java 17+ 
- Node.js 16+
- PostgreSQL database running on localhost:5432
- Database named `smart_splitter`

### 🎯 Single Command to Run Both Frontend & Backend

Choose one of these methods:

#### Method 1: Using NPM Script (Recommended)
```bash
cd frontend
npm run start:both
```

#### Method 2: Using Batch File (Windows)
```bash
# Double-click or run:
start-app.bat
```

#### Method 3: Using PowerShell Script
```powershell
.\start-app.ps1
```

### 🔗 Application URLs

- **Frontend (React):** http://localhost:5173
- **Backend (Spring Boot):** http://localhost:8080
- **API Base URL:** http://localhost:8080/api

## ✨ Features

### 🎨 Beautiful UI with Excellent Animations
- **Framer Motion** transitions between pages
- **Tailwind CSS v3** with custom animations
- **Responsive design** with elegant hover effects
- **Custom color schemes** and gradients
- **Smooth micro-interactions** throughout the app

### 🔐 Authentication System
- JWT-based authentication
- Secure login/register with validation
- Protected routes
- Automatic token management

### 📊 Dashboard
- Animated statistics cards
- Quick action buttons
- Recent activity feed
- Mobile-responsive layout

### 👥 Group Management
- Create and manage expense groups
- **Gmail-style email invitations** - Add members by typing email addresses
- Email validation and user lookup
- Animated group cards with hover effects
- Professional member management interface

### 💰 Expense Tracking
- Add expenses with category selection
- Split expenses among group members
- Filter expenses (All/Paid by Me/I Owe)
- Beautiful expense cards with animations

### 🧮 Settlement Calculations
- Automatic debt calculation
- Individual and group settlement views
- Color-coded debt/credit indicators
- Mark settlements as complete

## 🛠️ Manual Setup (Alternative)

If you prefer to run services separately:

### Backend (Spring Boot)
```bash
# In root directory
.\mvnw.cmd spring-boot:run
```

### Frontend (React + Vite)
```bash
# In frontend directory
cd frontend
npm run dev
```

## 🎯 Technology Stack

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development
- **Tailwind CSS v3** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Heroicons** for icons

### Backend
- **Spring Boot 3.5.4**
- **Spring Security** with JWT
- **PostgreSQL** database
- **JPA/Hibernate** for ORM
- **Maven** for dependency management

## 🎨 UI Highlights

- **Gradient backgrounds** for auth pages
- **Glass morphism effects** on cards
- **Custom animations** (fade-in, slide-up, scale-in, bounce-in)
- **Interactive buttons** with scale and color transitions
- **Smooth page transitions** with Framer Motion
- **Mobile-first responsive design**
- **Custom scrollbars** for better aesthetics

## 📱 Responsive Design

The application is fully responsive and works beautifully on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Commercial use** - You can use this project for commercial purposes
- ✅ **Modification** - You can modify the code
- ✅ **Distribution** - You can distribute the code
- ✅ **Private use** - You can use this project privately
- ✅ **Patent use** - This license provides an express grant of patent rights from contributors

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Spring Boot](https://spring.io/projects/spring-boot)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**Enjoy splitting expenses with style!** ✨

**© 2025 Manohar Abburi. Licensed under MIT License.**
