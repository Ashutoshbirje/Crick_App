# 🏏 CrickApp – Real-Time Cricket Scoring App 🏏

## 📚 Project Domain
**Domain**: Sports Management & Live Scoring  
**Tech Stack**: MERN (MongoDB, Express.js, React.js, Node.js)

## 💡 Project Idea

CrickApp is a dynamic and interactive cricket scoring application built for real-time match tracking. It allows authenticated admins to create matches, update live scores, and manage player statistics, while users can view live updates, scorecards, and historical match data.

## ✨ Features

### 👨‍💼 Admin Side
- Secure login and admin dashboard
- Create new matches with team and player inputs
- Toss and inning management
- Ball-by-ball score entry with keyboard and UI support
- Save match data and manage intervals

### 👤 User Side
- Live score viewing
- Match summaries and stats
- Responsive and clean interface

### 🧾 Others
- Help center with screenshots and shortcuts
- Interval timer and score preview
- Save match state for future review

## 📁 Folder Overview

```
CrickApp/
├── backend/         # Node.js + Express backend
├── frontend/        # React.js frontend
├── images/          # Screenshots and UI assets
└── README.md        # Project documentation
```

## 🛠️ Getting Started

Follow the steps below to run the project locally:

### 🧬 Clone the Repository
```bash
git clone https://github.com/your-username/CrickApp.git
cd CrickApp
```

### ⚙️ Run Backend
```bash
cd backend
npm install
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### 💻 Run Frontend
```bash
cd ../frontend
npm install
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

> ⚠️ On Unix-based systems (Linux/macOS), use:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

## 🔁 Project Workflow

1. **Admin Login**: Secure entry for authorized personnel  
2. **Match Creation**: Add match details, teams, and players  
3. **Toss Screen**: Choose toss winner and decision  
4. **Form Setup**: Input players for both teams  
5. **Match Start**: Enter scores ball-by-ball using keyboard or UI  
6. **Interval**: Break between innings  
7. **Second Innings**: Score entry continues  
8. **Save Match**: Finalize match and store data  
9. **User View**: View scores live with historical data  
10. **Help Center**: Instructions and screenshots  

## 🖼️ Screenshot Preview

![CrickApp UI Preview](./images/screenshot_readme.png)

> 📁 Includes: Admin panel, forms, inning screens, help center, user views, toss, save, keyboard and interval modules

## 🔮 Future Enhancements

- Player statistics graphs  
- Export match reports to PDF  
- Authentication with OAuth or Firebase  
- Progressive Web App (PWA) version  

## 👨‍💻 Author

**Ashutosh Birje**  
📧 your.email@example.com  
🔗 [LinkedIn](https://linkedin.com/in/your-profile)  
🌐 [Portfolio](https://your-portfolio.com)
