// background/utils.js (v0.7.1 - With Duplicated Utils)

/**
 * Gets the current date as YYYY-MM-DD string. Used for storage keys.
 * @returns {string} Formatted date string.
 */
function getCurrentDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Extracts the registrable domain from a URL.
 * @param {string} url - The URL to parse.
 * @returns {string|null} The domain name or null if invalid.
 */
function getDomain(url) {
  if (!url || !(url.startsWith('http:') || url.startsWith('https:'))) {
    return null;
  }
  try {
    if (url.startsWith('about:') || url.startsWith('moz-extension:') || url.startsWith('chrome-extension:')) {
      return null;
    }
    const hostname = new URL(url).hostname;
    if (!hostname) return null;
    return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
  } catch (e) {
    // console.error(`[Util] Error parsing URL ${url}:`, e); // Optional debug log
    return null;
  }
}

/**
 * Determines the category for a given domain based on assignments.
 * Relies on FocusFlowState.categoryAssignments and FocusFlowState.defaultCategory.
 * @param {string} domain - The domain to categorize.
 * @returns {string} The category name.
 */
function getCategoryForDomain(domain) {
  // Access global state defined in state.js
  const assignments = FocusFlowState.categoryAssignments;
  const defaultCat = FocusFlowState.defaultCategory;

  if (!domain) return defaultCat;

  // Direct match has highest priority
  if (assignments.hasOwnProperty(domain)) {
    return assignments[domain];
  }

  // Wildcard match (*.example.com)
  const parts = domain.split('.');
  for (let i = 1; i < parts.length; i++) {
    const wildcardPattern = '*.' + parts.slice(i).join('.');
    if (assignments.hasOwnProperty(wildcardPattern)) {
      return assignments[wildcardPattern];
    }
  }

  return defaultCat;
}

/**
 * Debounces a function call.
 * @param {function} func - The function to debounce.
 * @param {number} wait - The debounce delay in milliseconds.
 * @returns {function} The debounced function.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- Duplicated Utilities Needed by Background Scripts ---

// Copied from options-utils.js because background can't directly access it
function formatTime(seconds, includeSeconds = true, forceHMS = false) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) seconds = 0;
  if (seconds < 0) seconds = 0;

  if (forceHMS) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  if (seconds === 0) return '0s';
  if (seconds < 60 && !includeSeconds) return '<1m'; // Needed for blocking page formatting

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const remainingSeconds = Math.floor(seconds % 60);
  let parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);

  if ((includeSeconds && hours === 0) || (hours === 0 && remainingMinutes === 0)) {
    if (remainingSeconds > 0) {
      parts.push(`${remainingSeconds}s`);
    }
  }
  if (parts.length === 0) {
    if (totalMinutes > 0) parts.push(`${totalMinutes}m`);
    else if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
  }
  return parts.length > 0 ? parts.join(' ') : '0s';
}

// Copied from options-utils.js because background can't directly access it
const categoryColors = {
  'Work/Productivity': 'rgba(54, 162, 235, 0.8)',
  'Social Media': 'rgba(255, 99, 132, 0.8)',
  'News & Info': 'rgba(255, 159, 64, 0.8)',
  Entertainment: 'rgba(153, 102, 255, 0.8)',
  Shopping: 'rgba(255, 205, 86, 0.8)',
  'Reference & Learning': 'rgba(75, 192, 192, 0.8)',
  Technology: 'rgba(100, 255, 64, 0.8)',
  Finance: 'rgba(40, 100, 120, 0.8)',
  Other: 'rgba(201, 203, 207, 0.8)',
};
const defaultCategoryColor = categoryColors['Other'];

function getCategoryColor(category) {
  return categoryColors[category] || defaultCategoryColor;
}
// --- End Duplicated Utilities ---

console.log('[System] background/utils.js loaded (with duplicated utils)');
