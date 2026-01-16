<div align="center">

# 🚀 AI Resume Optimizer

<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">

**AI-powered assistant that transforms your work experience into professional highlights**

English | [正體中文](./README_zh-TW.md)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Optimization** - Integrates Google Gemini 2.5 Pro for intelligent resume rewriting
- 🌐 **Bilingual Output** - Single input generates both professional Chinese and English versions
- 📸 **Image Recognition** - Upload resume screenshots, AI automatically extracts and optimizes content
- 💡 **Interactive Suggestions** - Provides selectable improvement suggestions including summary additions and bullet point rephrasing
- 📋 **One-Click Copy** - Quickly copy optimized content to clipboard
- 🎨 **Modern Interface** - Dark-themed responsive design built with TailwindCSS

---

## 🖼️ Feature Overview

### Main Capabilities

| Feature | Description |
|---------|-------------|
| **Text Input** | Paste your work experience description directly |
| **Image Upload** | Supports PNG and JPG format resume screenshots |
| **Role/Field Setting** | Specify your target position for more precise optimization |
| **Interactive Suggestions** | Apply AI-provided improvement suggestions through checkbox selection |

---

## 🛠️ Project Architecture

```
ResumeMaster/
├── App.tsx                 # Main application component
├── index.html             # HTML entry point
├── index.tsx              # React application entry
├── components/
│   ├── InputSection.tsx   # Input section component (text/image/role)
│   └── OutputSection.tsx  # Output section component (bilingual results/suggestions)
├── services/
│   └── geminiService.ts   # Google Gemini API service layer
├── package.json           # Project configuration and dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build tool configuration
```

### Core Technologies

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite 6.2
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS
- **AI Service**: Google Gemini 2.5 Pro (@google/genai)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Google Gemini API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ResumeMaster.git
   cd ResumeMaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Visit `http://localhost:5173` to use the application

---

## 📖 Usage Guide

### Basic Workflow

1. **Input Content**
   - Paste your work experience description in the left input section
   - Or click the upload area to select a resume screenshot

2. **Set Role (Optional)**
   - Enter your target position or field, e.g., "Senior Frontend Engineer", "Product Manager"

3. **Start Optimization**
   - Click the "Optimize Resume" button

4. **Review Results**
   - The right section will display optimized Chinese and English versions
   - Check the "Interactive Improvement Suggestions" below

5. **Apply Suggestions**
   - Check the suggestions you want to apply, content updates in real-time
   - Applied content will be highlighted

6. **Copy Content**
   - Click the "Copy" button to copy optimized results to clipboard

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 AI Optimization Principles

Resume Optimizer follows these professional principles:

- **Quantify Achievements**: Convert accomplishments into specific metrics (e.g., "improved performance by 30%")
- **Use Power Verbs**: Start bullets with verbs like "Architected", "Spearheaded", "Engineered"
- **Focus on Impact**: Emphasize architecture design, performance optimization, team leadership, and business value
- **Professional Format**: Use bullet points, maintain concise and powerful statements

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) - Providing powerful AI model support
- [React](https://react.dev/) - Modern frontend framework
- [Vite](https://vitejs.dev/) - Fast build tool
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

---

<div align="center">

**⭐ If this project helps you, please consider giving it a star!**

</div>
