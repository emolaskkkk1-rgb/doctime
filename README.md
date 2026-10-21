# DocTime 🩺

**A responsive web platform that helps patients in Georgia find a doctor and book a visit online, with free time slots and prices visible upfront.**

🔗 **Live demo:** [https://your-project.vercel.app](https://your-project.vercel.app) <!-- replace with your Vercel URL -->

---

## Problem

Patients in Georgia struggle to see doctors' **free appointment times** and **prices** before booking, and they find it hard to **trust** the information they see online. DocTime brings these three things into one simple, mobile-friendly place.

## Research Summary

The project follows a **Design Thinking** process. User research included:

- 3 online interviews
- A Google Forms survey with 13 respondents

**Key findings:**

| Finding | Result |
|---|---|
| Mainly use a phone | 11 / 13 |
| Cannot see free slots before booking | 8 / 13 |
| Cannot see prices upfront | 8 / 13 |
| Trust real patient reviews | 11 / 13 |
| Most wanted features: filters and reviews | 10 / 13 each |

These results led to a **mobile-first** design that focuses on availability, transparent pricing, and verified reviews.

## Features

- 🔍 **Doctor search** with suggestions
- 🎛️ **Filters:** specialty, price, district, insurance, rating, video consultation
- ↕️ **Sorting** of results
- ⚖️ **Doctor comparison**
- 👤 **Doctor profile** with patient reviews
- 📅 **Availability calendar** with free slots
- ✅ **3-step booking** without registration
- 📱 **SMS reminder** note
- 🌐 **Language switcher:** Georgian (default) / English
- 🔒 **Data protection** page

## Tech Stack

| Area | Tools |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Build tool | Vite |
| Built with | Bolt.new, Claude |
| Images | Adobe Firefly, Gemini |
| Deployment | Vercel |
| Version control | GitHub |

## AI Tools and Workflow

This project was created for the course **"Vibe coding and AI agentic engineering"**.

- **Claude:** PRD, website copy, and research synthesis; also used during development
- **Bolt.new:** fast prototype and initial app generation
- **Adobe Firefly / Gemini:** image generation
- **Deevid AI:** video generation
- **ChatGPT:** writing and refining prompts for image/video tools

**Workflow:** research → synthesis → PRD → prototype → iteration → deployment.

## Screenshots

<!-- Add your screenshots to a /screenshots folder and update the paths below -->

| Home / Search | Doctor Profile |
|---|---|
| ![Home](screenshots/home.png) | ![Profile](screenshots/profile.png) |

| Booking | Mobile View |
|---|---|
| ![Booking](screenshots/booking.png) | ![Mobile](screenshots/mobile.png) |

## How to Run Locally

**Requirements:** [Node.js](https://nodejs.org/) (v18 or newer) and npm.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/doctime.git
cd doctime

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the local address shown in the terminal (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
```

## Future Plans

- Real backend and database for doctors, slots, and bookings
- Real SMS reminders and booking confirmations
- Doctor dashboard for managing schedules and prices
- Verified patient reviews tied to completed visits
- Online payment and video consultation integration
- Accessibility improvements and further usability testing

## Author

**Your Name**
Student, Business and Technology University (BTU), Georgia
Course: *Vibe coding and AI agentic engineering*

📧 your.email@example.com · 🔗 [LinkedIn](https://linkedin.com/in/your-profile) · 💻 [GitHub](https://github.com/your-username)

---

*DocTime is a university project and does not provide real medical services. All doctor data is fictional.*
