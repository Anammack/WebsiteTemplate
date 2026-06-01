Useage
This is up for anyone to use. This is one of the templates I use when developing sites for clients. Simple copy and paste into your IDE. There are comments throughout that will help if you are a beginner!

WebTemplate
A clean, fully-commented website starter template. Copy-paste it whenever you start a new project.

File Structure
WebTemplate/
├── index.html              ← Main HTML file
├── css/
│   └── style.css           ← All styles (variables, reset, components, responsive)
├── js/
│   └── main.js             ← All JavaScript (nav, scroll, form, animations)
├── assets/
│   └── images/             ← Drop your images here
│       ├── favicon.png
│       ├── hero-placeholder.png
│       └── about-placeholder.png
└── README.md
Quick Start Checklist
 Replace YourBrand in index.html and style.css
 Update the <title> and <meta description> in <head>
 Swap in your real images inside assets/images/
 Update all nav href links and section id attributes
 Change colours in the :root block at the top of style.css
 Change fonts in the Google Fonts <link> tag and --font-* variables
 Wire up the contact form (see the TODO comment in main.js)
 Add/remove sections in index.html as needed
Theming
All design tokens live at the top of css/style.css in the :root block. Change these variables and the whole site updates instantly:

Variable	Purpose
--color-primary	Main brand colour
--color-accent	Secondary highlight colour
--font-sans	Body / UI font
--font-serif	Display / heading font
--container-max	Max page width
--radius-*	Border-radius scale
--shadow-*	Box-shadow scale
Contact Form
The form currently shows a fake success message after 1.2 s. To make it real, find the TODO block in js/main.js → initContactForm() and replace it with one of these options:

Formspree — https://formspree.io (free tier available)
EmailJS — https://www.emailjs.com
Custom backend — fetch('your-api-endpoint', { method: 'POST', body: formData })
Browser Support
Modern evergreen browsers (Chrome, Firefox, Safari, Edge). No IE11 support — uses CSS custom properties and IntersectionObserver.
