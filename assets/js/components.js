// ==============================================
// COMPONENT LOADING (OPTIMIZED)
// ==============================================

async function loadComponents() {
    const components = [
        { id: 'header-container', file: 'components/header.html' },
        { id: 'navigation-container', file: 'components/navigation.html' },
        { id: 'notice-container', file: 'components/notice-section.html' },
        { id: 'syllabus-container', file: 'components/syllabus-section.html' },
        { id: 'old-questions-container', file: 'components/old-questions-section.html' },
        { id: 'mcq-container', file: 'components/mcq-section.html' },
        { id: 'subjective-container', file: 'components/subjective-section.html' },
        { id: 'take-exam-container', file: 'components/take-exam-section.html' },
        { id: 'footer-container', file: 'components/footer.html' }
    ];

    const loadPromises = components.map(async (component) => {
        try {
            const response = await fetch(component.file);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();
            const element = document.getElementById(component.id);
            if (element) {
                element.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading ${component.file}:`, error);
            const element = document.getElementById(component.id);
            if (element) {
                element.innerHTML = `<div class="error-message">Failed to load component</div>`;
            }
        }
    });

    await Promise.all(loadPromises);
    
    initializeDOMReferences();
    init();
}

// DOM Element Cache
const DOMCache = new Map();

function getDOMElement(id) {
    if (!DOMCache.has(id)) {
        DOMCache.set(id, document.getElementById(id));
    }
    return DOMCache.get(id);
}

function querySelector(selector) {
    if (!DOMCache.has(selector)) {
        DOMCache.set(selector, document.querySelector(selector));
    }
    return DOMCache.get(selector);
}

function querySelectorAll(selector) {
    if (!DOMCache.has(selector)) {
        DOMCache.set(selector, document.querySelectorAll(selector));
    }
    return DOMCache.get(selector);
}

function initializeDOMReferences() {
    DOMCache.clear();
    
    const elements = [
        'current-field', 'field-dropdown-content', 'field-dropdown-btn', 'user-field',
        'notice-field-indicator', 'syllabus-field-indicator', 'old-questions-field-indicator',
        'mcq-field-indicator', 'subjective-field-indicator', 'exam-field-indicator',
        'notice-loading', 'syllabus-loading', 'old-questions-loading',
        'mcq-subjects-loading', 'subjective-loading',
        'notice-list', 'syllabus-list', 'old-questions-list',
        'subject-grid', 'mcq-practice', 'chapter-selection', 'chapter-grid',
        'chapter-selection-title', 'mcq-subject-title', 'mcq-questions-container',
        'questions-per-page', 'current-page', 'total-pages', 'questions-range',
        'total-questions-count', 'page-indicators', 'first-page', 'prev-page',
        'next-page', 'last-page', 'back-to-subjects', 'back-to-subjects-from-chapter',
        'subjective-set-grid', 'subjective-content', 'subjective-chapter-selection',
        'subjective-chapter-grid', 'subjective-chapter-title', 'subjective-set-title',
        'subjective-questions-container', 'back-to-subjective-sets', 'back-to-subjective-subjects',
        'exam-type-selection', 'exam-set-selection', 'subjective-exam', 'multiple-choice-exam',
        'exam-results', 'prev-exam-question', 'next-exam-question', 'flag-exam-question',
        'back-to-exam-type', 'back-to-exam-type-mcq', 'back-to-exam-type-results',
        'submit-subjective-exam', 'submit-mcq-exam', 'view-answers', 'subjective-exam-title',
        'subjective-exam-questions', 'multiple-choice-exam-title', 'current-exam-question',
        'total-exam-questions', 'multiple-choice-container', 'mcq-total-questions',
        'mcq-answered-questions', 'mcq-remaining-questions'
    ];

    elements.forEach(id => getDOMElement(id));
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function extractYearFromFilename(filename) {
    const match = filename.match(/(20\d{2})/);
    return match ? parseInt(match[1]) : new Date().getFullYear();
}

function getFileIconClass(extension) {
    const iconMap = {
        'pdf': 'fa-file-pdf',
        'doc': 'fa-file-word',
        'docx': 'fa-file-word',
        'xls': 'fa-file-excel',
        'xlsx': 'fa-file-excel',
        'ppt': 'fa-file-powerpoint',
        'pptx': 'fa-file-powerpoint',
        'jpg': 'fa-file-image',
        'jpeg': 'fa-file-image',
        'png': 'fa-file-image',
        'gif': 'fa-file-image',
        'bmp': 'fa-file-image',
        'svg': 'fa-file-image',
        'txt': 'fa-file-alt',
        'zip': 'fa-file-archive',
        'rar': 'fa-file-archive',
        '7z': 'fa-file-archive',
        'json': 'fa-file-code'
    };
    
    return iconMap[extension.toLowerCase()] || 'fa-file';
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    
    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

function hideElement(element) {
    if (element) element.style.display = 'none';
}

function showElement(element, display = 'block') {
    if (element) element.style.display = display;
}

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


