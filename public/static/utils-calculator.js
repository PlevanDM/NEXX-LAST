/**
 * Utility functions for calculator
 */

// cn function for class merging (from shadcn/ui)
function cn(...inputs) {
  const classes = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  // Merge Tailwind classes intelligently
  return classes.join(' ').replace(/\s+/g, ' ').trim();
}

window.cn = window.cn || cn;
