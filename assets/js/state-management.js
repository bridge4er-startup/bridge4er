// ==============================================
// STATE MANAGEMENT FUNCTIONS
// ==============================================

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