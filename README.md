# InSight Books - Virtual Bookstore & Reader Hub

InSight Books is a premium, highly interactive Flask-based web application that serves as a modern digital bookstore, personal e-reader workspace, and collaborative virtual book club meetup. The application features a rich, responsive interface with customized typography, glassmorphism accents, smooth animations, and context-aware elements.

---

## 🚀 Key Features

### 1. Interactive Homepage
* **Book Personality Quiz**: A step-by-step interactive questionnaire matching users with genres (Fiction, Thriller, Self-Help) and providing deep links to shop recommendations.
* **RSVP Particle Bursts**: Live community meetup registration tracking. Clicking "RSVP Now" increments participant tallies and fires custom pure-CSS/JS particle-burst confetti shapes.

### 2. Shop Catalog & Cart Drawer
* **Sticky Shop Sub-Navbar**: Category navigation tab bar (Bookshop, Merch Shop, Stationery Shop, Newspaper Room) positioned right below the header.
* **Context-Aware Sidebar Filters**: Dynamic filter categories (genres, material types, frequencies, and price brackets) which regenerate automatically when switching category tabs.
* **Cart Drawer Adjusters**: A sliding sidebar cart that tracks product quantities, permitting readers to scale item counts (`+` / `-`) or delete items with real-time subtotal updates.
* **Details Preview**: Modal box loading specific item summaries, pricing, product specifications, and book excerpt previews.

### 3. Client local-time Status
* **Live Library Hours Tag**: The Contact page inspects the client's local system clock to determine if the physical reading rooms are open, displaying a live green **"Open Now"** or amber **"Closed Now"** status.

### 4. Reads & Bookclubs Dashboard
* **Dynamic Authed Tabs**: Incorporates local authentication state to dynamically show/hide the "Reads" navigation link in the global header.
* **Interactive Shelves**: Lists purchased literature with percent completion progress bars.
* **Discussion Timelines**: Feeds for posting replies and reading nested comments.
* **Milestone Analytics**: Mock reading stats that animate weekly progress charts when scrolled into view.

### 5. Secure Distraction-Free e-Reader
* **Personalized Settings**: Serif typesetting (Georgia font style) supporting text resizing (Small, Medium, Large) and custom theme dots (Light, Sepia, Dark).
* **Copy-Prevention Locks**: Custom event hooks disabling mouse right-clicks, text selections, and copying keyboard shortcuts (`Ctrl+C`, `Ctrl+X`) to protect digital copies.

### 6. Live Virtual Book Club Room
* **Video Chat Simulation**: A dark-themed workspace representing an active video call session.
* **Toggle Controls**: Controls allowing users to toggle their microphone, camera, or screen sharing. Toggles display dynamic toasts and update camera status overlays.
* **Live Chat & Collaborative Notes**: Features a scrolling text chat panel and a shared collaborative notepad list.
* **Simulated Group Activity**: Triggers periodic mock messages from other members and flashes voice activity rings around cards to simulate an ongoing conversation.

### 7. Randomized Transition Loader
* **Transitions**: When navigating between pages, a random premium loader animation (**Book Page Flip**, **Circular Tracker**, or **Quill Pulse**) is selected.
* **Visual Continuity**: Caches the selected animation in `sessionStorage` so that the loading screen matches exactly between page exit and entrance.
* **Skeleton Prevention**: Hardcoded into HTML templates to stay active until the window triggers `load`, masking resource loading and preventing layout shifts.

---

## 🛠️ Technology Stack
* **Backend Framework**: Python 3 / Flask (handles page routing and initial mock product catalogs).
* **Styling & Layouts**: Vanilla HTML5, Vanilla CSS3 (Custom variables, flexbox, grids, keyframes, transitions). No external Tailwind dependencies to ensure maximum layout precision.
* **Client Logic**: Vanilla ES6+ JavaScript (State persistence in `localStorage`, event-driven overlays, context-sensitive templates, and animations).
* **Asset Icons**: FontAwesome 6.4 (linked via CDN).

---

## 📂 Project Structure

```
COMING SOON
```

---

## ⚙️ Setup and Installation

```
COMING SOON
```
