1. Design System & UI/UX
Color Palette: The primary background must be a soft, light lavender. Text, primary accents, line illustrations, and active states must strictly use a deep, dark purple to match the MindRent brand logo perfectly.

Typography: Use a clean, modern, rounded, lowercase sans-serif font for headings and brand elements to match the logo's typography.

Aesthetic Style: The design must be unusual and attractive. Avoid rigid, boxy layouts. Implement floating, soft-edged containers, continuous-line SVG animations (mimicking the brain logo), and glassmorphism effects for a calming, serene aesthetic.

Responsiveness: All layouts must be mobile-first and fully responsive across all screen sizes.

2. Tech Stack & Architecture
Use Next.js with Tailwind CSS for the frontend.

Prefer functional programming in JavaScript/TypeScript.

Use Supabase for the backend architecture, database, and secure user authentication.

Use ESLint for linting and ensure clean, modular code components.

3. Core Features & Business Logic
Personalization Quiz: The quiz flow should have 5 to 7 questions utilizing drag-and-drop or smooth slider interactions rather than standard radio buttons to reduce user fatigue.

Data Privacy: Ensure all user inputs from the AI quiz are pseudonymized and securely encrypted.

Payments: Integrate local Pakistani payment gateways (EasyPaisa and JazzCash) for a frictionless, one-time purchase checkout flow without any recurring subscription commitments.

4. Testing & Commands
Run npm test for unit tests.

Run npm run lint before finalizing any component structure.