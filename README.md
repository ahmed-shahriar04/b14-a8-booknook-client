# 📚 BookNook – Modern Cozy Online Community Library

> **Live Application**: [https://booknooktoday.vercel.app](https://booknooktoday.vercel.app)  
> **Client Repository**: [https://github.com/ahmed-shahriar04/b14-a8-booknook-client](https://github.com/ahmed-shahriar04/b14-a8-booknook-client)  
> **Server Repository**: [https://github.com/ahmed-shahriar04/b14-a8-booknook-server](https://github.com/ahmed-shahriar04/b14-a8-booknook-server)  
> **Author**: [Shahriar Ahmed Riaz](https://shahriarahmedriaz.netlify.app/)

---

## 🌟 Key Features

- **Cozy Beige Aesthetic & Pure JavaScript**: Designed strictly to match an editorial tablet/desktop layout with `#F4EFEA` background, warm cream cards, and pure JavaScript Next.js App Router (100% TS-free).
- **Dual Language Support (বাংলা & English)**: Complete instantaneous bilingual switching across Navbar, Banner, Recommendation cards, User Dashboard, Filter panels, and Footer.
- **Light & Dark Theme**: Cohesive dark mode with obsidian slate `#121615` and pine card `#1A211E` palette, with inverted calendar indicators and custom inputs.
- **Interactive Swiper Banner & Dynamic New Arrivals**: Swiper slider with curated author wisdom and translucent author silhouette masks, plus auto-updating "New Arrivals" queried from MongoDB Atlas.
- **Full Authentication with BetterAuth & Google OAuth**: Seamless email/password authentication with uppercase/lowercase/length validation, Google social login, and MongoDB adapter storage.
- **Real-Time Copy Tracking (`$inc`) & Double Borrow Prevention**: Automatic decrement (`-1`) on borrow and increment (`+1`) on return. Strictly prevents users from borrowing the same title twice concurrently.
- **Secured API Routes via JWT**: Every write, update, delete, and borrow transaction is cryptographically secured via JSON Web Tokens.
- **Compact Book Cards & In-Modal Borrowing**: Space-efficient compact card grid with detailed modal overlay for immediate borrowing without navigation friction.
- **Custom Modals, Toasts & Zero Lorem Ipsum**: Custom delete and borrow confirmation modals, animated feedback via `react-hot-toast`, and meaningful curated copy.
- **Smooth Scroll Animations (AOS)**: Fluid scroll-triggered animations powered by AOS (`fade-down`, `fade-up`, `zoom-in`, staggered delays) across Header, Banners, Book Grids, and Step Guides.
- **FontAwesome Iconography & Google Fonts**: Featuring FontAwesome icons and Bengali typography (`Hind Siliguri`, `Anek Bangla`, `Outfit`, `Playfair Display`).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router, Pure JavaScript `.jsx`), Tailwind CSS, Swiper.js, FontAwesome Icons, Google Fonts.
- **Authentication**: BetterAuth, BetterAuth MongoDB Adapter, JWT.
- **Backend**: Node.js, Express.js (Pure JavaScript ES Modules), MongoDB Native Driver.
- **Image Hosting**: ImgBB API / Postimages.

---

## 🚀 Getting Started

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

