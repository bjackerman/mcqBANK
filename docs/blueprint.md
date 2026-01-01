# **App Name**: TestGenius

## Core Features:

- Document Ingestion and Parsing: Upload .docx documents, parse questions and options, detect answer key existence, and store data in Firestore.
- AI-Powered Enrichment: Use Gemini Flash via Firebase Genkit to categorize questions, verify provided answers, and predict missing answers.
- Holding Pen Dashboard: Review questions with missing answers, display AI predictions, and manually correct answers before graduating questions to 'ready' status.
- Custom Test Generation: Select test categories, number of questions, and difficulty to generate a random test from the database.
- Online Test Taking: A clean, paginated interface for taking generated tests online.
- Test Export to PDF: Generate a formatted PDF of the test (questions only) and a separate answer key using jspdf and jspdf-autotable.
- Answer Verification Tool: When a new question is added to the database, verify the correctness of a provided answer with an LLM 'tool'. The 'tool' will determine whether or not to update the status to flagged_for_review based on its reasoning.

## Style Guidelines:

- Primary color: Dark gray (#333333) for a professional and serious tone.
- Background color: Light gray (#f0f0f0) to provide a clean and neutral backdrop.
- Accent color: Bright orange (#FFA500) to draw attention to important elements and actions.
- Body font: 'Roboto', a sans-serif font providing good readability for body text.
- Headline font: 'Montserrat', a bold sans-serif font for clear and impactful headlines.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use Lucide React icons for a consistent and clean visual style.
- Employ a modular design with React components and Tailwind CSS for a responsive and maintainable layout.
- Use subtle animations and transitions to enhance the user experience when generating tests and navigating the application.