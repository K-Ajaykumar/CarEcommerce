# Car E-commerce Application

A modern, full-featured e-commerce application for buying cars built with Angular 17. This single-page application provides a seamless shopping experience with features like user authentication, shopping cart management, checkout process, and order tracking.



## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI 17.1.0
- .NET 9.0 SDK
- SQL Server (LocalDB or full version)

## Installation

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd car-ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/CarEcommerce.API
```

2. Restore .NET packages:
```bash
dotnet restore
```

3. Apply database migrations:
```bash
dotnet ef database update
```

4. Start the backend server:
```bash
dotnet run
```

5. The API will be available at `http://localhost:5083`


