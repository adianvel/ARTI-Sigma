Testing instructions

1. Install dev dependencies:

```bash
npm install
```

2. Run tests:

```bash
npx jest --passWithNoTests
```

Notes:
- This project uses Jest with ts-jest and React Testing Library.
- If you deploy CI, ensure NODE_ENV is set and install devDependencies.
