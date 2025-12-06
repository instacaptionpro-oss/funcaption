@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Styles */

:root {
  --primary: #14B8A6;
  --secondary: #0EA5E9;
  --accent: #8B5CF6;
  --gold: #F59E0B;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #ffffff;
  color: #1f2937;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom utilities */
.container {
  max-width: 1200px;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Button hover effects */
button, .btn {
  transition: all 0.3s ease;
}

button:hover, .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top-color: var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

/* Pulse animation for popular plan */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Limitation box gradient */
.limitation-box {
  background: linear-gradient(135deg, #0EA5E9, #14B8A6);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.2);
}

/* Caption card styling */
.caption-card {
  background: white;
  border-left: 4px solid var(--primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.caption-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateX(4px);
}

/* Focus states */
input:focus, 
textarea:focus, 
select:focus {
  outline: none;
  ring: 2px;
  ring-color: var(--primary);
  border-color: var(--primary);
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

/* Scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--primary);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.scroll-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

/* Confetti animation placeholder */
.confetti {
  /* Add confetti library CSS here if needed */
}
