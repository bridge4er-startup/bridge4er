// ==============================================
// COMPONENT LOADING (OPTIMIZED)
// ==============================================

console.log("📦 components.js: loadComponents() function is STARTING");

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
