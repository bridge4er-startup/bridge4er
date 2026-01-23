// ==============================================
// COMPONENT LOADING (OPTIMIZED)
// ==============================================

// DOM Element Cache
const DOMCache = new Map();

// Load components with error handling
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

    // Load components with parallel requests
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
    
    // Initialize after components are loaded
    initializeDOMReferences();
    init();
}

// ==============================================
// APPLICATION STATE MANAGEMENT
// ==============================================

const AppState = {
    currentField: 'civil',
    currentSection: 'notice',
    mcqState: {
        currentSubject: null,
        currentChapter: null,
        currentPage: 1,
        questionsPerPage: 5,
        questions: [],
        userAnswers: {},
        currentQuestions: []
    },
    subjectiveState: {
        currentSubject: null,
        currentChapter: null,
        chapters: []
    },
    examState: {
        type: null,
        currentSet: null,
        currentFileName: null,
        currentQuestionIndex: 0,
        questions: [],
        answers: {},
        flagged: {},
        timer: null,
        startTime: null,
        totalTime: 0,
        mcqSets: [],
        subjectiveSets: []
    },
    timers: {
        subjectiveExam: null,
        mcqExam: null
    },
    searchState: {
        notice: '',
        syllabus: '',
        oldQuestions: ''
    }
};

// ==============================================
// DOM ELEMENT REFERENCES (OPTIMIZED)
// ==============================================

let DOM = {};

function getDOMElement(id) {
    if (!DOMCache.has(id)) {
        DOMCache.set(id, document.getElementById(id));
    }
    return DOMCache.get(id);
}

function initializeDOMReferences() {
    DOMCache.clear();
    
    // Initialize DOM object
    DOM = {
        // Header elements
        currentField: getDOMElement('current-field'),
        fieldDropdown: document.querySelector('.field-dropdown-content'),
        fieldDropdownBtn: document.querySelector('.field-dropdown-btn'),
        userField: getDOMElement('user-field'),
        
        // Field indicators
        fieldIndicators: {
            notice: getDOMElement('notice-field-indicator'),
            syllabus: getDOMElement('syllabus-field-indicator'),
            oldQuestions: getDOMElement('old-questions-field-indicator'),
            mcq: getDOMElement('mcq-field-indicator'),
            subjective: getDOMElement('subjective-field-indicator'),
            exam: getDOMElement('exam-field-indicator')
        },

        // Loading indicators
        loading: {
            notice: getDOMElement('notice-loading'),
            syllabus: getDOMElement('syllabus-loading'),
            oldQuestions: getDOMElement('old-questions-loading'),
            mcqSubjects: getDOMElement('mcq-subjects-loading'),
            subjective: getDOMElement('subjective-loading')
        },

        // File lists
        noticeList: getDOMElement('notice-list'),
        syllabusList: getDOMElement('syllabus-list'),
        oldQuestionsList: getDOMElement('old-questions-list'),

        // MCQ elements
        subjectGrid: getDOMElement('subject-grid'),
        mcqPractice: getDOMElement('mcq-practice'),
        chapterSelection: getDOMElement('chapter-selection'),
        chapterGrid: getDOMElement('chapter-grid'),
        chapterSelectionTitle: getDOMElement('chapter-selection-title'),
        mcqSubjectTitle: getDOMElement('mcq-subject-title'),
        mcqQuestionsContainer: getDOMElement('mcq-questions-container'),
        questionsPerPageSelect: getDOMElement('questions-per-page'),
        currentPage: getDOMElement('current-page'),
        totalPages: getDOMElement('total-pages'),
        questionsRange: getDOMElement('questions-range'),
        totalQuestionsCount: getDOMElement('total-questions-count'),
        pageIndicators: getDOMElement('page-indicators'),
        firstPageBtn: getDOMElement('first-page'),
        prevPageBtn: getDOMElement('prev-page'),
        nextPageBtn: getDOMElement('next-page'),
        lastPageBtn: getDOMElement('last-page'),
        backToSubjectsBtn: getDOMElement('back-to-subjects'),
        backToSubjectsFromChapterBtn: getDOMElement('back-to-subjects-from-chapter'),

        // Subjective elements
        subjectiveSetGrid: getDOMElement('subjective-set-grid'),
        subjectiveContent: getDOMElement('subjective-content'),
        subjectiveChapterSelection: getDOMElement('subjective-chapter-selection'),
        subjectiveChapterGrid: getDOMElement('subjective-chapter-grid'),
        subjectiveChapterTitle: getDOMElement('subjective-chapter-title'),
        subjectiveSetTitle: getDOMElement('subjective-set-title'),
        subjectiveQuestionsContainer: getDOMElement('subjective-questions-container'),
        backToSubjectiveSetsBtn: getDOMElement('back-to-subjective-sets'),
        backToSubjectiveSubjectsBtn: getDOMElement('back-to-subjective-subjects'),

        // Exam elements
        examTypeSelection: getDOMElement('exam-type-selection'),
        examSetSelection: getDOMElement('exam-set-selection'),
        subjectiveExam: getDOMElement('subjective-exam'),
        multipleChoiceExam: getDOMElement('multiple-choice-exam'),
        examResults: getDOMElement('exam-results'),
        prevExamQuestion: getDOMElement('prev-exam-question'),
        nextExamQuestion: getDOMElement('next-exam-question'),
        flagExamQuestion: getDOMElement('flag-exam-question'),
        backToExamTypeBtn: getDOMElement('back-to-exam-type'),
        backToExamTypeMcqBtn: getDOMElement('back-to-exam-type-mcq'),
        backToExamTypeResultsBtn: getDOMElement('back-to-exam-type-results'),
        submitSubjectiveExamBtn: getDOMElement('submit-subjective-exam'),
        submitMcqExamBtn: getDOMElement('submit-mcq-exam'),
        viewAnswersBtn: getDOMElement('view-answers'),
        subjectiveExamTitle: getDOMElement('subjective-exam-title'),
        subjectiveExamQuestions: getDOMElement('subjective-exam-questions'),
        multipleChoiceExamTitle: getDOMElement('multiple-choice-exam-title'),
        currentExamQuestion: getDOMElement('current-exam-question'),
        totalExamQuestions: getDOMElement('total-exam-questions'),
        multipleChoiceContainer: getDOMElement('multiple-choice-container'),
        mcqTotalQuestions: getDOMElement('mcq-total-questions'),
        mcqAnsweredQuestions: getDOMElement('mcq-answered-questions'),
        mcqRemainingQuestions: getDOMElement('mcq-remaining-questions')
    };
}

// ==============================================
// GITHUB API FUNCTIONS
// ==============================================

function getGitHubApiUrl(path) {
    const encodedPath = encodeURIComponent(path);
    return `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodedPath}?ref=${GITHUB_CONFIG.branch}`;
}

function getRawFileUrl(path) {
    const encodedPath = encodeURIComponent(path);
    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${encodedPath}`;
}

async function listFilesFromGitHub(folderPath) {
    try {
        const apiUrl = getGitHubApiUrl(folderPath);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`Folder not found: ${folderPath}`);
                return [];
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        const items = Array.isArray(data) ? data : [data];
        const files = items.filter(item => item.type === 'file');
        
        return files.map(file => ({
            name: file.name,
            path: file.path,
            size: file.size,
            download_url: file.download_url,
            html_url: file.html_url,
            type: file.type
        }));
        
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        return [];
    }
}

async function getJsonFileFromGitHub(filePath) {
    try {
        const rawUrl = getRawFileUrl(filePath);
        const response = await fetch(rawUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching JSON file:', error);
        return null;
    }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    if (bytes < 1024) return bytes + ' Bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function extractYearFromFilename(filename) {
    const match = filename.match(/(20\d{2})/);
    return match ? parseInt(match[1]) : new Date().getFullYear();
}

function getFileIconClass(extension) {
    switch (extension.toLowerCase()) {
        case 'pdf': return 'fa-file-pdf';
        case 'doc': case 'docx': return 'fa-file-word';
        case 'xls': case 'xlsx': return 'fa-file-excel';
        case 'ppt': case 'pptx': return 'fa-file-powerpoint';
        case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg': return 'fa-file-image';
        case 'txt': return 'fa-file-alt';
        case 'zip': case 'rar': case '7z': return 'fa-file-archive';
        case 'json': return 'fa-file-code';
        default: return 'fa-file';
    }
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function hideElement(element) {
    if (element) element.style.display = 'none';
}

function showElement(element, display = 'block') {
    if (element) element.style.display = display;
}

// ==============================================
// SEARCH FUNCTIONALITY
// ==============================================

function setupSearch() {
    // Notice search
    const noticeSearch = document.getElementById('notice-search');
    const noticeSearchBtn = document.getElementById('notice-search-btn');
    
    if (noticeSearch && noticeSearchBtn) {
        noticeSearch.addEventListener('input', function() {
            AppState.searchState.notice = this.value.toLowerCase();
            filterFileList('notice-list', AppState.searchState.notice);
        });
        
        noticeSearchBtn.addEventListener('click', function() {
            filterFileList('notice-list', noticeSearch.value.toLowerCase());
        });
        
        // Also trigger on Enter key
        noticeSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterFileList('notice-list', this.value.toLowerCase());
            }
        });
    }
    
    // Syllabus search
    const syllabusSearch = document.getElementById('syllabus-search');
    const syllabusSearchBtn = document.getElementById('syllabus-search-btn');
    
    if (syllabusSearch && syllabusSearchBtn) {
        syllabusSearch.addEventListener('input', function() {
            AppState.searchState.syllabus = this.value.toLowerCase();
            filterFileList('syllabus-list', AppState.searchState.syllabus);
        });
        
        syllabusSearchBtn.addEventListener('click', function() {
            filterFileList('syllabus-list', syllabusSearch.value.toLowerCase());
        });
        
        syllabusSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterFileList('syllabus-list', this.value.toLowerCase());
            }
        });
    }
    
    // Old questions search
    const oldQuestionsSearch = document.getElementById('old-questions-search');
    const oldQuestionsSearchBtn = document.getElementById('old-questions-search-btn');
    
    if (oldQuestionsSearch && oldQuestionsSearchBtn) {
        oldQuestionsSearch.addEventListener('input', function() {
            AppState.searchState.oldQuestions = this.value.toLowerCase();
            filterFileList('old-questions-list', AppState.searchState.oldQuestions);
        });
        
        oldQuestionsSearchBtn.addEventListener('click', function() {
            filterFileList('old-questions-list', oldQuestionsSearch.value.toLowerCase());
        });
        
        oldQuestionsSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterFileList('old-questions-list', this.value.toLowerCase());
            }
        });
    }
}

function filterFileList(listId, searchTerm) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    const items = list.getElementsByTagName('li');
    let visibleCount = 0;
    
    for (let item of items) {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    }
    
    // Update results info
    const resultsInfo = document.getElementById(`${listId.replace('-list', '')}-results-info`);
    if (resultsInfo) {
        if (searchTerm === '') {
            resultsInfo.textContent = `Showing all ${visibleCount} items`;
        } else {
            resultsInfo.textContent = `Found ${visibleCount} items matching "${searchTerm}"`;
        }
    }
}

// ==============================================
// FILE LOADING FUNCTIONS
// ==============================================

async function loadNoticeFiles() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Notice`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        files.sort((a, b) => b.name.localeCompare(a.name));
        
        hideElement(DOM.loading.notice);
        showElement(DOM.noticeList);
        
        if (files.length === 0) {
            DOM.noticeList.innerHTML = '<li style="text-align: center; padding: 2rem;"><p>No notice files available.</p></li>';
            return;
        }
        
        DOM.noticeList.innerHTML = files.map(file => {
            const fileName = file.name;
            const friendlyName = fileName.replace(/\.(pdf|docx|doc|txt)$/i, '').replace(/_/g, ' ');
            const fileSize = formatFileSize(file.size || 0);
            const fileExt = fileName.split('.').pop().toLowerCase();
            const iconClass = getFileIconClass(fileExt);
            
            return `
                <li>
                    <div class="file-info">
                        <div class="file-icon">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="file-details">
                            <h4>${friendlyName}</h4>
                            <p>File | Size: ${fileSize}</p>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-primary" onclick="viewFile('${file.download_url || getRawFileUrl(file.path)}', '${fileName}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary" onclick="downloadFile('${file.download_url || getRawFileUrl(file.path)}', '${fileName}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading notice files:', error);
        hideElement(DOM.loading.notice);
        DOM.noticeList.innerHTML = '<li style="text-align: center; padding: 2rem; color: #e74c3c;"><p>Error loading notice files.</p></li>';
        showElement(DOM.noticeList);
    }
}

async function loadSyllabusFiles() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Syllabus`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        files.sort((a, b) => a.name.localeCompare(b.name));
        
        hideElement(DOM.loading.syllabus);
        showElement(DOM.syllabusList);
        
        if (files.length === 0) {
            DOM.syllabusList.innerHTML = '<li style="text-align: center; padding: 2rem;"><p>No syllabus files available.</p></li>';
            return;
        }
        
        DOM.syllabusList.innerHTML = files.map(file => {
            const fileName = file.name;
            const friendlyName = fileName.replace(/\.(pdf|docx|doc)$/i, '').replace(/_/g, ' ');
            const fileSize = formatFileSize(file.size || 0);
            const fileExt = fileName.split('.').pop().toLowerCase();
            const iconClass = getFileIconClass(fileExt);
            
            return `
                <li>
                    <div class="file-info">
                        <div class="file-icon">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="file-details">
                            <h4>${friendlyName}</h4>
                            <p>File | Size: ${fileSize}</p>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-primary" onclick="viewFile('${file.download_url || getRawFileUrl(file.path)}', '${fileName}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary" onclick="downloadFile('${file.download_url || getRawFileUrl(file.path)}', '${fileName}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading syllabus files:', error);
        hideElement(DOM.loading.syllabus);
        DOM.syllabusList.innerHTML = '<li style="text-align: center; padding: 2rem; color: #e74c3c;"><p>Error loading syllabus files.</p></li>';
        showElement(DOM.syllabusList);
    }
}

async function loadOldQuestionFiles() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Old Questions`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        files.sort((a, b) => {
            const yearA = extractYearFromFilename(a.name);
            const yearB = extractYearFromFilename(b.name);
            return yearB - yearA;
        });
        
        hideElement(DOM.loading.oldQuestions);
        showElement(DOM.oldQuestionsList);
        
        if (files.length === 0) {
            DOM.oldQuestionsList.innerHTML = '<li style="text-align: center; padding: 2rem;"><p>No old question papers available.</p></li>';
            return;
        }
        
        DOM.oldQuestionsList.innerHTML = files.map(file => {
            const fileName = file.name;
            const friendlyName = fileName.replace(/\.(pdf|docx|doc)$/i, '').replace(/_/g, ' ');
            const fileSize = formatFileSize(file.size || 0);
            const year = extractYearFromFilename(fileName);
            const fileExt = fileName.split('.').pop().toLowerCase();
            const iconClass = getFileIconClass(fileExt);
            
            return `
                <li>
                    <div class="file-info">
                        <div class="file-icon">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="file-details">
                            <h4>${friendlyName}</h4>
                            <p>Year: ${year} | Size: ${fileSize}</p>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-primary" onclick="viewFile('${file.download_url || getRawFileUrl(file.path)}', '${fileName}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary" onclick="downloadFile('${file.download_url || getRawFileUrl(file.path)}', '${fileName}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading old questions:', error);
        hideElement(DOM.loading.oldQuestions);
        DOM.oldQuestionsList.innerHTML = '<li style="text-align: center; padding: 2rem; color: #e74c3c;"><p>Error loading old questions.</p></li>';
        showElement(DOM.oldQuestionsList);
    }
}

// ==============================================
// MCQ FUNCTIONS - PAGINATED DISPLAY
// ==============================================

async function loadMCQSubjects() {
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
        
        hideElement(DOM.loading.mcqSubjects);
        showElement(DOM.subjectGrid);
        renderMCQSubjects(subjects);
        
    } catch (error) {
        console.error('Error loading MCQ subjects:', error);
        hideElement(DOM.loading.mcqSubjects);
        showElement(DOM.subjectGrid);
        renderMCQSubjects(FIELD_CONFIG[field].subjects || []);
    }
}

function renderMCQSubjects(subjects) {
    const config = FIELD_CONFIG[AppState.currentField];
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
        DOM.subjectGrid.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No MCQ subjects available.</p></div>';
        return;
    }

    DOM.subjectGrid.innerHTML = subjects.map(subject => `
        <div class="subject-card" data-subject="${subject}">
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
    DOM.subjectGrid.style.display = 'none';
    DOM.chapterSelection.style.display = 'block';
    DOM.chapterSelectionTitle.textContent = `Select Chapter - ${subject}`;
    
    loadMCQChapters(subject).then(chapters => {
        if (chapters.length === 0) {
            DOM.chapterGrid.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No JSON files found for this subject.</p></div>';
            return;
        }
        
        DOM.chapterGrid.innerHTML = chapters.map(chapter => `
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
        
        DOM.mcqQuestionsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading questions from GitHub...</div>';
        
        const questions = await loadMCQQuestions(subject, chapterFileName, chapterDisplayName);
        
        if (questions.length === 0) {
            alert('No questions found in this chapter.');
            return;
        }
        
        AppState.mcqState.questions = questions;
        
        DOM.chapterSelection.style.display = 'none';
        DOM.mcqPractice.style.display = 'block';
        DOM.mcqSubjectTitle.textContent = `${subject} - ${chapterDisplayName}`;
        
        setupPagination();
        renderCurrentPage();
        
    } catch (error) {
        console.error('Error loading chapter questions:', error);
        alert('Failed to load questions. Please check your GitHub repository.');
    }
}

function setupPagination() {
    const questionsPerPage = AppState.mcqState.questionsPerPage;
    const totalQuestions = AppState.mcqState.questions.length;
    const totalPages = questionsPerPage === 'all' ? 1 : Math.ceil(totalQuestions / questionsPerPage);
    
    // Update pagination info
    DOM.totalQuestionsCount.textContent = totalQuestions;
    DOM.totalPages.textContent = totalPages;
    
    // Update questions per page selector
    DOM.questionsPerPageSelect.value = questionsPerPage;
    
    // Generate page indicators
    updatePageIndicators();
    
    // Update pagination buttons state
    updatePaginationButtons();
}

function updatePageIndicators() {
    const currentPage = AppState.mcqState.currentPage;
    const totalPages = DOM.totalPages.textContent;
    
    DOM.pageIndicators.innerHTML = '';
    
    // Show max 5 page indicators
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(parseInt(totalPages), startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            AppState.mcqState.currentPage = i;
            renderCurrentPage();
        });
        DOM.pageIndicators.appendChild(pageBtn);
    }
}

function updatePaginationButtons() {
    const currentPage = AppState.mcqState.currentPage;
    const totalPages = parseInt(DOM.totalPages.textContent);
    
    DOM.firstPageBtn.disabled = currentPage === 1;
    DOM.prevPageBtn.disabled = currentPage === 1;
    DOM.nextPageBtn.disabled = currentPage === totalPages;
    DOM.lastPageBtn.disabled = currentPage === totalPages;
}

function renderCurrentPage() {
    const state = AppState.mcqState;
    const questionsPerPage = state.questionsPerPage;
    const currentPage = state.currentPage;
    const totalQuestions = state.questions.length;
    
    let startIndex, endIndex;
    
    if (questionsPerPage === 'all') {
        startIndex = 0;
        endIndex = totalQuestions;
    } else {
        startIndex = (currentPage - 1) * questionsPerPage;
        endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);
    }
    
    // Update pagination info
    DOM.currentPage.textContent = currentPage;
    DOM.questionsRange.textContent = `${startIndex + 1}-${endIndex}`;
    
    // Render questions
    DOM.mcqQuestionsContainer.innerHTML = '';
    
    for (let i = startIndex; i < endIndex; i++) {
        const question = state.questions[i];
        const questionNumber = i + 1;
        const userAnswer = state.userAnswers[i];
        
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
        
        DOM.mcqQuestionsContainer.appendChild(questionDiv);
        
        // Add event listeners to options
        questionDiv.querySelectorAll('.mcq-option').forEach(option => {
            option.addEventListener('click', function() {
                const questionIndex = parseInt(this.dataset.questionIndex);
                const selectedOption = this.dataset.option;
                handleMCQOptionClick(questionIndex, selectedOption, this);
            });
        });
    }
    
    // Update pagination controls
    updatePageIndicators();
    updatePaginationButtons();
}

function handleMCQOptionClick(questionIndex, selectedOption, optionElement) {
    const question = AppState.mcqState.questions[questionIndex];
    const optionsContainer = optionElement.parentElement;
    const explanationElement = document.getElementById(`explanation-${questionIndex}`);
    
    // Remove all selected/correct/incorrect classes
    optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Add selected class to clicked option
    optionElement.classList.add('selected');
    
    // Store user answer
    AppState.mcqState.userAnswers[questionIndex] = selectedOption;
    
    // Show explanation
    explanationElement.classList.add('show');
    
    // Mark correct/incorrect
    if (selectedOption === question.correct) {
        optionElement.classList.add('correct');
    } else {
        optionElement.classList.add('incorrect');
        // Highlight correct answer
        optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
            if (opt.dataset.option === question.correct) {
                opt.classList.add('correct');
            }
        });
    }
}

// ==============================================
// SUBJECTIVE FUNCTIONS
// ==============================================

async function loadSubjectiveSubjects() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Subjective`;
    
    try {
        const apiUrl = getGitHubApiUrl(folderPath);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            return FIELD_CONFIG[field].subjects || [];
        }
        
        const data = await response.json();
        
        const subjects = data
            .filter(item => item.type === 'dir')
            .map(item => item.name)
            .sort();
        
        return subjects.length > 0 ? subjects : FIELD_CONFIG[field].subjects;
        
    } catch (error) {
        console.error('Error loading subjective subjects:', error);
        return FIELD_CONFIG[field].subjects || [];
    }
}

async function loadSubjectiveChapters(subject) {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Subjective/${subject}`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        const validExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif'];
        const chapters = files
            .filter(file => {
                const ext = file.name.toLowerCase();
                return validExtensions.some(validExt => ext.endsWith(validExt));
            })
            .map(file => {
                const fileName = file.name;
                const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
                return {
                    name: baseName,
                    fileName: fileName,
                    extension: fileName.split('.').pop().toLowerCase()
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
        
        return chapters;
        
    } catch (error) {
        console.error(`Error loading subjective chapters for ${subject}:`, error);
        return [];
    }
}

async function renderSubjectiveSets() {
    const subjects = await loadSubjectiveSubjects();
    
    hideElement(DOM.loading.subjective);
    showElement(DOM.subjectiveSetGrid);
    
    if (subjects.length === 0) {
        DOM.subjectiveSetGrid.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No subjective materials available.</p></div>';
        return;
    }
    
    DOM.subjectiveSetGrid.innerHTML = subjects.map(subject => `
        <div class="subject-card" data-subject="${subject}">
            <i class="fas fa-book-open"></i>
            <h3>${subject}</h3>
            <p>Read subjective questions and answers</p>
        </div>
    `).join('');
}

function showSubjectiveChapterSelection(subject) {
    DOM.subjectiveSetGrid.style.display = 'none';
    DOM.subjectiveChapterSelection.style.display = 'block';
    DOM.subjectiveChapterTitle.textContent = `Select Chapter - ${subject}`;
    
    loadSubjectiveChapters(subject).then(chapters => {
        if (chapters.length === 0) {
            DOM.subjectiveChapterGrid.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No files found for this subject.</p></div>';
            return;
        }
        
        DOM.subjectiveChapterGrid.innerHTML = chapters.map(chapter => {
            const iconClass = getFileIconClass(chapter.extension);
            return `
                <div class="subject-card" data-chapter="${chapter.name}" data-subject="${subject}" data-filename="${chapter.fileName}">
                    <i class="fas ${iconClass}"></i>
                    <h3>${chapter.name}</h3>
                    <p>${subject} - ${chapter.name}</p>
                </div>
            `;
        }).join('');
    });
}

async function viewSubjectiveContent(subject, chapter, fileName) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Subjective/${subject}/${fileName}`;
    
    AppState.subjectiveState.currentSubject = subject;
    AppState.subjectiveState.currentChapter = chapter;
    
    try {
        const fileUrl = getRawFileUrl(filePath);
        const fileExt = fileName ? fileName.split('.').pop().toLowerCase() : 'pdf';
        
        DOM.subjectiveChapterSelection.style.display = 'none';
        DOM.subjectiveContent.style.display = 'block';
        DOM.subjectiveSetTitle.textContent = `${subject} - ${chapter}`;
        
        let contentHtml = '';
        
        if (['pdf'].includes(fileExt)) {
            contentHtml = `
                <div style="background-color: white; padding: 1rem; border-radius: var(--border-radius); height: 500px;">
                    <iframe src="${fileUrl}" width="100%" height="100%" frameborder="0">
                        Your browser does not support PDF viewing. 
                        <a href="${fileUrl}" target="_blank">Download PDF</a>
                    </iframe>
                </div>
            `;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
            contentHtml = `
                <div style="text-align: center;">
                    <img src="${fileUrl}" alt="${chapter}" style="max-width: 100%; max-height: 500px; border-radius: var(--border-radius);">
                </div>
            `;
        } else if (['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(fileExt)) {
            contentHtml = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-file-${fileExt === 'ppt' || fileExt === 'pptx' ? 'powerpoint' : fileExt === 'doc' || fileExt === 'docx' ? 'word' : 'excel'} fa-5x" style="color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <h4>${chapter}</h4>
                    <p>This is a ${fileExt.toUpperCase()} file. You can download it to view the content.</p>
                    <button class="btn btn-primary" onclick="downloadFile('${fileUrl}', '${fileName}')">
                        <i class="fas fa-download"></i> Download ${fileExt.toUpperCase()} File
                    </button>
                </div>
            `;
        } else {
            contentHtml = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-file fa-5x" style="color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <h4>${chapter}</h4>
                    <p>This file format cannot be previewed directly. Please download it to view.</p>
                    <button class="btn btn-primary" onclick="downloadFile('${fileUrl}', '${fileName}')">
                        <i class="fas fa-download"></i> Download File
                    </button>
                </div>
            `;
        }
        
        DOM.subjectiveQuestionsContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <p><i class="fas fa-info-circle"></i> Reading subjective questions for ${subject} - ${chapter}</p>
            </div>
            ${contentHtml}
        `;
        
    } catch (error) {
        console.error('Error loading subjective content:', error);
        DOM.subjectiveQuestionsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #e74c3c;">
                <p><i class="fas fa-exclamation-triangle"></i> Unable to load file from GitHub.</p>
                <button class="btn btn-primary" onclick="goBackToSubjectiveChapters()">
                    <i class="fas fa-arrow-left"></i> Back to Chapters
                </button>
            </div>
        `;
    }
}

// ==============================================
// ENHANCED SUBJECTIVE LIBRARY FUNCTIONS
// ==============================================

// Color palette for book covers
const BOOK_COLORS = [
    { bg: 'linear-gradient(45deg, #1a237e, #283593)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #b71c1c, #d32f2f)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #1b5e20, #388e3c)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #f57c00, #ff9800)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #6a1b9a, #8e24aa)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #006064, #00838f)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #4a148c, #7b1fa2)', text: '#ffffff' },
    { bg: 'linear-gradient(45deg, #004d40, #00796b)', text: '#ffffff' }
];

// State for image gallery
let imageGalleryState = {
    currentImageIndex: 0,
    imageUrls: [],
    totalImages: 0
};

async function renderBookshelf() {
    const subjects = await loadSubjectiveSubjects();
    
    if (subjects.length === 0) {
        document.getElementById('subjective-loading').innerHTML = 
            '<div style="text-align: center; padding: 3rem;"><p>No books available in the library.</p></div>';
        return;
    }
    
    // Hide loading, show bookshelf
    hideElement(DOM.loading.subjective);
    showElement(document.getElementById('bookshelf-view'));
    
    // Get all books from all subjects
    const allBooks = [];
    
    // Load books from each subject
    for (const subject of subjects) {
        const chapters = await loadSubjectiveChapters(subject);
        
        chapters.forEach((chapter, index) => {
            const colorIndex = index % BOOK_COLORS.length;
            allBooks.push({
                ...chapter,
                subject,
                color: BOOK_COLORS[colorIndex],
                id: `${subject}_${chapter.name}_${index}`
            });
        });
    }
    
    // Render bookshelf
    const bookshelfGrid = document.getElementById('bookshelf-grid');
    
    if (allBooks.length === 0) {
        bookshelfGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-book fa-3x" style="color: #ddd; margin-bottom: 1rem;"></i>
                <p>No books found in the library.</p>
            </div>
        `;
        return;
    }
    
    // Sort books by name
    allBooks.sort((a, b) => a.name.localeCompare(b.name));
    
    // Render book cards
    bookshelfGrid.innerHTML = allBooks.map(book => {
        const fileName = book.fileName;
        const fileExt = book.extension;
        const bookAbbr = book.name.split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase())
            .slice(0, 3)
            .join('');
        
        return `
            <div class="book-card" 
                 data-book-id="${book.id}"
                 data-subject="${book.subject}"
                 data-chapter="${book.name}"
                 data-filename="${fileName}"
                 data-extension="${fileExt}">
                <div class="book-cover" style="background: ${book.color.bg}; color: ${book.color.text};">
                    ${bookAbbr}
                </div>
                <div class="book-info">
                    <div class="book-title">${book.name}</div>
                    <div class="book-subtitle">${book.subject}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click event listeners to books
    bookshelfGrid.querySelectorAll('.book-card').forEach(bookCard => {
        bookCard.addEventListener('click', () => {
            const subject = bookCard.dataset.subject;
            const chapter = bookCard.dataset.chapter;
            const fileName = bookCard.dataset.filename;
            const fileExt = bookCard.dataset.extension;
            
            openBookReader(subject, chapter, fileName, fileExt);
        });
    });
}

async function openBookReader(subject, chapter, fileName, fileExt) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Subjective/${subject}/${fileName}`;
    const fileUrl = getRawFileUrl(filePath);
    
    // Hide bookshelf, show reader
    document.getElementById('bookshelf-view').style.display = 'none';
    document.getElementById('book-reader').style.display = 'block';
    
    // Update reader header
    document.getElementById('reader-book-title').textContent = chapter;
    document.getElementById('reader-book-meta').textContent = 
        `${subject} • ${fileExt.toUpperCase()} • ${await getFileSize(filePath)}`;
    
    // Hide all content containers first
    document.getElementById('pdf-viewer').style.display = 'none';
    document.getElementById('image-gallery').style.display = 'none';
    document.getElementById('file-options').style.display = 'none';
    
    // Handle different file types
    if (fileExt === 'pdf') {
        // PDF Viewer
        document.getElementById('pdf-viewer').style.display = 'block';
        document.getElementById('pdf-frame').src = fileUrl;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
        // Image Viewer
        document.getElementById('image-gallery').style.display = 'block';
        
        // Check if there are multiple images in the same folder
        const allImages = await getFolderImages(subject, fileName);
        
        if (allImages.length > 1) {
            // Multiple images - show gallery
            imageGalleryState = {
                currentImageIndex: allImages.findIndex(img => img.fileName === fileName),
                imageUrls: allImages.map(img => getRawFileUrl(img.path)),
                totalImages: allImages.length
            };
            
            document.getElementById('multiple-images').style.display = 'block';
            document.getElementById('book-image').style.display = 'none';
            updateImageGallery();
        } else {
            // Single image
            document.getElementById('multiple-images').style.display = 'none';
            document.getElementById('book-image').style.display = 'block';
            document.getElementById('book-image').src = fileUrl;
        }
    } else {
        // Other file types - show download option
        document.getElementById('file-options').style.display = 'block';
        document.getElementById('file-preview').innerHTML = `
            <i class="fas fa-file-${getFileIconClass(fileExt)} fa-5x" style="color: var(--primary-color);"></i>
            <h4 style="margin-top: 1rem;">${chapter}</h4>
            <p>This is a ${fileExt.toUpperCase()} file. Download to view.</p>
        `;
        
        // Set up download button
        document.getElementById('download-file-btn').onclick = () => downloadFile(fileUrl, fileName);
    }
}

async function getFileSize(filePath) {
    try {
        const apiUrl = getGitHubApiUrl(filePath);
        const response = await fetch(apiUrl);
        const data = await response.json();
        return formatFileSize(data.size || 0);
    } catch (error) {
        return 'Unknown size';
    }
}

async function getFolderImages(subject, currentFileName) {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Subjective/${subject}`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        const imageFiles = files.filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
        }).sort((a, b) => a.name.localeCompare(b.name));
        
        return imageFiles;
    } catch (error) {
        return [];
    }
}

function updateImageGallery() {
    const state = imageGalleryState;
    if (state.totalImages === 0) return;
    
    document.getElementById('current-image').src = state.imageUrls[state.currentImageIndex];
    document.getElementById('current-image-num').textContent = state.currentImageIndex + 1;
    document.getElementById('total-images').textContent = state.totalImages;
    
    // Update button states
    document.getElementById('prev-image').disabled = state.currentImageIndex === 0;
    document.getElementById('next-image').disabled = state.currentImageIndex === state.totalImages - 1;
}

// Initialize enhanced subjective section
async function initEnhancedSubjective() {
    // Replace original subjective loading
    await renderBookshelf();
    
    // Setup event listeners
    setupBookReaderEvents();
}

function setupBookReaderEvents() {
    // Close reader button
    document.getElementById('close-reader')?.addEventListener('click', () => {
        document.getElementById('book-reader').style.display = 'none';
        document.getElementById('bookshelf-view').style.display = 'block';
    });
    
    // Back to library button
    document.getElementById('back-to-library')?.addEventListener('click', () => {
        document.getElementById('book-reader').style.display = 'none';
        document.getElementById('bookshelf-view').style.display = 'block';
    });
    
    // Image gallery navigation
    document.getElementById('prev-image')?.addEventListener('click', () => {
        if (imageGalleryState.currentImageIndex > 0) {
            imageGalleryState.currentImageIndex--;
            updateImageGallery();
        }
    });
    
    document.getElementById('next-image')?.addEventListener('click', () => {
        if (imageGalleryState.currentImageIndex < imageGalleryState.totalImages - 1) {
            imageGalleryState.currentImageIndex++;
            updateImageGallery();
        }
    });
    
    // Keyboard navigation for image gallery
    document.addEventListener('keydown', (e) => {
        const readerVisible = document.getElementById('book-reader').style.display === 'block';
        if (!readerVisible) return;
        
        if (e.key === 'ArrowLeft' && imageGalleryState.currentImageIndex > 0) {
            imageGalleryState.currentImageIndex--;
            updateImageGallery();
            e.preventDefault();
        } else if (e.key === 'ArrowRight' && imageGalleryState.currentImageIndex < imageGalleryState.totalImages - 1) {
            imageGalleryState.currentImageIndex++;
            updateImageGallery();
            e.preventDefault();
        } else if (e.key === 'Escape') {
            document.getElementById('book-reader').style.display = 'none';
            document.getElementById('bookshelf-view').style.display = 'block';
        }
    });
}

// ==============================================
// PAYMENT SYSTEM
// ==============================================

const PAYMENT_CONFIG = {
    prices: {
        subjective: 100,
        mcq: 50
    },
    esewa: {
        merchantId: 'EPAYTEST',
        serviceCode: 'EPAYTEST',
        endpoint: 'https://uat.esewa.com.np/epay/main',
        testMode: true
    },
    khalti: {
        publicKey: 'test_public_key_dc74e0fd57cb46cd93832aee0a507256',
        endpoint: 'https://a.khalti.com/api/v2/epayment/initiate/',
        testMode: true
    }
};

const purchasedSets = {
    subjective: JSON.parse(localStorage.getItem('purchasedSubjectiveSets') || '[]'),
    mcq: JSON.parse(localStorage.getItem('purchasedMCQSets') || '[]')
};

function initPaymentSystem() {
    console.log("Payment system initialized");
}

function savePurchasedSets() {
    localStorage.setItem('purchasedSubjectiveSets', JSON.stringify(purchasedSets.subjective));
    localStorage.setItem('purchasedMCQSets', JSON.stringify(purchasedSets.mcq));
}

function isSetPurchased(examType, setName) {
    return purchasedSets[examType].includes(setName);
}

function markSetAsPurchased(examType, setName) {
    if (!purchasedSets[examType].includes(setName)) {
        purchasedSets[examType].push(setName);
        savePurchasedSets();
        console.log(`Set ${setName} marked as purchased for ${examType}`);
    }
}

function showPaymentModal(examType, examSet) {
    console.log("Showing payment modal for:", examType, examSet);
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3>Purchase Exam Set</h3>
                <button class="close-payment-modal">&times;</button>
            </div>
            <div class="payment-modal-body">
                <div class="payment-info">
                    <h4>${examSet.displayName}</h4>
                    <p>${examType === 'subjective' ? 'Subjective Exam (3 hours)' : 'Multiple Choice Exam (30 minutes)'}</p>
                    <div class="payment-amount">
                        NPR ${examType === 'subjective' ? PAYMENT_CONFIG.prices.subjective : PAYMENT_CONFIG.prices.mcq}
                    </div>
                    <div class="payment-currency">(Demo Payment System)</div>
                </div>
                
                <div class="payment-options">
                    <div class="payment-option selected" data-gateway="esewa">
                        <div class="payment-option-icon esewa-icon">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <div class="payment-option-info">
                            <div class="payment-option-name">Pay with eSewa</div>
                            <div class="payment-option-desc">Fast and secure payment</div>
                        </div>
                        <i class="fas fa-check-circle" style="color: var(--secondary-color);"></i>
                    </div>
                    
                    <div class="payment-option" data-gateway="khalti">
                        <div class="payment-option-icon khalti-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="payment-option-info">
                            <div class="payment-option-name">Pay with Khalti</div>
                            <div class="payment-option-desc">Mobile wallet payment</div>
                        </div>
                        <i class="fas fa-circle" style="color: #ddd;"></i>
                    </div>
                </div>
                
                <div class="payment-form">
                    <div class="form-group">
                        <label for="phone">Mobile Number</label>
                        <input type="tel" id="phone" placeholder="98XXXXXXXX" value="9800000000">
                        <small>Demo: Use 9800000000 for testing</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" placeholder="your@email.com" value="test@example.com">
                    </div>
                </div>
                
                <div class="demo-notice">
                    <i class="fas fa-info-circle"></i> This is a demo payment system. No real transaction will occur.
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="btn btn-secondary" id="cancel-payment" style="flex: 1;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn btn-primary" id="proceed-payment" style="flex: 2;">
                        <i class="fas fa-lock"></i> Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set selected payment gateway
    let selectedGateway = 'esewa';
    
    // Payment option selection
    modal.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            modal.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.fa-check-circle').className = 'fas fa-circle';
                opt.querySelector('.fa-circle').style.color = '#ddd';
            });
            
            option.classList.add('selected');
            option.querySelector('.fa-circle').className = 'fas fa-check-circle';
            option.querySelector('.fa-check-circle').style.color = 'var(--secondary-color)';
            selectedGateway = option.dataset.gateway;
        });
    });
    
    // Close modal
    modal.querySelector('.close-payment-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-payment').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Proceed to payment
    modal.querySelector('#proceed-payment').addEventListener('click', () => {
        processPayment(selectedGateway, examType, examSet, modal);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function processPayment(gateway, examType, examSet, modal) {
    const phone = modal.querySelector('#phone').value;
    const email = modal.querySelector('#email').value;
    const amount = examType === 'subjective' ? PAYMENT_CONFIG.prices.subjective : PAYMENT_CONFIG.prices.mcq;
    
    // Show loading
    modal.querySelector('.payment-modal-body').innerHTML = `
        <div class="payment-loading">
            <div class="payment-spinner"></div>
            <p>Processing ${gateway === 'esewa' ? 'eSewa' : 'Khalti'} payment...</p>
            <p class="demo-notice" style="margin-top: 1rem;">
                <i class="fas fa-info-circle"></i> Demo mode: Simulating payment process
            </p>
        </div>
    `;
    
    // Simulate payment processing
    setTimeout(() => {
        // For demo, always succeed
        const success = true; // 100% success rate for demo
        
        if (success) {
            // Payment successful
            modal.querySelector('.payment-modal-body').innerHTML = `
                <div class="payment-status">
                    <div class="payment-status-icon payment-success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 class="payment-success">Payment Successful!</h3>
                    <p>Your payment of NPR ${amount} has been processed successfully.</p>
                    <p>Transaction ID: ${generateTransactionId()}</p>
                    <div class="demo-notice" style="margin-top: 1rem;">
                        <i class="fas fa-info-circle"></i> This is a demo transaction. No real money was transferred.
                    </div>
                    <button class="btn btn-primary" id="access-exam" style="margin-top: 2rem; padding: 0.8rem 2rem;">
                        <i class="fas fa-book-open"></i> Access Exam Set
                    </button>
                </div>
            `;
            
            // Mark as purchased
            markSetAsPurchased(examType === 'subjective' ? 'subjective' : 'mcq', examSet.displayName);
            
            // Access exam button
            modal.querySelector('#access-exam').addEventListener('click', () => {
                document.body.removeChild(modal);
                if (examType === 'subjective') {
                    openSubjectiveExamAfterPayment(examSet);
                } else {
                    openMCQExamAfterPayment(examSet);
                }
            });
            
        } else {
            // Payment failed
            modal.querySelector('.payment-modal-body').innerHTML = `
                <div class="payment-status">
                    <div class="payment-status-icon payment-error">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <h3 class="payment-error">Payment Failed</h3>
                    <p>Your payment could not be processed. Please try again.</p>
                    <div class="demo-notice" style="margin-top: 1rem;">
                        <i class="fas fa-info-circle"></i> Demo: This is a simulated failure
                    </div>
                    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                        <button class="btn btn-secondary" id="try-again" style="flex: 1;">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                        <button class="btn btn-primary" id="cancel-failed" style="flex: 1;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            `;
            
            modal.querySelector('#try-again').addEventListener('click', () => {
                document.body.removeChild(modal);
                showPaymentModal(examType, examSet);
            });
            
            modal.querySelector('#cancel-failed').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
    }, 2000);
}

function generateTransactionId() {
    const prefix = 'TXN';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

async function openSubjectiveExamAfterPayment(selectedSet) {
    try {
        AppState.examState.type = 'subjective';
        AppState.examState.currentSet = selectedSet.displayName;
        AppState.examState.currentFileName = selectedSet.fileName;
        AppState.examState.totalTime = 3 * 60 * 60;
        
        DOM.examSetSelection.style.display = 'none';
        DOM.subjectiveExam.style.display = 'block';
        DOM.subjectiveExamTitle.textContent = `Subjective Exam - ${selectedSet.displayName}`;
        
        await loadSubjectiveExamContent(selectedSet.fileName, selectedSet.displayName);
        startTimer('subjective');
        
    } catch (error) {
        console.error('Error opening subjective exam after payment:', error);
        alert('Error opening exam. Please try again.');
    }
}

async function openMCQExamAfterPayment(selectedSet) {
    try {
        AppState.examState.type = 'multiple-choice';
        AppState.examState.currentSet = selectedSet.displayName;
        AppState.examState.currentFileName = selectedSet.fileName;
        AppState.examState.currentQuestionIndex = 0;
        AppState.examState.answers = {};
        AppState.examState.flagged = {};
        AppState.examState.totalTime = 30 * 60;
        
        AppState.examState.questions = await loadMCQExam(selectedSet.fileName, selectedSet.displayName);
        
        if (AppState.examState.questions.length === 0) {
            throw new Error('No questions loaded');
        }
        
        DOM.examSetSelection.style.display = 'none';
        DOM.multipleChoiceExam.style.display = 'block';
        DOM.multipleChoiceExamTitle.textContent = `Multiple Choice Exam - ${selectedSet.displayName}`;
        
        loadMCQExamQuestion();
        startTimer('mcq');
        
    } catch (error) {
        console.error('Error opening MCQ exam after payment:', error);
        alert(`Failed to load exam questions from ${selectedSet.fileName}.`);
    }
}

// ==============================================
// EXAM FUNCTIONS
// ==============================================

async function discoverMCQExamSets() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        const examSets = [];
        
        files.forEach(file => {
            const fileName = file.name;
            if (fileName.toLowerCase().endsWith('.json')) {
                const setName = fileName.replace(/\.json$/i, '').replace(/_/g, ' ').trim();
                examSets.push({
                    name: setName || fileName.replace('.json', ''),
                    fileName: fileName,
                    displayName: setName || fileName.replace('.json', ''),
                    isFree: examSets.length < 2,
                    price: 50
                });
            }
        });
        
        examSets.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        return examSets;
        
    } catch (error) {
        console.error('Error discovering MCQ sets:', error);
        return [];
    }
}

async function discoverSubjectiveExamSets() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Subjective Exam`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        const examSets = [];
        
        files.forEach(file => {
            const fileName = file.name;
            if (fileName.toLowerCase().endsWith('.json')) {
                const setName = fileName.replace(/\.json$/i, '').replace(/_/g, ' ').trim();
                examSets.push({
                    name: setName || fileName.replace('.json', ''),
                    fileName: fileName,
                    displayName: setName || fileName.replace('.json', ''),
                    isFree: examSets.length < 2,
                    price: 100
                });
            }
        });
        
        examSets.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        return examSets;
        
    } catch (error) {
        console.error('Error discovering subjective exam sets:', error);
        return [];
    }
}

async function loadMCQExam(fileName, displayName) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam/${fileName}`;
    
    try {
        const jsonData = await getJsonFileFromGitHub(filePath);
        
        if (!jsonData) {
            throw new Error('No JSON data received');
        }
        
        let questions = [];
        
        if (Array.isArray(jsonData)) {
            questions = jsonData.map((q, index) => ({
                id: `exam_${fileName}_${index}`,
                question: q.question || `Question ${index + 1}`,
                options: q.options || ["Option A", "Option B", "Option C", "Option D"],
                correct: q.correct || "A",
                explanation: q.explanation || "No explanation provided"
            }));
        } else {
            questions = [{
                id: `exam_${fileName}_0`,
                question: "Check your exam JSON file format.",
                options: ["Should be direct array", "Not nested objects", "Simple array format", "Check documentation"],
                correct: "Should be direct array",
                explanation: "Your exam JSON should be a direct array of question objects."
            }];
        }
        
        if (questions.length === 0) {
            questions = [{
                id: `exam_${fileName}_0`,
                question: "No questions found in exam set.",
                options: ["Check JSON format", "Add questions", "Verify file", "Contact admin"],
                correct: "Check JSON format",
                explanation: "Make sure your exam JSON file contains questions."
            }];
        }
        
        return questions;
        
    } catch (error) {
        console.error('Error loading MCQ exam:', error);
        return [{
            id: `exam_${fileName}_0`,
            question: `Error loading exam: ${displayName}`,
            options: ["JSON file not found", "Check GitHub", "Verify file exists", "Contact admin"],
            correct: "JSON file not found",
            explanation: `Could not load ${fileName} from your GitHub repository.`
        }];
    }
}

async function loadSubjectiveExamContent(fileName, displayName) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Subjective Exam/${fileName}`;
    
    try {
        const jsonData = await getJsonFileFromGitHub(filePath);
        
        if (!jsonData) {
            throw new Error('No JSON data received');
        }
        
        let contentHtml = '';
        let totalQuestions = 0;
        let totalMarks = 0;
        
        if (Array.isArray(jsonData)) {
            // Exam instructions
            contentHtml = `
                <div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8f9fa; border-radius: var(--border-radius);">
                    <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Exam Instructions:</h4>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem;">
                        <li>Answer all questions in the answer booklet provided</li>
                        <li>Write your roll number on every answer sheet</li>
                        <li>Time: 3 hours (180 minutes)</li>
                        <li>Use black or blue pen only</li>
                        <li>Show all calculations and assumptions clearly</li>
                    </ul>
                </div>
            `;
            
            let currentCategory = 'General Questions';
            
            jsonData.forEach((item, index) => {
                if (typeof item['S.N.'] === 'string') {
                    // Category header
                    currentCategory = item['S.N.'];
                    contentHtml += `
                        <div class="category-header">
                            ${currentCategory}
                        </div>
                    `;
                } else if (typeof item['S.N.'] === 'number') {
                    // Question
                    totalQuestions++;
                    const marks = item['Marks'] || 0;
                    totalMarks += marks;
                    
                    contentHtml += `
                        <div class="subjective-question-item">
                            <div class="subjective-question-header">
                                <div class="question-number-circle">${item['S.N.']}</div>
                                <div class="subjective-question-text">${item['Questions ?'] || 'Question'}</div>
                            </div>
                            <div class="question-marks">
                                <i class="fas fa-star"></i> Marks: ${marks}
                            </div>
                        </div>
                    `;
                }
            });
            
            if (totalQuestions === 0) {
                contentHtml += `
                    <div style="text-align: center; padding: 3rem; color: #666;">
                        <i class="fas fa-exclamation-triangle fa-3x" style="margin-bottom: 1rem; color: #e74c3c;"></i>
                        <h4>No Questions Found</h4>
                        <p>The JSON file format might be incorrect.</p>
                    </div>
                `;
            }
        } else {
            contentHtml = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-exclamation-triangle fa-3x" style="color: #e74c3c; margin-bottom: 1rem;"></i>
                    <h4>Invalid JSON Format</h4>
                    <p>The file doesn't contain a valid array of questions.</p>
                </div>
            `;
        }
        
        DOM.subjectiveExamQuestions.innerHTML = contentHtml;
        
        document.getElementById('subjective-total-questions').textContent = totalQuestions;
        document.getElementById('subjective-total-marks').textContent = totalMarks;
        
    } catch (error) {
        console.error('Error loading exam content:', error);
        DOM.subjectiveExamQuestions.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle fa-3x" style="margin-bottom: 1rem;"></i>
                <h4>Unable to Load Exam</h4>
                <p>Error: ${error.message}</p>
                <p>File: ${fileName}</p>
            </div>
        `;
    }
}

function showMCQExamSetSelection() {
    discoverMCQExamSets().then(examSets => {
        if (examSets.length === 0) {
            alert('No exam sets found. Please upload JSON files to your "Take Exam/Multiple Choice Exam/" folder.');
            resetExamTypeSelection();
            return;
        }
        
        DOM.examTypeSelection.style.display = 'none';
        DOM.examSetSelection.style.display = 'block';
        
        DOM.examSetSelection.innerHTML = `
            <h3>Select Exam Set:</h3>
            <div class="subject-grid" style="margin-top: 1.5rem;" id="mcq-exam-set-grid">
                ${examSets.map((set, index) => {
                    const isPurchased = isSetPurchased('mcq', set.displayName);
                    const canAccess = set.isFree || isPurchased;
                    const cardClass = canAccess ? '' : 'locked-set';
                    const priceBadge = set.isFree 
                        ? '<span class="demo-badge">FREE</span>' 
                        : `<span class="paid-badge">NPR ${set.price}</span>`;
                    
                    return `
                        <div class="subject-card ${cardClass}" 
                             data-exam-index="${index}" 
                             data-set-name="${set.displayName}" 
                             data-is-free="${set.isFree}" 
                             data-can-access="${canAccess}"
                             data-exam-type="mcq">
                            ${!canAccess ? '<div class="lock-badge"><i class="fas fa-lock"></i></div>' : ''}
                            <i class="fas fa-file-alt"></i>
                            <h3>${set.displayName}</h3>
                            <p>Multiple Choice Exam</p>
                            <small>30 minutes • ${priceBadge}</small>
                            ${!canAccess ? '<p style="color: var(--accent-color); margin-top: 0.5rem; font-size: 0.9rem;"><i class="fas fa-lock"></i> Requires Purchase</p>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="demo-notice" style="margin-top: 1.5rem;">
                <i class="fas fa-info-circle"></i> First 2 sets are free. Others require purchase. Demo payment system enabled.
            </div>
            <button class="btn btn-secondary" id="back-to-exam-type-from-set" style="margin-top: 1.5rem;">
                <i class="fas fa-arrow-left"></i> Back to Exam Type
            </button>
        `;
        
        AppState.examState.mcqSets = examSets;
        
        setTimeout(() => {
            document.querySelectorAll('#mcq-exam-set-grid .subject-card').forEach(card => {
                card.addEventListener('click', async () => {
                    const setIndex = parseInt(card.dataset.examIndex);
                    const selectedSet = examSets[setIndex];
                    const canAccess = card.dataset.canAccess === 'true';
                    
                    if (canAccess) {
                        await loadAndStartMCQExam(selectedSet);
                    } else {
                        showPaymentModal('mcq', selectedSet);
                    }
                });
            });
            
            document.getElementById('back-to-exam-type-from-set').addEventListener('click', resetExamTypeSelection);
        }, 100);
    });
}

function showSubjectiveExamSetSelection() {
    discoverSubjectiveExamSets().then(examSets => {
        if (examSets.length === 0) {
            alert('No subjective exam sets available. Please upload JSON files to your "Take Exam/Subjective Exam/" folder.');
            resetExamTypeSelection();
            return;
        }
        
        DOM.examTypeSelection.style.display = 'none';
        DOM.examSetSelection.style.display = 'block';
        
        DOM.examSetSelection.innerHTML = `
            <h3>Select Exam Set:</h3>
            <div class="subject-grid" style="margin-top: 1.5rem;" id="subjective-exam-set-grid">
                ${examSets.map((set, index) => {
                    const isPurchased = isSetPurchased('subjective', set.displayName);
                    const canAccess = set.isFree || isPurchased;
                    const cardClass = canAccess ? '' : 'locked-set';
                    const priceBadge = set.isFree 
                        ? '<span class="demo-badge">FREE</span>' 
                        : `<span class="paid-badge">NPR ${set.price}</span>`;
                    
                    return `
                        <div class="subject-card ${cardClass}" 
                             data-exam-index="${index}" 
                             data-set-name="${set.displayName}" 
                             data-is-free="${set.isFree}" 
                             data-can-access="${canAccess}"
                             data-exam-type="subjective">
                            ${!canAccess ? '<div class="lock-badge"><i class="fas fa-lock"></i></div>' : ''}
                            <i class="fas fa-file-pdf"></i>
                            <h3>${set.displayName}</h3>
                            <p>Subjective Exam</p>
                            <small>3 hours • ${priceBadge}</small>
                            ${!canAccess ? '<p style="color: var(--accent-color); margin-top: 0.5rem; font-size: 0.9rem;"><i class="fas fa-lock"></i> Requires Purchase</p>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="demo-notice" style="margin-top: 1.5rem;">
                <i class="fas fa-info-circle"></i> First 2 sets are free. Others require purchase. Demo payment system enabled.
            </div>
            <button class="btn btn-secondary" id="back-to-exam-type-from-subjective-set" style="margin-top: 1.5rem;">
                <i class="fas fa-arrow-left"></i> Back to Exam Type
            </button>
        `;
        
        AppState.examState.subjectiveSets = examSets;
        
        setTimeout(() => {
            document.querySelectorAll('#subjective-exam-set-grid .subject-card').forEach(card => {
                card.addEventListener('click', async () => {
                    const setIndex = parseInt(card.dataset.examIndex);
                    const selectedSet = examSets[setIndex];
                    const canAccess = card.dataset.canAccess === 'true';
                    
                    if (canAccess) {
                        await loadAndStartSubjectiveExam(selectedSet);
                    } else {
                        showPaymentModal('subjective', selectedSet);
                    }
                });
            });
            
            document.getElementById('back-to-exam-type-from-subjective-set').addEventListener('click', resetExamTypeSelection);
        }, 100);
    });
}

async function loadAndStartMCQExam(selectedSet) {
    try {
        AppState.examState.type = 'multiple-choice';
        AppState.examState.currentSet = selectedSet.displayName;
        AppState.examState.currentFileName = selectedSet.fileName;
        AppState.examState.currentQuestionIndex = 0;
        AppState.examState.answers = {};
        AppState.examState.flagged = {};
        AppState.examState.totalTime = 30 * 60;
        
        AppState.examState.questions = await loadMCQExam(selectedSet.fileName, selectedSet.displayName);
        
        if (AppState.examState.questions.length === 0) {
            throw new Error('No questions loaded');
        }
        
        DOM.examSetSelection.style.display = 'none';
        DOM.multipleChoiceExam.style.display = 'block';
        DOM.multipleChoiceExamTitle.textContent = `Multiple Choice Exam - ${selectedSet.displayName}`;
        
        loadMCQExamQuestion();
        startTimer('mcq');
        
    } catch (error) {
        console.error('Error loading exam set:', error);
        alert(`Failed to load exam questions from ${selectedSet.fileName}.`);
    }
}

async function loadAndStartSubjectiveExam(selectedSet) {
    AppState.examState.type = 'subjective';
    AppState.examState.currentSet = selectedSet.displayName;
    AppState.examState.currentFileName = selectedSet.fileName;
    AppState.examState.totalTime = 3 * 60 * 60;
    
    DOM.examSetSelection.style.display = 'none';
    DOM.subjectiveExam.style.display = 'block';
    DOM.subjectiveExamTitle.textContent = `Subjective Exam - ${selectedSet.displayName}`;
    
    await loadSubjectiveExamContent(selectedSet.fileName, selectedSet.displayName);
    startTimer('subjective');
}

function loadMCQExamQuestion() {
    const state = AppState.examState;
    if (state.questions.length === 0) return;
    
    const question = state.questions[state.currentQuestionIndex];
    
    DOM.multipleChoiceContainer.innerHTML = `
        <div class="mcq-question-container">
            <div class="question-number-badge">Question ${state.currentQuestionIndex + 1}</div>
            <div class="mcq-question">${question.question}</div>
            <div class="mcq-options" id="exam-options-container">
                ${question.options.map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected = state.answers[state.currentQuestionIndex] === option;
                    let optionClass = 'mcq-option';
                    if (isSelected) optionClass += ' selected';
                    
                    return `
                        <div class="${optionClass}" data-exam-option="${option}">
                            <div class="option-letter">${optionLetter}</div>
                            <div>${option}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    DOM.currentExamQuestion.textContent = state.currentQuestionIndex + 1;
    DOM.totalExamQuestions.textContent = state.questions.length;
    
    DOM.prevExamQuestion.disabled = state.currentQuestionIndex === 0;
    DOM.nextExamQuestion.disabled = state.currentQuestionIndex === state.questions.length - 1;
    
    const flagBtn = DOM.flagExamQuestion;
    if (state.flagged[state.currentQuestionIndex]) {
        flagBtn.innerHTML = '<i class="fas fa-flag"></i> Unflag';
        flagBtn.style.backgroundColor = '#e74c3c';
    } else {
        flagBtn.innerHTML = '<i class="far fa-flag"></i> Flag';
        flagBtn.style.backgroundColor = '';
    }
    
    updateMCQExamProgress();
}

function updateMCQExamProgress() {
    const total = AppState.examState.questions.length;
    const answered = Object.keys(AppState.examState.answers).length;
    
    DOM.mcqTotalQuestions.textContent = total;
    DOM.mcqAnsweredQuestions.textContent = answered;
    DOM.mcqRemainingQuestions.textContent = total - answered;
}

function startTimer(type) {
    let timerElement, totalTime;
    
    if (type === 'subjective') {
        timerElement = document.getElementById('subjective-timer');
        totalTime = 3 * 60 * 60;
    } else {
        timerElement = document.getElementById('mcq-exam-timer');
        totalTime = 30 * 60;
    }
    
    let remaining = totalTime;
    
    const updateTimer = () => {
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (remaining <= 0) {
            clearInterval(timer);
            if (type === 'multiple-choice') {
                submitMCQExam();
            } else {
                alert('Time is up! Your subjective exam will be submitted.');
                if (AppState.timers.subjectiveExam) clearInterval(AppState.timers.subjectiveExam);
            }
        }
        
        remaining--;
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    if (type === 'subjective') {
        AppState.timers.subjectiveExam = timer;
    } else {
        AppState.timers.mcqExam = timer;
    }
}

function submitMCQExam() {
    const state = AppState.examState;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    
    state.questions.forEach((question, index) => {
        const userAnswer = state.answers[index];
        if (userAnswer) {
            if (userAnswer === question.correct) {
                correct++;
            } else {
                wrong++;
            }
        } else {
            skipped++;
        }
    });
    
    const percentage = Math.round((correct / state.questions.length) * 100);
    
    if (AppState.timers.mcqExam) clearInterval(AppState.timers.mcqExam);
    
    DOM.multipleChoiceExam.style.display = 'none';
    DOM.examResults.style.display = 'block';
    
    document.getElementById('exam-score').textContent = percentage + '%';
    document.getElementById('exam-correct-answers').textContent = correct;
    document.getElementById('exam-total-questions').textContent = state.questions.length;
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('wrong-count').textContent = wrong;
    document.getElementById('skipped-count').textContent = skipped;
}

function resetExamTypeSelection() {
    DOM.examSetSelection.style.display = 'none';
    DOM.subjectiveExam.style.display = 'none';
    DOM.multipleChoiceExam.style.display = 'none';
    DOM.examResults.style.display = 'none';
    DOM.examTypeSelection.style.display = 'block';
    
    if (AppState.timers.subjectiveExam) clearInterval(AppState.timers.subjectiveExam);
    if (AppState.timers.mcqExam) clearInterval(AppState.timers.mcqExam);
    
    AppState.examState = {
        type: null,
        currentSet: null,
        currentFileName: null,
        currentQuestionIndex: 0,
        questions: [],
        answers: {},
        flagged: {},
        timer: null,
        startTime: null,
        totalTime: 0,
        mcqSets: [],
        subjectiveSets: []
    };
}

// ==============================================
// INITIALIZATION AND EVENT LISTENERS
// ==============================================

function init() {
    setupEventListeners();
    loadField('civil');
    updateFieldIndicators();
}

function loadField(field) {
    AppState.currentField = field;
    const config = FIELD_CONFIG[field];
    
    DOM.currentField.innerHTML = `<i class="fas ${config.icon}"></i> ${config.name}`;
    DOM.userField.textContent = config.name;
    
    document.documentElement.style.setProperty('--primary-color', config.color);
    
    document.querySelector('header').style.background = `linear-gradient(to right, ${config.color}, ${lightenColor(config.color, 20)})`;
    
    updateFieldIndicators();
    
    loadNoticeFiles();
    loadSyllabusFiles();
    loadOldQuestionFiles();
    loadMCQSubjects();
    initEnhancedSubjective();
    
    resetPracticeSessions();
}

function updateFieldIndicators() {
    const config = FIELD_CONFIG[AppState.currentField];
    Object.values(DOM.fieldIndicators).forEach(indicator => {
        indicator.innerHTML = `<i class="fas ${config.icon}"></i> ${config.name.split(' ')[0]}`;
        indicator.style.backgroundColor = config.color;
    });
}

function resetPracticeSessions() {
    DOM.mcqPractice.style.display = 'none';
    DOM.chapterSelection.style.display = 'none';
    DOM.subjectGrid.style.display = 'block';
    
    DOM.subjectiveContent.style.display = 'none';
    DOM.subjectiveChapterSelection.style.display = 'none';
    DOM.subjectiveSetGrid.style.display = 'block';
    
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

function setupEventListeners() {
    // Field dropdown
    DOM.fieldDropdownBtn.addEventListener('click', () => {
        DOM.fieldDropdown.classList.toggle('show');
    });

    document.querySelectorAll('.field-option').forEach(option => {
        option.addEventListener('click', () => {
            const field = option.dataset.field;
            loadField(field);
            DOM.fieldDropdown.classList.remove('show');
        });
    });

    document.querySelectorAll('.field-change').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadField(link.dataset.field);
        });
    });

    document.addEventListener('click', (e) => {
        if (!DOM.fieldDropdownBtn.contains(e.target) && !DOM.fieldDropdown.contains(e.target)) {
            DOM.fieldDropdown.classList.remove('show');
        }
    });

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
            
            resetPracticeSessions();
        });
    });

    document.querySelectorAll('.footer-nav').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector(`.nav-link[data-section="${section}"]`).classList.add('active');
            
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
            
            resetPracticeSessions();
        });
    });

    // MCQ subject selection
    document.addEventListener('click', (e) => {
        const subjectCard = e.target.closest('.subject-card[data-subject]');
        if (subjectCard && DOM.subjectGrid && DOM.subjectGrid.contains(subjectCard)) {
            e.preventDefault();
            const subject = subjectCard.dataset.subject;
            showChapterSelection(subject);
        }
    });

    // MCQ chapter selection
    document.addEventListener('click', (e) => {
        const chapterCard = e.target.closest('.subject-card[data-chapter]');
        if (chapterCard && DOM.chapterGrid && DOM.chapterGrid.contains(chapterCard)) {
            e.preventDefault();
            const subject = chapterCard.dataset.subject;
            const chapterDisplayName = chapterCard.dataset.chapter;
            const chapterFileName = chapterCard.dataset.filename;
            startMCQPractice(subject, chapterDisplayName, chapterFileName);
        }
    });

    // MCQ pagination
    DOM.firstPageBtn.addEventListener('click', () => {
        AppState.mcqState.currentPage = 1;
        renderCurrentPage();
    });

    DOM.prevPageBtn.addEventListener('click', () => {
        if (AppState.mcqState.currentPage > 1) {
            AppState.mcqState.currentPage--;
            renderCurrentPage();
        }
    });

    DOM.nextPageBtn.addEventListener('click', () => {
        const totalPages = parseInt(DOM.totalPages.textContent);
        if (AppState.mcqState.currentPage < totalPages) {
            AppState.mcqState.currentPage++;
            renderCurrentPage();
        }
    });

    DOM.lastPageBtn.addEventListener('click', () => {
        AppState.mcqState.currentPage = parseInt(DOM.totalPages.textContent);
        renderCurrentPage();
    });

    DOM.questionsPerPageSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        AppState.mcqState.questionsPerPage = value === 'all' ? 'all' : parseInt(value);
        AppState.mcqState.currentPage = 1;
        setupPagination();
        renderCurrentPage();
    });

    // MCQ navigation
    DOM.backToSubjectsBtn.addEventListener('click', () => {
        DOM.mcqPractice.style.display = 'none';
        DOM.chapterSelection.style.display = 'block';
    });

    DOM.backToSubjectsFromChapterBtn.addEventListener('click', () => {
        DOM.chapterSelection.style.display = 'none';
        DOM.subjectGrid.style.display = 'block';
    });

    // Subjective navigation
    document.addEventListener('click', (e) => {
        const subjectCard = e.target.closest('.subject-card[data-subject]');
        if (subjectCard && DOM.subjectiveSetGrid && DOM.subjectiveSetGrid.contains(subjectCard)) {
            e.preventDefault();
            const subject = subjectCard.dataset.subject;
            showSubjectiveChapterSelection(subject);
        }
    });

    document.addEventListener('click', (e) => {
        const chapterCard = e.target.closest('.subject-card[data-chapter]');
        if (chapterCard && DOM.subjectiveChapterGrid && DOM.subjectiveChapterGrid.contains(chapterCard)) {
            e.preventDefault();
            const subject = chapterCard.dataset.subject;
            const chapter = chapterCard.dataset.chapter;
            const fileName = chapterCard.dataset.filename;
            viewSubjectiveContent(subject, chapter, fileName);
        }
    });

    DOM.backToSubjectiveSetsBtn.addEventListener('click', () => {
        DOM.subjectiveContent.style.display = 'none';
        DOM.subjectiveChapterSelection.style.display = 'block';
    });

    DOM.backToSubjectiveSubjectsBtn.addEventListener('click', () => {
        DOM.subjectiveChapterSelection.style.display = 'none';
        DOM.subjectiveSetGrid.style.display = 'block';
    });

    // Exam type selection
    document.addEventListener('click', (e) => {
        const examTypeCard = e.target.closest('.subject-card[data-exam-type]');
        if (examTypeCard && DOM.examTypeSelection && DOM.examTypeSelection.contains(examTypeCard)) {
            e.preventDefault();
            const examType = examTypeCard.dataset.examType;
            
            if (examType === 'subjective') {
                showSubjectiveExamSetSelection();
            } else if (examType === 'multiple-choice') {
                showMCQExamSetSelection();
            }
        }
    });

    // Exam navigation
    DOM.prevExamQuestion.addEventListener('click', () => {
        if (AppState.examState.currentQuestionIndex > 0) {
            AppState.examState.currentQuestionIndex--;
            loadMCQExamQuestion();
        }
    });

    DOM.nextExamQuestion.addEventListener('click', () => {
        if (AppState.examState.currentQuestionIndex < AppState.examState.questions.length - 1) {
            AppState.examState.currentQuestionIndex++;
            loadMCQExamQuestion();
        }
    });

    DOM.flagExamQuestion.addEventListener('click', () => {
        const index = AppState.examState.currentQuestionIndex;
        AppState.examState.flagged[index] = !AppState.examState.flagged[index];
        loadMCQExamQuestion();
    });

    // Exam option selection
    document.addEventListener('click', (e) => {
        const option = e.target.closest('.mcq-option[data-exam-option]');
        if (option && option.parentElement === document.getElementById('exam-options-container')) {
            const optionValue = option.dataset.examOption;
            const questionIndex = AppState.examState.currentQuestionIndex;
            
            document.querySelectorAll('#exam-options-container .mcq-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            option.classList.add('selected');
            
            AppState.examState.answers[questionIndex] = optionValue;
            
            updateMCQExamProgress();
        }
    });

    // Exam submission
    DOM.submitSubjectiveExamBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to submit your subjective exam?')) {
            alert('Subjective exam submitted!');
            if (AppState.timers.subjectiveExam) clearInterval(AppState.timers.subjectiveExam);
            resetExamTypeSelection();
        }
    });

    DOM.submitMcqExamBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to submit your MCQ exam?')) {
            submitMCQExam();
        }
    });
    
    DOM.viewAnswersBtn.addEventListener('click', showExamAnswers);

    // Exam navigation back buttons
    DOM.backToExamTypeBtn.addEventListener('click', resetExamTypeSelection);
    DOM.backToExamTypeMcqBtn.addEventListener('click', resetExamTypeSelection);
    DOM.backToExamTypeResultsBtn.addEventListener('click', resetExamTypeSelection);
    
    // Setup search
    setupSearch();
}

function showExamAnswers() {
    const state = AppState.examState;
    let answersHtml = '<h4>Correct Answers:</h4><ol>';
    
    state.questions.forEach((question, index) => {
        const userAnswer = state.answers[index];
        const isCorrect = userAnswer === question.correct;
        answersHtml += `
            <li style="margin-bottom: 1rem; padding: 0.5rem; background-color: ${isCorrect ? '#d4edda' : '#f8d7da'}; border-radius: 4px;">
                <strong>${question.question}</strong><br>
                Your answer: <span style="color: ${isCorrect ? 'green' : 'red'}">${userAnswer || 'Not answered'}</span><br>
                Correct answer: <span style="color: green">${question.correct}</span><br>
                Explanation: ${question.explanation}
            </li>
        `;
    });
    
    answersHtml += '</ol>';
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Exam Review - ${state.currentSet}</h3>
        <button style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        ${answersHtml}
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modalContent.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
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
    DOM.subjectiveContent.style.display = 'none';
    DOM.subjectiveChapterSelection.style.display = 'block';
};

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', loadComponents);
