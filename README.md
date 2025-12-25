# 🛡️ Crisis Fact-Checker Bot (PS 20269)
**Real-time Disaster Verification & Response Platform**

Built with the power of **Google Vertex AI Search** and **Firebase**, this platform bridges the gap between chaotic social media reports and official rescue efforts. During disasters, fake news spreads faster than help; this tool ensures rescue teams act on verified data.

---

## 🚀 Key Features

* **AI-Powered Fact-Checking:** Integrates with **Vertex AI Search** to cross-reference user reports against a curated data store of official news and government bulletins.
* **Real-time Synchronization:** Uses **Firebase Firestore** to ensure rescue teams see "Verified" pins instantly without refreshing.
* **Trust Score & AI Insights:** Every post is assigned a confidence score and a summary explaining why the AI flagged it as a "Verified Emergency" or a "Potential Scam."
* **Official Command Center:** A dedicated dashboard for rescue teams with high-priority filtering and a heatmap of ongoing crises.

---

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JS (ES6+) | Professional News Portal Interface |
| **Search Engine** | **Vertex AI Search** | RAG-based verification against official sources |
| **Database** | **Firebase Firestore** | Real-time distress call storage |
| **Auth** | **Firebase Auth** | Secure portal for Rescue Teams & Volunteers |
| **Styling** | Modern CSS Grid/Flexbox | Formal, high-contrast "Official" aesthetic |

---

## 📂 Project Structure

```text
├── index.html          # Landing page & Latest Verified Alerts ticker
├── community.html      # Public board for distress call submission
├── dashboard.html      # Command center for rescue responders
├── login.html          # Secure authentication portal
├── css/
│   └── styles.css      # Professional Blue/White theme system
├── js/
│   └── app.js          # Logic for Vertex AI simulation & Firebase sync
└── data/
    ├── firebase-config.json # Template for environment variables
    └── data-store.json      # Sample schema for Vertex AI data sources
