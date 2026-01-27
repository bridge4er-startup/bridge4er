// ==============================================
// MAIN INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', loadComponents);

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

// Global functions
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