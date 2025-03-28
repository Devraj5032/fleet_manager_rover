// Theme colors for recharts and other components
export const chartColors = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(142, 76%, 36%)",
  info: "hsl(217, 91%, 60%)",
  warning: "hsl(45, 100%, 51%)",
  danger: "hsl(0, 84%, 60%)",
  
  // Light versions for area fills
  "primary-light": "hsla(var(--primary), 0.2)",
  "secondary-light": "hsla(var(--secondary), 0.2)",
  "success-light": "hsla(142, 76%, 36%, 0.2)",
  "info-light": "hsla(217, 91%, 60%, 0.2)",
  "warning-light": "hsla(45, 100%, 51%, 0.2)",
  "danger-light": "hsla(0, 84%, 60%, 0.2)",
};

// CSS variables for colors
export const cssVars = {
  "--color-success": "hsl(142, 76%, 36%)",
  "--color-info": "hsl(217, 91%, 60%)",
  "--color-warning": "hsl(45, 100%, 51%)",
  "--color-danger": "hsl(0, 84%, 60%)",
  "--color-success-light": "hsla(142, 76%, 36%, 0.2)",
  "--color-info-light": "hsla(217, 91%, 60%, 0.2)",
  "--color-warning-light": "hsla(45, 100%, 51%, 0.2)",
  "--color-danger-light": "hsla(0, 84%, 60%, 0.2)",
};

// Add CSS variables to document
export function initTheme() {
  const root = document.documentElement;
  
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
