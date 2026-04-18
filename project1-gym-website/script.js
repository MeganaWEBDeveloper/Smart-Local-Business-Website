/* ===================================================
   FitZone Gym — Main JavaScript
   Features: Dark/Light mode, Booking system, Swiper,
             Mobile nav, Navbar scroll effect
=================================================== */

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('fitzone-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fitzone-theme', next);
});


// ===== MOBILE HAMBURGER NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});


// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});


// ===== TIME SLOT SELECTION =====
let selectedSlot = null;

const slots = document.querySelectorAll('.slot');
slots.forEach(slot => {
  slot.addEventListener('click', () => {
    if (slot.classList.contains('booked')) return;
    slots.forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
    selectedSlot = slot.dataset.time;
    document.getElementById('slotError').textContent = '';
  });
});


// ===== BOOKING FORM =====
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const bookingSummary = document.getElementById('bookingSummary');
const newBookingBtn = document.getElementById('newBookingBtn');

// Set minimum date to today
const dateInput = document.getElementById('bookingDate');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

function validateForm() {
  let valid = true;

  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('bookingDate').value;

  // Name
  if (!name || name.length < 2) {
    document.getElementById('nameError').textContent = 'Please enter your full name.';
    valid = false;
  } else {
    document.getElementById('nameError').textContent = '';
  }

  // Phone
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    document.getElementById('phoneError').textContent = 'Please enter a valid phone number.';
    valid = false;
  } else {
    document.getElementById('phoneError').textContent = '';
  }

  // Service
  if (!service) {
    document.getElementById('serviceError').textContent = 'Please select a service.';
    valid = false;
  } else {
    document.getElementById('serviceError').textContent = '';
  }

  // Date
  if (!date) {
    document.getElementById('dateError').textContent = 'Please select a date.';
    valid = false;
  } else {
    document.getElementById('dateError').textContent = '';
  }

  // Time slot
  if (!selectedSlot) {
    document.getElementById('slotError').textContent = 'Please select a time slot.';
    valid = false;
  } else {
    document.getElementById('slotError').textContent = '';
  }

  return valid;
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('bookingDate').value;
  const notes = document.getElementById('notes').value.trim();

  // Format date nicely
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Build summary HTML
  bookingSummary.innerHTML = `
    <div><strong>Name:</strong> ${escapeHtml(name)}</div>
    <div><strong>Service:</strong> ${escapeHtml(service)}</div>
    <div><strong>Date:</strong> ${formattedDate}</div>
    <div><strong>Time:</strong> ${escapeHtml(selectedSlot)}</div>
    <div><strong>Phone:</strong> ${escapeHtml(phone)}</div>
    ${notes ? `<div><strong>Notes:</strong> ${escapeHtml(notes)}</div>` : ''}
  `;

  // Save to localStorage
  const booking = {
    id: Date.now(),
    name,
    phone,
    service,
    date,
    formattedDate,
    time: selectedSlot,
    notes
  };

  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);

  // Mark slot as booked in UI (for demo session)
  document.querySelector(`.slot[data-time="${selectedSlot}"]`)?.classList.add('booked');

  // Show success
  bookingForm.hidden = true;
  bookingSuccess.hidden = false;
  renderBookings();
});

newBookingBtn.addEventListener('click', () => {
  bookingForm.reset();
  bookingForm.hidden = false;
  bookingSuccess.hidden = true;
  selectedSlot = null;
  slots.forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
});


// ===== SAVED BOOKINGS (localStorage) =====
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('fitzone-bookings') || '[]');
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem('fitzone-bookings', JSON.stringify(bookings));
}

function deleteBooking(id) {
  const bookings = getBookings().filter(b => b.id !== id);
  saveBookings(bookings);
  renderBookings();
}

function renderBookings() {
  const bookings = getBookings();
  const container = document.getElementById('bookingsList');
  const savedBookingsSection = document.getElementById('savedBookings');

  if (bookings.length === 0) {
    savedBookingsSection.style.display = 'none';
    return;
  }

  savedBookingsSection.style.display = 'block';

  // Only show future bookings (or today's)
  const now = new Date().toISOString().split('T')[0];
  const upcoming = bookings
    .filter(b => b.date >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcoming.length === 0) {
    container.innerHTML = '<p class="no-bookings">No upcoming bookings.</p>';
    return;
  }

  container.innerHTML = upcoming.map(b => `
    <div class="booking-item">
      <div class="booking-item-info">
        <strong>${escapeHtml(b.service)}</strong>
        <span>${b.formattedDate} &bull; ${escapeHtml(b.time)}</span>
      </div>
      <button class="delete-booking" onclick="deleteBooking(${b.id})" title="Cancel booking">&#10005;</button>
    </div>
  `).join('');
}

// Security: escape HTML to prevent XSS
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// Render on page load
renderBookings();


// ===== SWIPER TESTIMONIALS =====
new Swiper('.testimonials-swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: { slidesPerView: 1.2 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 2.5 },
  },
});


// ===== SMOOTH SCROLL OFFSET (fixed navbar) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // bare # links — skip, don't querySelector('#')
    let target;
    try { target = document.querySelector(href); } catch { return; }
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ===== INTERSECTION OBSERVER (fade-in on scroll) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
      // Clear inline transform after the fade-in finishes so CSS :hover can take over
      setTimeout(() => { entry.target.style.transform = ''; }, 550);
    }
  });
}, observerOptions);

// Apply initial hidden state and observe
document.querySelectorAll('.service-card, .testimonial-card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
