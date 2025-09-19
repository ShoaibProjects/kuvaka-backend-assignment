# Lead Scoring Backend Service

This project is a backend service designed to qualify sales leads by scoring them based on product/offer context and prospect data. The scoring pipeline uses a combination of rule-based logic and AI reasoning.

## API Endpoints

The service exposes the following API endpoints.

### 1. Save Offer Details

`POST /api/offer`

Accepts JSON with product and offer details to be used for scoring.

**Example Request:**

```sh
curl -X POST http://localhost:3000/api/offer \
-H "Content-Type: application/json" \
-d '{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"]
}' 
```

## 2. Upload Leads CSV

**POST** `/api/leads/upload`

Accepts a CSV file containing lead information.  
The file should have the following columns:  
`name`, `role`, `company`, `industry`, `location`, `linkedin_bio`.

### Example Request (using curl)

```bash
curl -X POST http://localhost:3000/api/leads/upload \
  -H "Content-Type: multipart/form-data" \
  -F "leadsFile=@/path/to/your/leads.csv"
```
## 3. Score Leads

**POST** `/api/score`

Triggers the scoring process for all leads that have been uploaded.  
The scoring uses the previously saved offer details.

---

## 4. Get Scoring Results

**GET** `/api/results`

Returns a JSON array of the scored leads.

### Example Response

```json
[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 85,
    "reasoning": "Fits ICP SaaS mid-market and role is decision maker."
  }
]
```
## Setup & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ShoaibProjects/kuvaka-backend-assignment.git
cd kuvaka-backend-assignment
```
### 2. Install dependencies

```bash
npm install
```
### 3. Configure environment variables

Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```
### 4. Run the server

```bash
node src/server.js
```
The server will run on: [http://localhost:3000](http://localhost:3000)
## Logic and Prompting

### Rule-Based Scoring
The rule-based layer contributes a maximum of **50 points** to the final score.  
The scoring logic is as follows:

#### Role Relevance
- **20 points**: For decision-makers (`head`, `vp`, `director`, `c-level`, `ceo`, `cto`, `cfo`).
- **10 points**: For influencers (`manager`, `lead`, `senior`).

#### Industry Match
- **20 points**: If the lead's industry is an exact match for the ideal customer profile (ICP) defined in the offer.
- **10 points**: If the lead's industry is adjacent to the ICP (e.g., `fintech`, `martech`, `enterprise software`, `IT services`).

#### Data Completeness
- **10 points**: If all required fields in the lead data are present.

---

### AI-Based Scoring
The AI layer also contributes a maximum of **50 points** to the final score.  
We used the **Google Gemini API** for this.  

The AI is prompted to classify the lead's buying intent and provide a one-to-two-sentence explanation.

#### AI's Response → Points
- **High intent** → 50 points  
- **Medium intent** → 30 points  
- **Low intent** → 10 points  

The **final score** is the sum of the rule-based score and the AI score.

---

## Deployment
The service is deployed on **Vercel** and is accessible at the following URL:

**Live API Base URL:** [https://kuvaka-backend-assignment-theta.vercel.app/](https://kuvaka-backend-assignment-theta.vercel.app/)


