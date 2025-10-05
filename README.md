# 🌎 Chicxulub Simulator

**An interactive simulator that transforms NASA asteroid data into realistic visualizations of impact energy, crater size, and global effects — bridging science, education, and planetary defense.**

---

## 🚀 Overview

**Chicxulub** is an interactive web platform designed to model and visualize the potential consequences of asteroid impacts on Earth.  
It uses real-time data from **NASA’s Near-Earth Object (NEO) API** and the **JPL Small-Body Database (SBDB)** to automatically retrieve physical parameters such as diameter, velocity, and composition, simulating realistic impact scenarios.

The simulator integrates geospatial visualization with **Leaflet maps**, allowing users to define impact locations manually or interactively and to analyze:

- 🌋 **Crater Zone**
- ☄️ **Thermal Impact Area**
- 💥 **Blast Wave Radius**

It also identifies nearby affected cities using the **Overpass API**, combining data science, physics, and visualization for public awareness and educational purposes.

---

## 🧩 Features

- Dual data modes:
  - ✍️ **Manual Input** – users define all asteroid and location parameters.
  - 🛰️ **NASA API Mode** – users select real NEOs to auto-fill diameter, density, and velocity.
- Realistic physical modeling of:
  - Mass, energy, and impact force calculations.
  - Crater size, blast radius, and TNT energy equivalent.
- Map-based interaction using **Leaflet** and **OpenStreetMap**.
- Real-time nearby city detection via **Overpass API**.
- Built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

---

## 🧠 How It Works

1. The user inputs or selects asteroid data (diameter, density, velocity).  
2. Defines a location on the interactive map or through latitude/longitude inputs.  
3. The system performs real physics calculations based on the following:

   ```ts
   this._diameter = diameter;
   this._radius = this._diameter / 2;
   this._volume = (4 / 3) * Math.PI * Math.pow(this._radius, 3);
   this._mass = this._volume * density;
   this._velocityMs = velocity;
   this._energy = 0.5 * this._mass * Math.pow(this._velocityMs, 2);
   this._tnt = this._energy / 4.184e9;
   this._borderRadius = 100 * Math.pow(this._tnt, 1 / 3);

4. The impact is visualized on the map with three concentric circles:

- Crater Zone
- Thermal Impact Area
- Blast Wave Radius

5. The Overpass API detects and displays nearby affected cities.

## 🧰 Tech Stack

| Category | Tools / Frameworks |
|-----------|-----------|
| Frontend   | Next.js, React, TypeScript, Tailwind CSS    |
| Mapping   | Leaflet, OpenStreetMap    |
| Data APIs | NASA NEO API, NASA SBDB API, Overpass API |
| Physics | Custom energy & mass modeling algorithms |
| Deployment | Node.js Environment |

## ⚙️ Installation

1. Clone the repository
2. Install dependencies
3. Create an .env file
```
NASA_API_KEY=YOUR_NASA_API_KEY
NASA_API_BASE_URL=https://api.nasa.gov/neo/rest/v1/neo
```
4. Run the development server
```
npm run dev
```
Access at http://localhost:3000

## 🧑‍💻 Team

Developed by:
- Alan Posselt
- Guilherme Dall Acqua
- Guilherme Possebon
- Matheus Capalonga Di Domenico
- Rafael Lammel Miotti

## 🤖 Use of Artificial Intelligence (AI)

AI tools were employed ethically and transparently, following NASA Space Apps guidelines:
- **Physics Calculation Assistance** – AI was used to support and refine the implementation of physical models for energy, mass, and impact equations, ensuring realistic simulation results.
- **Ideation and Content Generation** – AI contributed to brainstorming project concepts, naming conventions, and UX copywriting (e.g., zone names, descriptive texts).
- **Logo Generation** – AI-assisted generation of the project logo.
- **Planned AI Extension (Evacuation System)** – In future versions, AI will analyze demographic and geospatial data to calculate optimized evacuation routes, distributing people across safer paths to minimize congestion and improve survival rates.

All AI-generated visual assets include visible “AI-generated” labeling where applicable.

## 🌍 Impact and Purpose

Chicxulub aims to make planetary defense understandable and interactive.  
By converting astrophysical data into visual and quantitative insights, it helps users:
- Understand how asteroid characteristics affect Earth’s surface and populations.
- Support education, awareness, and planetary protection initiatives.
- Encourage creative STEM learning through real NASA data visualization.
	
## 🧾 License

This project is open-source and available under the MIT License.  
Data sources are credited to NASA’s Open APIs and OpenStreetMap contributors.
