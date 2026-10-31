# 📚 BookNook – Modern Cozy Online Community Library

> Live Site URL: [https://booknook-library.vercel.app](https://booknook-library.vercel.app)  
> Client Repository: [https://github.com/your-username/booknook-client](https://github.com/your-username/booknook-client)  
> Server Repository: [https://github.com/your-username/booknook-server](https://github.com/your-username/booknook-server)

---

## 🌟 Key Features

- **Cozy Beige Aesthetic & Pure JavaScript**: Designed strictly to match an editorial tablet/desktop layout with `#F4EFEA` background, warm cream cards, and pure JavaScript Next.js App Router (100% TS-free).
- **Interactive Swiper Banner & Dynamic New Arrivals**: Featured Swiper slider with custom responsive slides, plus auto-updating "New Arrivals" queried from MongoDB Atlas.
- **Full Authentication with BetterAuth & Google OAuth**: Seamless email/password authentication with uppercase/lowercase/length validation, Google social login, and MongoDB adapter storage.
- **Real-Time Copy Tracking (`$inc`) & Double Borrow Prevention**: Automatic decrement (`-1`) on borrow and increment (`+1`) on return. Strictly prevents users from borrowing the same title twice concurrently.
- **Secured API Routes via JWT**: Every write, update, delete, and borrow transaction is cryptographically secured via JSON Web Tokens.
- **Custom Modals, Toasts & Zero Lorem Ipsum**: Custom delete and borrow confirmation modals, animated feedback via `react-hot-toast`, and meaningful curated copy.
- **FontAwesome Iconography**: Featuring the latest `faXTwitter` social logo, solid navigation glyphs, and Google Fonts typography (`Outfit` & `Playfair Display`).

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

