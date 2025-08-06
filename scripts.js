// scripts/main.js
(() => {
  'use strict';

  /* ==========================================================================
     1. Service Worker Registration
     ========================================================================== */
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('sw.js')
          .catch(err => console.error('SW registration failed:', err));
      });
    }
  };

  /* ==========================================================================
     2. Theme Persistence & Toggle
     ========================================================================== */
  const themeBtn = document.getElementById('themeToggleBtn');

  const applyStoredTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') document.body.classList.add('dark-mode');
    updateAriaPressed();
  };

  const updateAriaPressed = () => {
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.setAttribute('aria-pressed', isDark);
  };

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateAriaPressed();
  };

  /* ==========================================================================
     3. Copy & Share Controls
     ========================================================================== */
  const dailyMessageElement = document.getElementById('daily-message');

  const copyMessage = () => {
    navigator.clipboard
      .writeText(dailyMessageElement.textContent)
      .then(() => alert('Message copied!'))
      .catch(err => console.error('Copy failed:', err));
  };

  const shareMessage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Today’s Shared Message',
          text:  dailyMessageElement.textContent,
          url:   location.href
        });
      } catch (err) {
        console.warn('Share cancelled or failed:', err);
      }
    } else {
      alert('Share not supported on this device.');
    }
  };

  /* ==========================================================================
     4. Daily Message & Journey Counter Logic
     ========================================================================== */
  const startDate = new Date('2023-11-01');
  const messages  = [
    "I had a brief moment where I looked at you and thought, something has never felt this right - June 19, 2024",
    "I looked at you and felt sure. I don't know what of but I felt that way , And I knew I'd never make regrets about you - June 19, 2024",
    "Seeing you was the best decision, I enjoyed my time, 🫶🏽 I'd do it anyday - June 19, 2024",
    "Had no idea Obama lived in Chicago - May 31, 2025",
    "I'm so proud to live in the world with you - January 7, 2025",
    "pewds is my totoro 🫶🏽 (i havent watched that one) - June 9 2024",
    "Don't worry about me konjo - August 18, 2024",
    "You're always worth the wait - August 18, 2024",
    "How can you say you're not gonna read them and describe them so passionately in the same sentencee - November 24, 2023",
    "Bitch eat actual misir please😭 - September 28, 2024",
    "One of the many things i admire about you🙂 - January 5, 2025",
    "Be careful of men - May 26, 2024",
    "its so cool when people arent related in blood but become close like family - January 13, 2024",
    "You're my happy place🫶 - nah, i was made for you - June 24, 2025",
    "i miss you everyday, from the moment i wake up - June 24, 2025"
  ];

  const updateCounter = () => {
    const now       = new Date();
    const diffMs    = now - startDate;
    const seconds   = Math.floor(diffMs / 1000);
    const days      = Math.floor(seconds / 86400);
    const weeks     = Math.floor(days / 7);
    const counterEl = document.getElementById('counter');

    counterEl.innerHTML = `
      ${days} days,<br>
      ${weeks} weeks,<br>
      and ${seconds} seconds
    `;
  };

  const setDailyMessage = () => {
    const now         = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const oneDayMs    = 1000 * 60 * 60 * 24;
    const dayOfYear   = Math.floor((now - startOfYear) / oneDayMs);
    const index       = dayOfYear % messages.length;

    dailyMessageElement.textContent = messages[index];
  };

  /* ==========================================================================
     5. Initialize App
     ========================================================================== */
  const initApp = () => {
    applyStoredTheme();
    themeBtn.addEventListener('click', toggleTheme);

    document.getElementById('copyBtn').addEventListener('click', copyMessage);
    document.getElementById('shareBtn').addEventListener('click', shareMessage);

    setDailyMessage();
    updateCounter();
    setInterval(updateCounter, 1000);
  };

  /* ==========================================================================
     Bootstrap
     ========================================================================== */
  registerServiceWorker();
  document.addEventListener('DOMContentLoaded', initApp);
})();
