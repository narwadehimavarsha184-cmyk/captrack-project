# CapTrack

CapTrack is a modern, enterprise-grade personal finance tracking application. It allows you to effortlessly monitor your income, expenses, and cash flow over time with a sleek and responsive user interface.

## Features

- **Secure Authentication**: Robust JWT-based login and signup system to keep your financial data private.
- **Enterprise Dashboard**: A high-density, professional UI that provides a clear overview of your total income, expenses, and net profit.
- **Interactive Cash Flow Chart**: Built with Recharts, easily visualize your financial trends over time.
- **Smart Transaction Management**: Easily add income and expenses categorized by type.
- **Data Export**: Export your transaction history securely to a CSV file. Filter exports by specific date ranges (e.g., last 7 days, last 30 days, or custom dates).
- **Dark Mode**: Fully supported, sleek Dark Mode aesthetic that automatically detects your system preferences and saves your manual overrides.

## Technology Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** (Configured with custom enterprise `slate` and `blue` styling)
- **Recharts** (For dynamic chart visualization)
- **Lucide React** (For beautiful, lightweight icons)

### Backend
- **Java Spring Boot 3**
- **Spring Security** (JWT authentication filter)
- **PostgreSQL** (via JDBC/JPA)
- **Maven**

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven
- PostgreSQL running locally or in a container

### Running the Backend

1. Navigate to the `backend` directory.
2. Ensure you have your PostgreSQL database configured in `src/main/resources/application.properties`.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Running the Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## UI/UX Design
The application has recently undergone a major CSS overhaul, moving away from overly soft "vibe-coded" aesthetics to a structured, highly professional SaaS design. It features sharp 1px borders, crisp `rounded-md` corners, and optimized data density for maximum usability.

---
*Track your capital. Secure your future.*
