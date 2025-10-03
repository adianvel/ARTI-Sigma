**Task:** The current font sizes in the PetLog application are too small. Your task is to implement a new, larger, and more consistent typographic scale to improve readability and user experience. All changes must be implemented using **Tailwind CSS best practices**.

**Phase 1: Configure the Typographic Scale in `tailwind.config.js`**

First, define the new font size palette so we can use it consistently throughout the app.

1.  Open the `tailwind.config.js` file.

2.  Inside the `theme.extend` object, add or modify the `fontSize` key with the following scale. This scale establishes a comfortable base size (`16px`) for body text and provides larger, distinct sizes for headings.

    ```javascript
    // tailwind.config.js
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
      'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px (Our new comfortable body size)
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    },
    ```

**Phase 2: Apply the New Scale Across the Application**

Now, audit all components and pages and apply the new semantic text classes. Remove any hardcoded font sizes.

1.  **Global Body Text:** In your global CSS file (`globals.css`), ensure the `body` has a base text size and a comfortable text color from our theme.

    ```css
    body {
      @apply text-base text-text-body;
    }
    ```

2.  **Homepage (`/pages/index.tsx`):**

      * The main headline (`<h1>`) should be very large and impactful. Apply `text-4xl` or `text-5xl`.
      * The subheading paragraph (`<p>`) under the headline should use `text-lg`.

3.  **Minting Page (`/pages/mint.tsx`):**

      * The main title of the page ("Create New Paw-ssport") should be `text-3xl`.
      * Labels (`<Label>`) for form inputs should be `text-sm`.
      * The text *inside* the form inputs (`<Input>`) should be `text-base` for easy reading while typing.
      * Text on the `<Tabs>` triggers should be `text-base`.

4.  **Gallery Page (`/pages/my-passports.tsx`):**

      * The page title ("My Cat Crew") should be `text-3xl` or `text-4xl`.
      * The name of the cat on each `PassportCard` component should be `text-xl`.
      * The text in the "Empty State" message should be `text-lg`.

5.  **Reusable Components (Buttons, Header):**

      * The text inside standard `<Button>` components should be `text-base`.
      * The main "PetLog" title in the `<Header>` should be `text-xl`.