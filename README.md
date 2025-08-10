# Dynamic Form Builder (React + TypeScript + MUI)

Features:
- Create dynamic forms (add, reorder, delete fields)
- Configure validations and derived fields
- Preview forms with validations and live derived-field updates
- Save form schema to localStorage
- View saved forms

How to run:
1. Install dependencies: `npm install`
2. Start dev server: `npm run start`

Notes:
- This repo stores only form schemas in localStorage; user input is not persisted.
- Derived expressions are evaluated as JavaScript using `fields` object (e.g. `fields['dob'] ? Math.floor((Date.now()-new Date(fields['dob']).getTime())/31557600000) : ''` to compute age).
- Use responsibly: derived expressions run as JS; do not paste untrusted code.

