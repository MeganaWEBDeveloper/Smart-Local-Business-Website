# FitZone Gym — Smart Local Business Website

A modern, fully responsive gym website built with pure **HTML, CSS & JavaScript** — no frameworks, no backend needed. Designed as a freelance portfolio project to showcase smart features clients actually want.

---

## Live Features

| Feature | Details |
|---|---|
| **Appointment Booking** | Form with time slot picker, validation, and bookings saved to `localStorage` |
| **WhatsApp Button** | Floating animated button + contact section button, both pre-fill a message |
| **Testimonials Slider** | Auto-playing Swiper.js carousel with pagination and prev/next controls |
| **Google Maps Embed** | Responsive iframe map in the contact section |
| **Dark / Light Mode** | One-click toggle, preference saved to `localStorage` |

---

## Pages & Sections

- **Navbar** — Fixed, glassmorphism blur, mobile hamburger menu
- **Hero** — Headline, CTA buttons, animated stats counter area, scroll hint
- **Services** — 4-card grid (Personal Training, Group Classes, Nutrition, Recovery)
- **Booking** — Full appointment form with real-time validation + upcoming bookings list
- **Testimonials** — 5-slide Swiper carousel with autoplay
- **Contact** — Info cards + WhatsApp button + embedded Google Map
- **Footer** — Brand, quick links, social links

---

## Tech Stack

```
HTML5        — Semantic structure
CSS3         — Custom properties (variables), Flexbox, Grid, animations
JavaScript   — DOM, localStorage, IntersectionObserver, form validation
Swiper.js    — Testimonials carousel (CDN)
Google Fonts — Inter typeface (CDN)
```

> Zero frameworks. Zero build tools. Open `index.html` in a browser and it works.

---

## Project Structure

```
project1-gym-website/
├── index.html      # Full page structure & content
├── style.css       # All styling (dark/light theme via CSS variables)
└── script.js       # All interactivity (booking, theme, slider, scroll)
```

---

## How to Use / Customise

1. **Clone or download** this repo
2. Open `index.html` in any browser — no install needed
3. To customise for a real client:
   - Replace `+15551234567` in both WhatsApp links with the real number
   - Swap the Google Maps `<iframe src="...">` with the client's location embed
   - Update business name, hours, address, and prices
   - Add real photos / logo

---

## Booking System

- Bookings are stored in **`localStorage`** under the key `fitzone-bookings`
- Selected time slots are visually marked as booked for the session
- Users can cancel upcoming bookings from the list below the form
- Date input is locked to today or future dates only

---

## Screenshots

> Dark Mode

![Dark mode hero section](https://via.placeholder.com/800x400?text=Dark+Mode+Preview)

> Light Mode

![Light mode hero section](https://via.placeholder.com/800x400?text=Light+Mode+Preview)

---

## Author

**Megana** — Freelance Web Developer  
[GitHub](https://github.com/MeganaWEBDeveloper)

---

## License

MIT — free to use, modify, and adapt for client projects.
