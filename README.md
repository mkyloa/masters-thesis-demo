# Master's Thesis Demo: Automated Vulnerability Detection and Validation

This repository contains a practical demonstration for a Master's Thesis focused on enhancing software security in JavaScript applications.

## 🚀 Live Demo
The project is deployed and accessible at:
**[https://mkyloa.github.io/masters-thesis-demo/](https://mkyloa.github.io/masters-thesis-demo/)**

## 📖 Project Overview
The core objective of this research is to address "Alert Fatigue" in modern software development by implementing **Reachability Analysis**. Instead of traditional Static Composition Analysis (SCA) that only flags vulnerable library versions, this method validates if the vulnerable code is actually reachable and executable within the application's context.

### Key Features:
- **Methodology Visualization**: A step-by-step breakdown of how the system parses code into Abstract Syntax Trees (AST), builds call graphs, and performs vulnerability intersection.
- **Interactive Build Simulator**: A real-world scenario simulator where you can test different code patterns (Safe vs. Vulnerable) and see how the analysis engine makes decisions in a CI/CD pipeline.
- **Comparative Analysis**: Live charts and tables comparing the proposed reachability-based approach against standard market solutions, highlighting the reduction in false positives.

## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla JavaScript, CSS3 (Tailwind CSS)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/)
- **Deployment**: GitHub Actions & GitHub Pages

## 📂 Project Structure
- `index.html`: Main application interface and structure.
- `index.css`: Custom styles and Tailwind configurations.
- `index.js`: Application logic, simulation engine, and chart rendering.
- `.github/workflows/static.yml`: Automated deployment pipeline.

## 📝 License
This project is part of a Master's Thesis academic research. All rights reserved © 2026.
