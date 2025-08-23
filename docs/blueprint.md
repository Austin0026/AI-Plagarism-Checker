# **App Name**: SimiText

## Core Features:

- Input Acquisition: Accept text input from users either by direct entry or document upload (PDF, Docx).
- Semantic Vectorization: Use Sentence-BERT to create sentence embeddings of the texts. Incorporate this tool only for text of sufficient length; if the submitted texts are very short, request re-submission or provide an informative message that embeddings are more valuable for long-form content.
- Similarity Analysis: Compute cosine similarity between sentence embeddings to identify and quantify plagiarism.
- Plagiarism Scoring: Provide a clear plagiarism percentage score. Flag as plagiarized content above a pre-defined threshold (e.g., 30%).
- Content Highlighting: Highlight plagiarized sections within the text documents.
- Web Presentation: Present results through a web interface.

## Style Guidelines:

- Primary color: HSL 219, 68%, 43% (equivalent to RGB hex code #2362C7). This color gives the impression of clarity, security, and trust.
- Background color: HSL 219, 17%, 93% (equivalent to RGB hex code #E2E7F0). This near-white will maintain an open feel to the display, while helping to separate the elements from the pure-white of the browser.
- Accent color: HSL 189, 51%, 46% (equivalent to RGB hex code #38A3A5). Use for key interactive elements such as buttons and highlighted text. This hue is reminiscent of clear seeing.
- Body and headline font: 'Inter', a sans-serif with a modern, neutral look, for a clean and readable text presentation.
- Use icons for document upload and result visualization.
- A clean, intuitive layout with clearly labeled sections for input texts, similarity scores, and highlighted results.