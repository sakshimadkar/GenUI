# 🚀 GenUI - AI Component Generator

GenUI is a powerful, modern web application that leverages artificial intelligence to generate stunning, responsive UI components instantly. Simply describe what you want, and GenUI will provide the code and a live preview.

![GenUI Hero](https://raw.githubusercontent.com/sakshimadkar/GenUI/main/AI-Component-Generator/Screenshots/Hero.png)

## ✨ Features

- **🤖 AI-Powered Generation**: Create components using natural language descriptions.
- **💻 Multiple Frameworks**: Generate code for HTML + CSS, Tailwind CSS, Bootstrap, and more.
- **👁️ Live Preview**: See your generated components in real-time.
- **📝 Code Editor**: Integrated Monaco Editor (VS Code engine) for viewing and editing code.
- **📚 History**: Keep track of all your generated components.
- **⭐ Favorites**: Save your best designs for quick access.
- **🌍 Community Hub**: Share your components with others and explore community creations.
- **🍴 Forking**: Take existing components and modify them to your needs.
- **🌓 Dark Mode**: Sleek, eye-friendly design for both day and night.
- **📱 Fully Responsive**: Optimized for all devices.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios (API Communication)
- Monaco Editor (Code Editing)
- React Router DOM (Navigation)
- React Toastify (Notifications)
- React Spinners (Loading states)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- JWT (Authentication)
- Groq Cloud SDK (Llama 3.3 Model)
- Cookie Parser

## 📸 Screenshots

| Hero Page | Features |
| :---: | :---: |
| ![Hero](https://raw.githubusercontent.com/sakshimadkar/GenUI/main/AI-Component-Generator/Screenshots/Hero.png) | ![Features](https://raw.githubusercontent.com/sakshimadkar/GenUI/main/AI-Component-Generator/Screenshots/Features.png) |

| Generation Page | History |
| :---: | :---: |
| ![Generate](https://raw.githubusercontent.com/sakshimadkar/GenUI/main/AI-Component-Generator/Screenshots/Generate.png) | ![History](https://raw.githubusercontent.com/sakshimadkar/GenUI/main/AI-Component-Generator/Screenshots/History.png) |

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/sakshimadkar/GenUI.git
cd GenUI
```

### 2. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```
Run the server:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd ../AI-Component-Generator
npm install
```
Create a `.env` file in the `AI-Component-Generator` directory and add:
```env
VITE_API_URL=http://localhost:5000
```
Run the client:
```bash
npm run dev
```

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contact

Sakshi Madkar - [GitHub](https://github.com/sakshimadkar)

Project Link: [https://github.com/sakshimadkar/GenUI](https://github.com/sakshimadkar/GenUI)
