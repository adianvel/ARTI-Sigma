**Alur:** `Pengguna masuk ke web` → `Menampilkan Landing Page Promosi` → `Pengguna klik Tombol Aksi (CTA)` → `Menampilkan Halaman Aplikasi Utama`.

### **Prompt for AI Agent: Create a Marketing Landing Page with a Separate App Entry Point**

**Goal:** Your primary task is to create a two-page structure that separates the marketing presentation from the functional application.

**User Flow to Implement:**
1.  A new user visits the root URL (`/`) and sees the **promotional landing page**.
2.  The user clicks the main Call-to-Action button on the landing page.
3.  The user is navigated to the **main application page** at `/app`.

Follow these instructions precisely for each page.

---

#### **Part 1: The Promotional Landing Page**

**File to Modify/Create:** `/pages/index.tsx`

**Strict Instructions for this file:**
* This page is for **marketing only**. It must **NOT** contain any wallet connection logic or buttons.
* The header on this page should be minimal, displaying only the 'PetLog' title.

**Content & Design:**
* **Style:** Inspired by **Pudgy Penguins** (light, warm, friendly, soft-rounded).
* **Theme:** Use a soft, light cream background.
* **Hero Section:**
    * The main visual should be a showcase of 3-4 beautifully designed, example 'PetLog Passport' NFTs.
    * The headline (`<h1>`) should be warm and inviting: **"Welcome to the PetLog Crew."**
* **Call-to-Action (CTA):**
    * The **only** primary button on this page must be the **"Create a Paw-ssport" button.**
    * This button must be a `<Link>` component that navigates the user to the `/app` page.

---

#### **Part 2: The Main Application Page**

**File to Modify/Create:** `/pages/app.tsx`

**Strict Instructions for this file:**
* This is the **entry point to all DApp functionality.**
* This page **IS RESPONSIBLE** for handling the wallet connection.

**Content & Design:**
* **Initial State (Wallet Disconnected):**
    * When a user arrives at this page, if their wallet is not connected, it should display a prompt in the center of the screen.
    * This prompt should contain a message like "Please Connect Your Wallet to Get Started" and a prominent **"Connect Wallet" button.**
* **Connected State:**
    * Once the wallet is connected, the prompt should disappear.
    * The page should then display the main application dashboard, which is the user's "My Cat Crew" NFT gallery.
