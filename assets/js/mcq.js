// ==============================================
// MCQ FUNCTIONS
// ==============================================

async function loadMCQSubjects() {
    const loading = getDOMElement('mcq-subjects-loading');
    const subjectGrid = getDOMElement('subject-grid');
    
    if (loading) loading.innerHTML = `
        <div class="spinner"></div>
        <p>Loading subjects...</p>
    `;
    
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Objective MCQs`;
    
    try {
        const apiUrl = getGitHubApiUrl(folderPath);
        const response = await fetch(apiUrl);
        
        let subjects = [];
        
        if (response.ok) {
            const data = await response.json();
            subjects = data
                .filter(item => item.type === 'dir')
                .map(item => item.name)
                .sort();
        }
        
        if (subjects.length === 0) {
            subjects = FIELD_CONFIG[field].subjects || [];
        }
        
        hideElement(loading);
        showElement(subjectGrid);
        renderMCQSubjects(subjects);
        
    } catch (error) {
        console.error('Error loading MCQ subjects:', error);
        hideElement(loading);
        showElement(subjectGrid);
        renderMCQSubjects(FIELD_CONFIG[field].subjects || []);
    }
}

function renderMCQSubjects(subjects) {
    const subjectGrid = getDOMElement('subject-grid');
    if (!subjectGrid) return;
    
    const subjectIcons = {
        'Structure': 'fa-building',
        'Concrete Technology': 'fa-cube',
        'Construction Management': 'fa-hard-hat',
        'Construction Materials': 'fa-truck-loading',
        'Engineering Drawing': 'fa-drafting-compass',
        'Geotech': 'fa-mountain',
        'Hydropower': 'fa-water',
        'Engineering Economics': 'fa-dollar-sign',
        'Estimating and Costing': 'fa-calculator',
        'GK': 'fa-globe',
        'IQ': 'fa-brain',
        'Professional Practices': 'fa-briefcase',
        'Highway': 'fa-road',
        'Surveying': 'fa-ruler-combined',
        'Concrete': 'fa-cube',
        'Steel': 'fa-industry',
        'Thermodynamics': 'fa-fire',
        'Fluid Mechanics': 'fa-tint',
        'Heat Transfer': 'fa-thermometer-half',
        'Machine Design': 'fa-cogs',
        'Manufacturing': 'fa-industry',
        'Circuit Theory': 'fa-bolt',
        'Power Systems': 'fa-plug',
        'Control Systems': 'fa-sliders-h',
        'Electrical Machines': 'fa-cog',
        'Power Electronics': 'fa-microchip',
        'Analog Electronics': 'fa-wave-square',
        'Digital Electronics': 'fa-microchip',
        'VLSI Design': 'fa-microchip',
        'Communication Systems': 'fa-satellite',
        'Embedded Systems': 'fa-microchip',
        'Programming': 'fa-code',
        'Data Structures': 'fa-sitemap',
        'Algorithms': 'fa-project-diagram',
        'Database Systems': 'fa-database',
        'Computer Networks': 'fa-network-wired'
    };

    if (subjects.length === 0) {
        subjectGrid.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No MCQ subjects available.</p></div>';
        return;
    }

    subjectGrid.innerHTML = subjects.map(subject => `
        <div class="subject-card" data-subject="${subject}" data-type="mcq">
            <i class="fas ${subjectIcons[subject] || 'fa-book'}"></i>
            <h3>${subject}</h3>
            <p>Practice MCQs for ${subject}</p>
        </div>
    `).join('');
}

async function loadMCQChapters(subject) {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Objective MCQs/${subject}`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        const chapters = files
            .filter(file => file.name.toLowerCase().endsWith('.json'))
            .map(file => {
                return {
                    name: file.name.replace(/\.json$/i, '').replace(/_/g, ' '),
                    fileName: file.name,
                    path: file.path
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
        
        return chapters;
        
    } catch (error) {
        console.error(`Error loading chapters for ${subject}:`, error);
        return [];
    }
}

async function loadMCQQuestions(subject, chapterFileName, chapterDisplayName) {
    const field = AppState.currentField;
    const fileName = `${FIELD_CONFIG[field].folderPrefix}Objective MCQs/${subject}/${chapterFileName}`;
    
    try {
        const jsonData = await getJsonFileFromGitHub(fileName);
        
        if (!jsonData) {
            throw new Error('No JSON data received');
        }
        
        let questions = [];
        
        if (Array.isArray(jsonData)) {
            questions = jsonData.map((q, index) => ({
                id: `${subject}_${chapterDisplayName}_${index}`,
                question: q.question || `Question ${index + 1}`,
                options: q.options || ["Option A", "Option B", "Option C", "Option D"],
                correct: q.correct || "A",
                explanation: q.explanation || "No explanation provided"
            }));
        } else {
            console.warn('Unexpected JSON format, expected simple array');
            questions = [{
                id: `${subject}_${chapterDisplayName}_0`,
                question: "Check your JSON file format. Expected simple array.",
                options: ["Should be: [{question:'', options:[], correct:'', explanation:''}, ...]", "Not nested objects", "Direct array format", "Check documentation"],
                correct: "Should be: [{question:'', options:[], correct:'', explanation:''}, ...]",
                explanation: "Your JSON should be a direct array of question objects with question, options, correct, and explanation fields."
            }];
        }
        
        if (questions.length === 0) {
            questions = [{
                id: `${subject}_${chapterDisplayName}_0`,
                question: "No questions found in the JSON file.",
                options: ["Check file format", "Add questions to JSON", "Verify file path", "Contact admin"],
                correct: "Check file format",
                explanation: "Make sure your JSON file follows the correct format with an array of question objects."
            }];
        }
        
        return questions;
        
    } catch (error) {
        console.error(`Error loading MCQ questions for ${subject}/${chapterFileName}:`, error);
        return [{
            id: `${subject}_${chapterDisplayName}_0`,
            question: `Error loading questions for ${subject} - ${chapterDisplayName}`,
            options: ["JSON file not found", "Check GitHub path", "Verify file exists", "Contact admin"],
            correct: "JSON file not found",
            explanation: `Could not load ${chapterFileName} from your GitHub repository.`
        }];
    }
}

function showChapterSelection(subject) {
    const subjectGrid = getDOMElement('subject-grid');
    const chapterSelection = getDOMElement('chapter-selection');
    const chapterSelectionTitle = getDOMElement('chapter-selection-title');
    
    if (!subjectGrid || !chapterSelection || !chapterSelectionTitle) return;
    
    subjectGrid.style.display = 'none';
    chapterSelection.style.display = 'block';
    chapterSelectionTitle.textContent = `Select Chapter - ${subject}`;
    
    loadMCQChapters(subject).then(chapters => {
        const chapterGrid = getDOMElement('chapter-grid');
        if (!chapterGrid) return;
        
        if (chapters.length === 0) {
            chapterGrid.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No JSON files found for this subject.</p></div>';
            return;
        }
        
        chapterGrid.innerHTML = chapters.map(chapter => `
            <div class="subject-card" data-chapter="${chapter.name}" data-subject="${subject}" data-filename="${chapter.fileName}">
                <i class="fas fa-file-alt"></i>
                <h3>${chapter.name}</h3>
                <p>MCQ questions for ${chapter.name}</p>
            </div>
        `).join('');
    });
}

async function startMCQPractice(subject, chapterDisplayName, chapterFileName) {
    try {
        AppState.mcqState.currentSubject = subject;
        AppState.mcqState.currentChapter = chapterDisplayName;
        AppState.mcqState.currentPage = 1;
        AppState.mcqState.userAnswers = {};
        
        const mcqQuestionsContainer = getDOMElement('mcq-questions-container');
        if (mcqQuestionsContainer) {
            mcqQuestionsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading questions from GitHub...</div>';
        }
        
        const questions = await loadMCQQuestions(subject, chapterFileName, chapterDisplayName);
        
        if (questions.length === 0) {
            alert('No questions found in this chapter.');
            return;
        }
        
        AppState.mcqState.questions = questions;
        
        const chapterSelection = getDOMElement('chapter-selection');
        const mcqPractice = getDOMElement('mcq-practice');
        const mcqSubjectTitle = getDOMElement('mcq-subject-title');
        
        if (!chapterSelection || !mcqPractice || !mcqSubjectTitle) return;
        
        chapterSelection.style.display = 'none';
        mcqPractice.style.display = 'block';
        mcqSubjectTitle.textContent = `${subject} - ${chapterDisplayName}`;
        
        setupPagination();
        renderCurrentPage();
        
    } catch (error) {
        console.error('Error loading chapter questions:', error);
        alert('Failed to load questions. Please check your GitHub repository.');
    }
}

function setupPagination() {
    // Ensure questionsPerPage is a number, not a string
    const questionsPerPage = parseInt(AppState.mcqState.questionsPerPage) || 5;
    AppState.mcqState.questionsPerPage = questionsPerPage;
    
    const totalQuestions = AppState.mcqState.questions.length;
    const totalPages = questionsPerPage === 'all' ? 1 : Math.ceil(totalQuestions / questionsPerPage);
    
    // Reset to page 1 if current page is out of bounds
    if (AppState.mcqState.currentPage > totalPages) {
        AppState.mcqState.currentPage = 1;
    }
    const totalQuestionsCount = getDOMElement('total-questions-count');
    const totalPagesElement = getDOMElement('total-pages');
    const questionsPerPageSelect = getDOMElement('questions-per-page');
    
    if (totalQuestionsCount) totalQuestionsCount.textContent = totalQuestions;
    if (totalPagesElement) totalPagesElement.textContent = totalPages;
    if (questionsPerPageSelect) questionsPerPageSelect.value = questionsPerPage;
    
    updatePageIndicators();
    updatePaginationButtons();
}

function updatePageIndicators() {
    const currentPage = AppState.mcqState.currentPage;
    const totalPagesElement = getDOMElement('total-pages');
    const pageIndicators = getDOMElement('page-indicators');
    
    if (!totalPagesElement || !pageIndicators) return;
    
    const totalPages = parseInt(totalPagesElement.textContent);
    
    pageIndicators.innerHTML = '';
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            AppState.mcqState.currentPage = i;
            renderCurrentPage();
        });
        pageIndicators.appendChild(pageBtn);
    }
}

function updatePaginationButtons() {
    const currentPage = AppState.mcqState.currentPage;
    const totalPagesElement = getDOMElement('total-pages');
    const firstPageBtn = getDOMElement('first-page');
    const prevPageBtn = getDOMElement('prev-page');
    const nextPageBtn = getDOMElement('next-page');
    const lastPageBtn = getDOMElement('last-page');
    
    if (!totalPagesElement || !firstPageBtn || !prevPageBtn || !nextPageBtn || !lastPageBtn) return;
    
    const totalPages = parseInt(totalPagesElement.textContent);
    
    firstPageBtn.disabled = currentPage === 1;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.disabled = currentPage === totalPages;
}

function renderCurrentPage() {
    const state = AppState.mcqState;
    
    // Ensure we have valid numbers
    const questionsPerPage = parseInt(state.questionsPerPage) || 5;
    const currentPage = parseInt(state.currentPage) || 1;
    const totalQuestions = state.questions.length;
    
    // Calculate indices correctly
    let startIndex = (currentPage - 1) * questionsPerPage;
    let endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);
    
    console.log(`Displaying questions ${startIndex + 1} to ${endIndex} of ${totalQuestions}`);
    
    // Update UI elements
    const currentPageElement = getDOMElement('current-page');
    const questionsRange = getDOMElement('questions-range');
    const mcqQuestionsContainer = getDOMElement('mcq-questions-container');
    
    if (currentPageElement) currentPageElement.textContent = currentPage;
    if (questionsRange) questionsRange.textContent = `${startIndex + 1}-${endIndex} of ${totalQuestions}`;
    
    if (!mcqQuestionsContainer) return;
    
    // Clear container
    mcqQuestionsContainer.innerHTML = '';
    
    // CRITICAL: Loop through ALL questions in the range
    for (let i = startIndex; i < endIndex; i++) {
        const question = state.questions[i];
        
        if (!question) {
            console.error(`No question found at index ${i}`);
            continue;
        }
        
        const questionNumber = i + 1;  // Display numbers starting from 1
        const userAnswer = state.userAnswers[i];
        
        // Create question HTML
        const questionDiv = document.createElement('div');
        questionDiv.className = 'mcq-question-container';
        questionDiv.innerHTML = `
            <div class="question-number-badge">Question ${questionNumber}</div>
            <div class="mcq-question">${question.question}</div>
            <div class="mcq-options" id="options-${i}">
                ${question.options.map((option, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    const isSelected = userAnswer === option;
                    let optionClass = 'mcq-option';
                    if (isSelected) optionClass += ' selected';
                    
                    return `
                        <div class="${optionClass}" data-question-index="${i}" data-option="${option}">
                            <div class="option-letter">${optionLetter}</div>
                            <div>${option}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="mcq-explanation" id="explanation-${i}">
                <h4><i class="fas fa-lightbulb"></i> Explanation</h4>
                <p>${question.explanation}</p>
            </div>
        `;
        
        mcqQuestionsContainer.appendChild(questionDiv);
        
        // Add event listeners
        questionDiv.querySelectorAll('.mcq-option').forEach(option => {
            option.addEventListener('click', function() {
                const questionIndex = parseInt(this.dataset.questionIndex);
                const selectedOption = this.dataset.option;
                handleMCQOptionClick(questionIndex, selectedOption, this);
            });
        });
    }
    
    // Update pagination
    updatePageIndicators();
    updatePaginationButtons();
}

function handleMCQOptionClick(questionIndex, selectedOption, optionElement) {
    const question = AppState.mcqState.questions[questionIndex];
    const optionsContainer = optionElement.parentElement;
    const explanationElement = document.getElementById(`explanation-${questionIndex}`);
    
    optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    optionElement.classList.add('selected');
    
    AppState.mcqState.userAnswers[questionIndex] = selectedOption;
    
    if (explanationElement) explanationElement.classList.add('show');
    
    if (selectedOption === question.correct) {
        optionElement.classList.add('correct');
    } else {
        optionElement.classList.add('incorrect');
        optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
            if (opt.dataset.option === question.correct) {
                opt.classList.add('correct');
            }
        });
    }
}