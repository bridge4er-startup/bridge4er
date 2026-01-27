// ==============================================
// MAIN INITIALIZATION
// ==============================================

function init() {
    console.log("Initializing application...");
    initializeDOMReferences();
    setupEventListeners();
    loadField('civil');
    updateFieldIndicators();
    initPaymentSystem();
    console.log("Application initialized successfully");
}

function loadField(field) {
    console.log(`Loading field: ${field}`);
    
    clearGitHubCache();
    AppState.currentField = field;
    const config = FIELD_CONFIG[field];
    
    const currentField = getDOMElement('current-field');
    const userField = getDOMElement('user-field');
    
    if (currentField) {
        currentField.innerHTML = `<i class="fas ${config.icon}"></i> ${config.name}`;
    }
    
    if (userField) {
        userField.textContent = config.name;
    }
    
    document.documentElement.style.setProperty('--primary-color', config.color);
    
    const header = document.querySelector('header');
    if (header) {
        header.style.background = `linear-gradient(to right, ${config.color}, ${lightenColor(config.color, 20)})`;
    }
    
    updateFieldIndicators();
    resetPracticeSessions();
    
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        loadSectionData(activeSection.id);
    }
    
    console.log(`Field loaded: ${field}`);
}

function updateFieldIndicators() {
    const config = FIELD_CONFIG[AppState.currentField];
    const indicators = [
        'notice-field-indicator',
        'syllabus-field-indicator', 
        'old-questions-field-indicator',
        'mcq-field-indicator',
        'subjective-field-indicator',
        'exam-field-indicator'
    ];
    
    indicators.forEach(id => {
        const indicator = getDOMElement(id);
        if (indicator) {
            indicator.innerHTML = `<i class="fas ${config.icon}"></i> ${config.name.split(' ')[0]}`;
            indicator.style.backgroundColor = config.color;
        }
    });
}

function resetPracticeSessions() {
    const elements = {
        'mcq-practice': 'none',
        'chapter-selection': 'none',
        'subject-grid': 'block',
        'subjective-content': 'none',
        'subjective-chapter-selection': 'none',
        'subjective-set-grid': 'block'
    };
    
    Object.entries(elements).forEach(([id, display]) => {
        const element = getDOMElement(id);
        if (element) element.style.display = display;
    });
    
    resetExamTypeSelection();
    
    AppState.mcqState = {
        currentSubject: null,
        currentChapter: null,
        currentPage: 1,
        questionsPerPage: 5,
        questions: [],
        userAnswers: {},
        currentQuestions: []
    };
    AppState.subjectiveState = {
        currentSubject: null,
        currentChapter: null,
        chapters: []
    };
}

function loadSectionData(section) {
    switch(section) {
        case 'notice':
            loadNoticeFiles();
            break;
        case 'syllabus':
            loadSyllabusFiles();
            break;
        case 'old-questions':
            loadOldQuestionFiles();
            break;
        case 'objective-mcqs':
            loadMCQSubjects();
            break;
        case 'subjective':
            initEnhancedSubjective();
            break;
        case 'take-exam':
            // Already handled by resetExamTypeSelection
            break;
    }
}

// ==============================================
// GLOBAL FUNCTIONS
// ==============================================

window.viewFile = function(fileUrl, fileName) {
    try {
        window.open(fileUrl, '_blank');
    } catch (error) {
        console.error('Error viewing file:', error);
        alert('Unable to open file. Please try downloading instead.');
    }
};

window.downloadFile = function(fileUrl, fileName) {
    try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Unable to download file. Please try again.');
    }
};

window.goBackToSubjectiveChapters = function() {
    const subjectiveContent = getDOMElement('subjective-content');
    const subjectiveChapterSelection = getDOMElement('subjective-chapter-selection');
    
    if (subjectiveContent && subjectiveChapterSelection) {
        subjectiveContent.style.display = 'none';
        subjectiveChapterSelection.style.display = 'block';
    }
};


// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', loadComponents);
