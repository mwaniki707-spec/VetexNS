# Vertex Network Solutions — Static Build

A static HTML/CSS/JS version of the Vertex Network Solutions website. All the visuals and
functionality of the original Next.js app are preserved, but there is no backend — everything
runs entirely in the browser.

## Running locally

Because the pages use `fetch`-free cross-file scripts, you can simply open `index.html`
in a browser. For best results (especially so that `localStorage` behaves consistently
across pages), serve the folder from a local HTTP server:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx http-server -p 8080

# PHP
php -S localhost:8080
```

Then open http://localhost:8080/index.html

## Pages

| File             | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `index.html`     | Home — hero, stats, services overview, features, CTA   |
| `services.html`  | Detailed services with process timeline                |
| `products.html`  | Product showcase with pricing and categories           |
| `about.html`     | Mission, values, timeline, and leadership team         |
| `contact.html`   | Contact form with client-side validation + sanitization|
| `login.html`     | Sign-in form (session stored in `localStorage`)        |
| `register.html`  | Create-account form                                    |
| `dashboard.html` | Protected dashboard — devices, alerts, stats, account  |

## File structure

```
VetexVS/
├── index.html            Home
├── services.html
├── products.html
├── about.html
├── contact.html
├── login.html
├── register.html
├── dashboard.html        (requires login)
├── css/
│   └── styles.css        Animations, grid-bg, gradient text, scrollbar
├── js/
│   ├── data.js           Services, products, team, devices, alerts, stats
│   ├── icons.js          SVG icon library (shield, network, cloud, …)
│   ├── validation.js     Email/phone/name/password validators + sanitizer
│   ├── auth.js           localStorage-based session (mirrors /api/auth/*)
│   ├── app.js            Shared navbar, footer, form helpers, icon hydration
│   └── pages/
│       ├── home.js
│       ├── services.js
│       ├── products.js
│       ├── about.js
│       ├── contact.js
│       ├── login.js
│       ├── register.js
│       └── dashboard.js
└── README.md
```

## How the original features map to this static build

| Original (Next.js)               | Static replacement                                      |
| -------------------------------- | ------------------------------------------------------- |
| `/api/auth/login`, `/register`   | `authLogin()` / `authRegister()` in `js/auth.js`        |
| `/api/auth/session`, `/logout`   | `getSessionUser()` / `authLogout()` (localStorage)      |
| `/api/contact`                   | `handleContactSubmit()` — stored in `localStorage`      |
| React `AuthContext`              | `localStorage` key `vertex_auth_session` + helpers      |
| Tailwind v4 CSS                  | Tailwind Play CDN + `css/styles.css` for custom effects |
| Server-rendered React pages      | Plain HTML files + small per-page JS for dynamic bits   |

## Demo credentials

- Email: `admin@vertex.com`
- Password: `Admin123!`

A second demo user is also available:

- Email: `demo@vertex.com`
- Password: `Demo1234`

New accounts created via the register page are persisted in `localStorage` under
`vertex_registered_users`, so they survive page reloads but only within the same browser.

## What does NOT persist beyond the browser

Because this is a static build:

- Contact form submissions are stored in `localStorage` (`vertex_contact_submissions`)
  instead of being emailed/saved server-side.
- Accounts are stored in `localStorage` and won't sync across browsers/devices.
- There is no rate limiting, no HttpOnly cookies, and no real Stripe / Cloudinary /
  Playwright integration. The original `/api/payments` and `/api/playwright` scaffolds
  don't have a static equivalent.

## Security notes

- Client-side XSS sanitization is applied to contact-form input before storage, mirroring
  `sanitizeInput()` from the original project.
- Password strength rules (min 8 chars, upper, lower, digit) are enforced in `validation.js`.
- Since all data lives in `localStorage`, treat this as a demo — do not store real secrets.
