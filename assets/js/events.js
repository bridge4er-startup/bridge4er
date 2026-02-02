// ==============================================
// EVENT LISTENERS
// ==============================================

function setupEventListeners() {
    console.log("Setting up event listeners");
    
    // Field dropdown
    const fieldDropdownBtn = querySelector('.field-dropdown-btn');
    const fieldDropdown = querySelector('.field-dropdown-content');
    
    if (fieldDropdownBtn && fieldDropdown) {
        fieldDropdownBtn.addEventListener('click', () => {
            fieldDropdown.classList.toggle('show');
        });
        
        document.querySelectorAll('.field-option').forEach(option => {
            option.addEventListener('click', () => {
                const field = option.dataset.field;
                loadField(field);
                fieldDropdown.classList.remove('show');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!fieldDropdownBtn.contains(e.target) && !fieldDropdown.contains(e.target)) {
                fieldDropdown.classList.remove('show');
            }
        });
    }
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            resetPracticeSessions();
            loadSectionData(section);
        });
    });
    
    // Footer navigation
    document.querySelectorAll('.footer-nav').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            const navLink = document.querySelector(`.nav-link[data-section="${section}"]`);
            if (navLink) navLink.click();
        });
    });
    
    // Event delegation for MCQ and Subjective sections
    document.addEventListener('click', (e) => {
        // MCQ Subject Cards
        const mcqSubjectCard = e.target.closest('.subject-card[data-subject][data-type="mcq"]');
        if (mcqSubjectCard) {
            const subject = mcqSubjectCard.dataset.subject;
            e.preventDefault();
            showChapterSelection(subject);
        }
        
        // MCQ Chapter Cards
        const chapterCard = e.target.closest('.subject-card[data-chapter]');
        if (chapterCard && chapterCard.dataset.subject && chapterCard.dataset.filename) {
            const subject = chapterCard.dataset.subject;
            const chapterDisplayName = chapterCard.dataset.chapter;
            const chapterFileName = chapterCard.dataset.filename;
            e.preventDefault();
            startMCQPractice(subject, chapterDisplayName, chapterFileName);
        }
        
        // Exam Type Cards
        const examTypeCard = e.target.closest('.exam-type-card[data-exam-type]');
        if (examTypeCard) {
            const examType = examTypeCard.dataset.examType;
            e.preventDefault();
            
            if (examType === 'subjective') {
                showSubjectiveExamSetSelection();
            } else if (examType === 'multiple-choice') {
                showMCQExamSetSelection();
            }
        }
    });
    
    // MCQ pagination
    setupMCQPaginationListeners();
    
    // Exam navigation buttons
    setupExamNavigationListeners();
    
    // Setup search
    setupSearch();
}

function setupMCQPaginationListeners() {
    const firstPageBtn = getDOMElement('first-page');
    const prevPageBtn = getDOMElement('prev-page');
    const nextPageBtn = getDOMElement('next-page');
    const lastPageBtn = getDOMElement('last-page');
    const questionsPerPageSelect = getDOMElement('questions-per-page');
    const backToSubjectsBtn = getDOMElement('back-to-subjects');
    const backToSubjectsFromChapterBtn = getDOMElement('back-to-subjects-from-chapter');
    
    if (firstPageBtn) {
        firstPageBtn.addEventListener('click', () => {
            AppState.mcqState.currentPage = 1;
            renderCurrentPage();
        });
    }
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (AppState.mcqState.currentPage > 1) {
                AppState.mcqState.currentPage--;
                renderCurrentPage();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = parseInt(getDOMElement('total-pages').textContent);
            if (AppState.mcqState.currentPage < totalPages) {
                AppState.mcqState.currentPage++;
                renderCurrentPage();
            }
        });
    }
    
    if (lastPageBtn) {
        lastPageBtn.addEventListener('click', () => {
            AppState.mcqState.currentPage = parseInt(getDOMElement('total-pages').textContent);
            renderCurrentPage();
        });
    }
    
    if (questionsPerPageSelect) {
        questionsPerPageSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            AppState.mcqState.questionsPerPage = value === 'all' ? 'all' : parseInt(value);
            AppState.mcqState.currentPage = 1;
            setupPagination();
            renderCurrentPage();
        });
    }
    
    if (backToSubjectsBtn) {
        backToSubjectsBtn.addEventListener('click', () => {
            const mcqPractice = getDOMElement('mcq-practice');
            const chapterSelection = getDOMElement('chapter-selection');
            if (mcqPractice && chapterSelection) {
                mcqPractice.style.display = 'none';
                chapterSelection.style.display = 'block';
            }
        });
    }
    
    if (backToSubjectsFromChapterBtn) {
        backToSubjectsFromChapterBtn.addEventListener('click', () => {
            const chapterSelection = getDOMElement('chapter-selection');
            const subjectGrid = getDOMElement('subject-grid');
            if (chapterSelection && subjectGrid) {
                chapterSelection.style.display = 'none';
                subjectGrid.style.display = 'block';
            }
        });
    }
}

function setupExamNavigationListeners() {
    // Back to exam type
    const backToExamType = getDOMElement('back-to-exam-type');
    if (backToExamType) {
        backToExamType.addEventListener('click', resetExamTypeSelection);
    }
    
    // Subjective exam submission
    const submitSubjectiveExam = getDOMElement('submit-subjective-exam');
    if (submitSubjectiveExam) {
        submitSubjectiveExam.addEventListener('click', () => {
            if (confirm('Are you sure you want to submit your subjective exam?')) {
                alert('Subjective exam submitted!');
                if (AppState.timers.subjectiveExam) clearInterval(AppState.timers.subjectiveExam);
                resetExamTypeSelection();
            }
        });
    }
    
    // MCQ exam navigation
    const prevExamQuestion = getDOMElement('prev-exam-question');
    if (prevExamQuestion) {
        prevExamQuestion.addEventListener('click', () => {
            if (AppState.examState.currentQuestionIndex > 0) {
                AppState.examState.currentQuestionIndex--;
                loadMCQExamQuestion();
            }
        });
    }
    
    const nextExamQuestion = getDOMElement('next-exam-question');
    if (nextExamQuestion) {
        nextExamQuestion.addEventListener('click', () => {
            if (AppState.examState.currentQuestionIndex < AppState.examState.questions.length - 1) {
                AppState.examState.currentQuestionIndex++;
                loadMCQExamQuestion();
            }
        });
    }
    
    const flagExamQuestion = getDOMElement('flag-exam-question');
    if (flagExamQuestion) {
        flagExamQuestion.addEventListener('click', () => {
            const index = AppState.examState.currentQuestionIndex;
            AppState.examState.flagged[index] = !AppState.examState.flagged[index];
            loadMCQExamQuestion();
        });
    }
    
    // Submit MCQ exam
    const submitMcqExam = getDOMElement('submit-mcq-exam');
    if (submitMcqExam) {
        submitMcqExam.addEventListener('click', () => {
            const unanswered = AppState.examState.questions.length - Object.keys(AppState.examState.answers).length;
            const negativeMarking = AppState.examState.negativeMarking;
            
            let message = 'Are you sure you want to submit your MCQ exam?';
            if (unanswered > 0) {
                message = `You have ${unanswered} unanswered questions. ` + message;
            }
            if (negativeMarking) {
                message += '\n\nNote: Negative marking is enabled (20% deduction for wrong answers).';
            }
            
            if (confirm(message)) {
                submitMCQExam();
            }
        });
    }
    
    // Back to exam sets button
    const backToExamTypeMcq = getDOMElement('back-to-exam-type-mcq');
    if (backToExamTypeMcq) {
        backToExamTypeMcq.addEventListener('click', () => {
            if (confirm('Are you sure you want to go back? Your current progress will be lost.')) {
                resetExamTypeSelection();
            }
        });
    }
    
    // View answers
    const viewAnswers = getDOMElement('view-answers');
    if (viewAnswers) {
        viewAnswers.addEventListener('click', showExamAnswers);
    }
    
    // Back to exam type from results
    const backToExamTypeResults = getDOMElement('back-to-exam-type-results');
    if (backToExamTypeResults) {
        backToExamTypeResults.addEventListener('click', resetExamTypeSelection);
    }
}

