
**Objective:** Your task is to perform a global update of the ARTI Sigma project's UI. The goal is to replace the current accent color (e.g., gold, cyan) with the **official brand blue** from the new logo and pitch deck, while maintaining the existing premium dark theme.

**Design Direction:** The final aesthetic should be professional, tech-focused, and cohesive, using a dark background with a vibrant blue as the primary highlight.

-----

#### **Phase 1: Update the Global Theme Configuration**

**Action:** The first and most important step is to update the single source of truth for your application's colors.

1.  **Modify `tailwind.config.js`:**

      * Open the `tailwind.config.js` file.

      * Locate the `colors` object within `theme.extend`.

      * **Replace the old accent color** (e.g., `accent-gold` or `primary` with a cyan value) with the new brand blue. Define it clearly.

      * Ensure the rest of the dark theme palette remains consistent.

      * **Example of the new `colors` object:**

        ```javascript
        // tailwind.config.js
        colors: {
          'background': '#0A0F19', // Or your existing very dark background
          'primary-blue': '#3B82F6', // A vibrant, professional blue that matches the logo
          'text-primary': '#F3F4F6', // Soft white for main text/headings
          'text-secondary': '#9CA3AF', // Lighter gray for descriptions
          'border-neutral': '#374151', // Subtle gray for borders and dividers
        },
        ```

2.  **Update `globals.css` (if applicable):**

      * If you are using ShadCN UI, update the CSS variables in the `:root` selector of your global CSS file to use the new color definitions, especially for `--primary`.

-----

#### **Phase 2: Apply the New Blue Color Across All Components**

**Action:** Perform a comprehensive audit of all UI components to ensure they now use the new `primary-blue` for all interactive and highlighted elements.

1.  **Buttons:**

      * All primary action buttons (e.g., "Tokenize Artwork", "Connect Wallet") must now use the new `primary-blue` for their background or border.
      * Update their `:hover` and `:active` states to be slightly lighter or darker shades of this blue.

2.  **Links & Active States:**

      * Standard text links and the active state in navigation menus should now use the `primary-blue` text color.

3.  **Glow & Shadow Effects:**

      * Find all instances of `box-shadow` or `drop-shadow` that create a "glow" effect.
      * Change the color of these glows from the old accent color to the new `primary-blue`. This is crucial for maintaining the futuristic aesthetic.

4.  **Icons & Decorative Elements:**

      * Any icons or thin decorative lines that previously used an accent color must be updated to the new `primary-blue`.

5.  **Focus Rings:**

      * Ensure that the focus outline on interactive elements (like form inputs and buttons) uses the new `primary-blue` to provide accessible and on-brand feedback.

**Final Result:** The entire application should feel unified under the new brand identity. The dark theme remains, but all key interactions and highlights are now driven by the professional and trustworthy blue from the official ARTI Sigma logo.