
// ==============================================
// ENHANCED CACHE MANAGEMENT
// ==============================================

const GITHUB_CACHE = {
    list: new Map(),
    json: new Map(),
    lastCleared: Date.now(),
    maxAge: 10 * 60 * 1000 // 10 minutes
};

function clearExpiredCache() {
    const now = Date.now();
    if (now - GITHUB_CACHE.lastCleared > GITHUB_CACHE.maxAge) {
        GITHUB_CACHE.list.clear();
        GITHUB_CACHE.json.clear();
        GITHUB_CACHE.lastCleared = now;
    }
}

function clearGitHubCache() {
    GITHUB_CACHE.list.clear();
    GITHUB_CACHE.json.clear();
    GITHUB_CACHE.lastCleared = Date.now();
}

// ==============================================
// COMPONENT LOADING (OPTIMIZED)
// ==============================================

// DOM Element Cache
const DOMCache = new Map();

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

// ==============================================
// DOM ELEMENT REFERENCES (OPTIMIZED)
// ==============================================

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

// ==============================================
// GITHUB API FUNCTIONS (OPTIMIZED WITH RETRY)
// ==============================================

function getGitHubApiUrl(path) {
    return `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodeURIComponent(path)}?ref=${GITHUB_CONFIG.branch}`;
}

function getRawFileUrl(path) {
    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${encodeURIComponent(path)}`;
}

async function fetchWithRetry(url, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            if (i === retries) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

async function listFilesFromGitHub(folderPath) {
    clearExpiredCache();
    
    if (GITHUB_CACHE.list.has(folderPath)) {
        return GITHUB_CACHE.list.get(folderPath);
    }
    
    try {
        const response = await fetchWithRetry(getGitHubApiUrl(folderPath));
        const data = await response.json();
        const files = Array.isArray(data) ? data : [data];
        
        const result = files
            .filter(item => item.type === 'file')
            .map(file => ({
                name: file.name,
                path: file.path,
                size: file.size,
                download_url: file.download_url,
                html_url: file.html_url,
                type: file.type
            }));
        
        GITHUB_CACHE.list.set(folderPath, result);
        return result;
        
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        GITHUB_CACHE.list.set(folderPath, []);
        return [];
    }
}

async function getJsonFileFromGitHub(filePath) {
    clearExpiredCache();
    
    if (GITHUB_CACHE.json.has(filePath)) {
        return GITHUB_CACHE.json.get(filePath);
    }
    
    try {
        const response = await fetchWithRetry(getRawFileUrl(filePath));
        const data = await response.json();
        GITHUB_CACHE.json.set(filePath, data);
        return data;
        
    } catch (error) {
        console.error('Error fetching JSON file:', error);
        GITHUB_CACHE.json.set(filePath, null);
        return null;
    }
}

// ==============================================
// FILE LOADING FUNCTIONS
// ==============================================

async function loadNoticeFiles() {
    const loading = getDOMElement('notice-loading');
    const list = getDOMElement('notice-list');
    
    if (loading) loading.innerHTML = `
        <div class="spinner"></div>
        <p>Loading notices...</p>
    `;
    
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Notice`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        files.sort((a, b) => b.name.localeCompare(a.name));
        
        hideElement(loading);
        showElement(list);
        
        if (files.length === 0) {
            list.innerHTML = '<li style="text-align: center; padding: 2rem;"><p>No notice files available.</p></li>';
            return;
        }
        
        list.innerHTML = files.map(file => {
            const fileName = file.name;
            const friendlyName = fileName.replace(/\.(pdf|docx|doc|txt)$/i, '').replace(/[_-]/g, ' ');
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
        hideElement(loading);
        if (list) {
            list.innerHTML = '<li style="text-align: center; padding: 2rem; color: #e74c3c;"><p>Error loading notice files.</p></li>';
            showElement(list);
        }
    }
}

async function loadSyllabusFiles() {
    const loading = getDOMElement('syllabus-loading');
    const list = getDOMElement('syllabus-list');
    
    if (loading) loading.innerHTML = `
        <div class="spinner"></div>
        <p>Loading syllabus...</p>
    `;
    
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Syllabus`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        files.sort((a, b) => a.name.localeCompare(b.name));
        
        hideElement(loading);
        showElement(list);
        
        if (files.length === 0) {
            list.innerHTML = '<li style="text-align: center; padding: 2rem;"><p>No syllabus files available.</p></li>';
            return;
        }
        
        list.innerHTML = files.map(file => {
            const fileName = file.name;
            const friendlyName = fileName.replace(/\.(pdf|docx|doc)$/i, '').replace(/[_-]/g, ' ');
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
        hideElement(loading);
        if (list) {
            list.innerHTML = '<li style="text-align: center; padding: 2rem; color: #e74c3c;"><p>Error loading syllabus files.</p></li>';
            showElement(list);
        }
    }
}

async function loadOldQuestionFiles() {
    const loading = getDOMElement('old-questions-loading');
    const list = getDOMElement('old-questions-list');
    
    if (loading) loading.innerHTML = `
        <div class="spinner"></div>
        <p>Loading old questions...</p>
    `;
    
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Old Questions`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        files.sort((a, b) => {
            const yearA = extractYearFromFilename(a.name);
            const yearB = extractYearFromFilename(b.name);
            return yearB - yearA;
        });
        
        hideElement(loading);
        showElement(list);
        
        if (files.length === 0) {
            list.innerHTML = '<li style="text-align: center; padding: 2rem;"><p>No old question papers available.</p></li>';
            return;
        }
        
        list.innerHTML = files.map(file => {
            const fileName = file.name;
            const friendlyName = fileName.replace(/\.(pdf|docx|doc)$/i, '').replace(/[_-]/g, ' ');
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
        hideElement(loading);
        if (list) {
            list.innerHTML = '<li style="text-align: center; padding: 2rem; color: #e74c3c;"><p>Error loading old questions.</p></li>';
            showElement(list);
        }
    }
}

// ==============================================
// SEARCH FUNCTIONALITY
// ==============================================

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

function setupSearch() {
    const searchConfigs = [
        { 
            inputId: 'notice-search', 
            btnId: 'notice-search-btn', 
            listId: 'notice-list',
            stateKey: 'notice'
        },
        { 
            inputId: 'syllabus-search', 
            btnId: 'syllabus-search-btn', 
            listId: 'syllabus-list',
            stateKey: 'syllabus'
        },
        { 
            inputId: 'old-questions-search', 
            btnId: 'old-questions-search-btn', 
            listId: 'old-questions-list',
            stateKey: 'oldQuestions'
        }
    ];

    searchConfigs.forEach(config => {
        const input = getDOMElement(config.inputId);
        const button = getDOMElement(config.btnId);
        
        if (!input || !button) return;

        const performSearch = debounce(() => {
            const searchTerm = input.value.toLowerCase();
            AppState.searchState[config.stateKey] = searchTerm;
            filterFileList(config.listId, searchTerm);
        }, 300);

        input.addEventListener('input', performSearch);
        button.addEventListener('click', performSearch);
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    });
}

function filterFileList(listId, searchTerm) {
    const list = getDOMElement(listId);
    if (!list) return;
    
    const items = list.querySelectorAll('li');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isVisible = searchTerm === '' || text.includes(searchTerm);
        item.style.display = isVisible ? '' : 'none';
    });
}

// ==============================================
// MCQ FUNCTIONS - PAGINATED DISPLAY (FROM SCRIPT 1)
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

// Add this at the beginning of renderCurrentPage() or loadMCQExamQuestion()
console.log("DEBUG - Questions array:", AppState.mcqState.questions);
console.log("DEBUG - Questions count:", AppState.mcqState.questions.length);
console.log("DEBUG - Current page:", AppState.mcqState.currentPage);
console.log("DEBUG - Questions per page:", AppState.mcqState.questionsPerPage);

// For exam section:
console.log("DEBUG - Exam questions:", AppState.examState.questions);
console.log("DEBUG - Current question index:", AppState.examState.currentQuestionIndex);

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

// ==============================================
// SUBJECTIVE FUNCTIONS (FROM SCRIPT 1 & 2)
// ==============================================

const SUBJECT_ICONS = {
    'Structure': 'fa-building',
    'Geotech': 'fa-mountain',
    'Hydropower': 'fa-water',
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

const SUBJECT_COLORS = {
    'Structure': '#1a5f7a',
    'Geotech': '#8B4513',
    'Hydropower': '#1e90ff',
    'Highway': '#ffa500',
    'Surveying': '#32cd32',
    'Concrete': '#808080',
    'Steel': '#4682b4',
    'Thermodynamics': '#ff4500',
    'Fluid Mechanics': '#00bfff',
    'Heat Transfer': '#ff6347',
    'Machine Design': '#4169e1',
    'Manufacturing': '#696969',
    'Circuit Theory': '#ffd700',
    'Power Systems': '#ff8c00',
    'Control Systems': '#9acd32',
    'Electrical Machines': '#6495ed',
    'Power Electronics': '#da70d6',
    'Analog Electronics': '#9370db',
    'Digital Electronics': '#ba55d3',
    'VLSI Design': '#8a2be2',
    'Communication Systems': '#20b2aa',
    'Embedded Systems': '#3cb371',
    'Programming': '#00ced1',
    'Data Structures': '#66cdaa',
    'Algorithms': '#48d1cc',
    'Database Systems': '#7b68ee',
    'Computer Networks': '#5f9ea0'
};

let imageGalleryState = {
    currentImageIndex: 0,
    imageUrls: [],
    totalImages: 0
};

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

async function renderSubjectCategories() {
    const subjects = await loadSubjectiveSubjects();
    
    if (subjects.length === 0) {
        document.getElementById('subjective-loading').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h4>No Subjects Available</h4>
                <p>Add subjects to your GitHub repository to get started.</p>
            </div>
        `;
        return;
    }
    
    const loading = getDOMElement('subjective-loading');
    const categoriesView = document.getElementById('subject-categories-view');
    
    hideElement(loading);
    if (categoriesView) showElement(categoriesView);
    
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;
    
    let categoriesHTML = '<div class="category-grid-modern">';
    
    for (const subject of subjects) {
        const books = await loadSubjectiveChapters(subject);
        const bookCount = books.length;
        const subjectIcon = SUBJECT_ICONS[subject] || 'fa-book';
        const subjectColor = SUBJECT_COLORS[subject] || '#1a5f7a';
        
        categoriesHTML += `
            <div class="subject-card-modern" data-subject="${subject}">
                <div class="subject-header-modern">
                    <div class="subject-icon-circle" style="background: ${subjectColor};">
                        <i class="fas ${subjectIcon}"></i>
                    </div>
                    <div>
                        <h3 style="color: ${subjectColor}; margin: 0 0 5px 0;">${subject}</h3>
                        <span style="font-size: 0.9rem; color: #666;">${bookCount} document${bookCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>
                
                <div class="chapter-list-modern">
                    ${books.slice(0, 4).map(book => `
                        <div class="chapter-item-modern" 
                             data-subject="${subject}" 
                             data-book="${book.name}" 
                             data-filename="${book.fileName}">
                            <i class="fas fa-file-alt chapter-icon-modern"></i>
                            <span class="chapter-text">${book.name}</span>
                            <small style="color: #999; font-size: 0.8rem;">${book.extension.toUpperCase()}</small>
                        </div>
                    `).join('')}
                    
                    ${bookCount > 4 ? `
                        <div class="chapter-item-modern" style="color: #999; font-style: italic;">
                            <i class="fas fa-ellipsis-h chapter-icon-modern"></i>
                            <span class="chapter-text">View ${bookCount - 4} more documents</span>
                        </div>
                    ` : ''}
                    
                    ${bookCount === 0 ? `
                        <div class="chapter-item-modern" style="color: #ccc; font-style: italic;">
                            <i class="fas fa-folder-open chapter-icon-modern"></i>
                            <span class="chapter-text">No documents yet</span>
                        </div>
                    ` : ''}
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" 
                        data-subject="${subject}">
                    <i class="fas fa-book-open"></i> Open ${subject}
                </button>
            </div>
        `;
    }
    
    categoriesHTML += '</div>';
    categoriesContainer.innerHTML = categoriesHTML;
    
    setupCategoryEvents();
}

function setupCategoryEvents() {
    document.querySelectorAll('.subject-card-modern .btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            const subject = e.target.dataset.subject || e.target.closest('[data-subject]').dataset.subject;
            openSubjectBooks(subject);
        });
    });
    
    document.querySelectorAll('.chapter-item-modern').forEach(item => {
        item.addEventListener('click', (e) => {
            const subject = item.dataset.subject;
            const bookName = item.dataset.book;
            const fileName = item.dataset.filename;
            
            if (bookName && fileName) {
                const fileExt = fileName.split('.').pop().toLowerCase();
                openBookReader(subject, bookName, fileName, fileExt);
            }
        });
    });
}

async function openSubjectBooks(subject) {
    const categoriesView = document.getElementById('subject-categories-view');
    const booksView = document.getElementById('subject-books-view');
    
    if (!categoriesView || !booksView) return;
    
    categoriesView.style.display = 'none';
    booksView.style.display = 'block';
    
    const subjectIcon = SUBJECT_ICONS[subject] || 'fa-book';
    const subjectColor = SUBJECT_COLORS[subject] || '#1a5f7a';
    
    const headerIcon = document.getElementById('subject-header-icon');
    const title = document.getElementById('current-subject-title');
    const bookCount = document.getElementById('subject-book-count');
    
    if (headerIcon) {
        headerIcon.innerHTML = `<i class="fas ${subjectIcon}"></i>`;
        headerIcon.style.background = subjectColor;
    }
    
    if (title) {
        title.textContent = subject;
        title.style.color = subjectColor;
    }
    
    const books = await loadSubjectiveChapters(subject);
    if (bookCount) bookCount.textContent = `${books.length} document${books.length !== 1 ? 's' : ''}`;
    
    renderSubjectBooks(subject, books);
}

function renderSubjectBooks(subject, books) {
    const booksGrid = document.getElementById('subject-books-grid');
    if (!booksGrid) return;
    
    if (books.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-book"></i>
                <h4>No Documents Available</h4>
                <p>This subject doesn't have any documents yet.</p>
            </div>
        `;
        return;
    }
    
    const bookColors = [
        'linear-gradient(135deg, #1a5f7a, #2a7a9c)',
        'linear-gradient(135deg, #57cc99, #3fa67a)',
        'linear-gradient(135deg, #ff6b6b, #ff5252)',
        'linear-gradient(135deg, #6a11cb, #2575fc)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)'
    ];
    
    booksGrid.innerHTML = books.map((book, index) => {
        const fileName = book.fileName;
        const fileExt = book.extension;
        const colorIndex = index % bookColors.length;
        const bookAbbr = book.name.split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase())
            .slice(0, 3)
            .join('');
        
        return `
            <div class="book-modern" 
                 data-subject="${subject}"
                 data-chapter="${book.name}"
                 data-filename="${fileName}"
                 data-extension="${fileExt}">
                <div class="book-cover-modern" style="background: ${bookColors[colorIndex]}">
                    ${bookAbbr}
                </div>
                <div class="book-info-modern">
                    <div class="book-title-modern">${book.name}</div>
                    <div class="book-subtitle-modern">${fileExt.toUpperCase()} • ${subject}</div>
                </div>
            </div>
        `;
    }).join('');
    
    booksGrid.querySelectorAll('.book-modern').forEach(bookCard => {
        bookCard.addEventListener('click', () => {
            const subject = bookCard.dataset.subject;
            const chapter = bookCard.dataset.chapter;
            const fileName = bookCard.dataset.filename;
            const fileExt = bookCard.dataset.extension;
            
            openBookReader(subject, chapter, fileName, fileExt);
        });
    });
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
    
    const currentImage = document.getElementById('current-image');
    const currentImageNum = document.getElementById('current-image-num');
    const totalImages = document.getElementById('total-images');
    const prevImage = document.getElementById('prev-image');
    const nextImage = document.getElementById('next-image');
    
    if (currentImage) currentImage.src = state.imageUrls[state.currentImageIndex];
    if (currentImageNum) currentImageNum.textContent = state.currentImageIndex + 1;
    if (totalImages) totalImages.textContent = state.totalImages;
    if (prevImage) prevImage.disabled = state.currentImageIndex === 0;
    if (nextImage) nextImage.disabled = state.currentImageIndex === state.totalImages - 1;
}

async function openBookReader(subject, chapter, fileName, fileExt) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Subjective/${subject}/${fileName}`;
    const fileUrl = getRawFileUrl(filePath);
    
    const booksView = document.getElementById('subject-books-view');
    const bookReader = document.getElementById('book-reader');
    
    if (!booksView || !bookReader) return;
    
    booksView.style.display = 'none';
    bookReader.style.display = 'block';
    
    const readerBookTitle = document.getElementById('reader-book-title');
    const metaSubject = document.getElementById('meta-subject');
    const metaFormat = document.getElementById('meta-format');
    const metaSize = document.getElementById('meta-size');
    
    if (readerBookTitle) readerBookTitle.textContent = chapter;
    if (metaSubject) metaSubject.textContent = subject;
    if (metaFormat) metaFormat.textContent = fileExt.toUpperCase();
    if (metaSize) metaSize.textContent = await getFileSize(filePath);
    
    const contentElements = [
        'pdf-viewer', 'image-gallery', 'file-options', 'single-image', 'multiple-images'
    ];
    
    contentElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
    
    const fileTitle = document.getElementById('file-title');
    if (fileTitle) fileTitle.textContent = chapter;
    
    if (fileExt === 'pdf') {
        const pdfViewer = document.getElementById('pdf-viewer');
        const pdfFrame = document.getElementById('pdf-frame');
        if (pdfViewer && pdfFrame) {
            pdfViewer.style.display = 'block';
            pdfFrame.src = fileUrl;
        }
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
        const imageGallery = document.getElementById('image-gallery');
        if (imageGallery) imageGallery.style.display = 'block';
        
        const allImages = await getFolderImages(subject, fileName);
        
        if (allImages.length > 1) {
            imageGalleryState = {
                currentImageIndex: allImages.findIndex(img => img.fileName === fileName),
                imageUrls: allImages.map(img => getRawFileUrl(img.path)),
                totalImages: allImages.length
            };
            
            const multipleImages = document.getElementById('multiple-images');
            if (multipleImages) {
                multipleImages.style.display = 'block';
                updateImageGallery();
            }
        } else {
            const singleImage = document.getElementById('single-image');
            const bookImage = document.getElementById('book-image');
            if (singleImage && bookImage) {
                singleImage.style.display = 'block';
                bookImage.src = fileUrl;
            }
        }
    } else {
        const fileOptions = document.getElementById('file-options');
        const filePreview = document.getElementById('file-preview');
        const downloadFileBtn = document.getElementById('download-file-btn');
        
        if (fileOptions && filePreview && downloadFileBtn) {
            fileOptions.style.display = 'block';
            filePreview.innerHTML = `
                <i class="fas fa-file-${getFileIconClass(fileExt)} fa-5x" style="color: var(--primary-color); margin-bottom: 1.5rem;"></i>
                <h4 style="color: var(--dark-color); margin-bottom: 0.5rem;">${chapter}</h4>
                <p style="color: #666;">This ${fileExt.toUpperCase()} file requires download to view.</p>
            `;
            
            downloadFileBtn.onclick = () => downloadFile(fileUrl, fileName);
        }
    }
}

async function initEnhancedSubjective() {
    await renderSubjectCategories();
    setupBookReaderEvents();
    
    const backToCategories = document.getElementById('back-to-categories');
    const backToSubjectBooks = document.getElementById('back-to-subject-books');
    
    if (backToCategories) {
        backToCategories.addEventListener('click', () => {
            const booksView = document.getElementById('subject-books-view');
            const categoriesView = document.getElementById('subject-categories-view');
            if (booksView && categoriesView) {
                booksView.style.display = 'none';
                categoriesView.style.display = 'block';
            }
        });
    }
    
    if (backToSubjectBooks) {
        backToSubjectBooks.addEventListener('click', () => {
            const bookReader = document.getElementById('book-reader');
            const booksView = document.getElementById('subject-books-view');
            if (bookReader && booksView) {
                bookReader.style.display = 'none';
                booksView.style.display = 'block';
            }
        });
    }
}

function setupBookReaderEvents() {
    const closeReader = document.getElementById('close-reader');
    const prevImage = document.getElementById('prev-image');
    const nextImage = document.getElementById('next-image');
    
    if (closeReader) {
        closeReader.addEventListener('click', () => {
            const bookReader = document.getElementById('book-reader');
            const booksView = document.getElementById('subject-books-view');
            if (bookReader && booksView) {
                bookReader.style.display = 'none';
                booksView.style.display = 'block';
            }
        });
    }
    
    if (prevImage) {
        prevImage.addEventListener('click', () => {
            if (imageGalleryState.currentImageIndex > 0) {
                imageGalleryState.currentImageIndex--;
                updateImageGallery();
            }
        });
    }
    
    if (nextImage) {
        nextImage.addEventListener('click', () => {
            if (imageGalleryState.currentImageIndex < imageGalleryState.totalImages - 1) {
                imageGalleryState.currentImageIndex++;
                updateImageGallery();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        const bookReader = document.getElementById('book-reader');
        if (!bookReader || bookReader.style.display !== 'block') return;
        
        if (e.key === 'ArrowLeft' && imageGalleryState.currentImageIndex > 0) {
            imageGalleryState.currentImageIndex--;
            updateImageGallery();
            e.preventDefault();
        } else if (e.key === 'ArrowRight' && imageGalleryState.currentImageIndex < imageGalleryState.totalImages - 1) {
            imageGalleryState.currentImageIndex++;
            updateImageGallery();
            e.preventDefault();
        } else if (e.key === 'Escape') {
            const booksView = document.getElementById('subject-books-view');
            if (bookReader && booksView) {
                bookReader.style.display = 'none';
                booksView.style.display = 'block';
            }
        }
    });
}

// ==============================================
// EXAM SET DISCOVERY FUNCTIONS
// ==============================================

async function discoverMCQExamSets() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam`;
    
    console.log(`Looking for MCQ sets in: ${folderPath}`);
    
    try {
        // Try to fetch directly from GitHub API
        const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodeURIComponent(folderPath)}`;
        console.log(`API URL: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.warn(`GitHub API error: ${response.status}`);
            // Return demo sets if API fails
            return generateDemoMCQSets();
        }
        
        const data = await response.json();
        console.log('GitHub API response:', data);
        
        if (!Array.isArray(data)) {
            console.warn('Expected array from GitHub API');
            return generateDemoMCQSets();
        }
        
        // Filter for JSON files
        const jsonFiles = data.filter(item => {
            return item.name && item.name.toLowerCase().endsWith('.json');
        });
        
        if (jsonFiles.length === 0) {
            console.warn('No JSON files found, using demo sets');
            return generateDemoMCQSets();
        }
        
        const examSets = jsonFiles.map((file, index) => {
            const isFree = index < 2; // First 2 sets are free
            return {
                name: file.name,
                fileName: file.name,
                displayName: file.name.replace('.json', '').replace(/_/g, ' '),
                isFree: isFree,
                price: isFree ? 0 : 50,
                setNumber: index + 1,
                path: file.path,
                downloadUrl: file.download_url
            };
        });
        
        console.log(`Found ${examSets.length} exam sets:`, examSets);
        return examSets;
        
    } catch (error) {
        console.error('Error in discoverMCQExamSets:', error);
        return generateDemoMCQSets();
    }
}

async function discoverSubjectiveExamSets() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Subjective Exam`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        if (!files || files.length === 0) {
            console.warn(`No files found in: ${folderPath}`);
            return generateDemoSubjectiveSets();
        }
        
        const examSets = [];
        
        const jsonFiles = files.filter(file => {
            const fileName = file.name.toLowerCase();
            return fileName.endsWith('.json');
        });
        
        jsonFiles.forEach((file, index) => {
            const fileName = file.name;
            const baseName = fileName.replace(/\.json$/i, '');
            const setName = baseName.replace(/_/g, ' ').trim();
            const isFree = index < 2;
            
            examSets.push({
                name: setName,
                fileName: fileName,
                displayName: setName,
                isFree: isFree,
                price: isFree ? 0 : PAYMENT_CONFIG.prices.subjective,
                setNumber: index + 1,
                path: file.path,
                downloadUrl: file.download_url
            });
        });
        
        examSets.sort((a, b) => {
            const numA = a.displayName.match(/\d+/);
            const numB = b.displayName.match(/\d+/);
            if (numA && numB) {
                return parseInt(numA[0]) - parseInt(numB[0]);
            }
            return a.displayName.localeCompare(b.displayName);
        });
        
        examSets.forEach((set, index) => {
            set.setNumber = index + 1;
            set.isFree = index < 2;
        });
        
        console.log(`Found ${examSets.length} Subjective exam sets`);
        return examSets;
        
    } catch (error) {
        console.error('Error discovering subjective exam sets:', error);
        return generateDemoSubjectiveSets();
    }
}

function generateDemoMCQSets() {
    return [
        {
            name: "Set A - Basic Concepts",
            fileName: "set_a_basic_concepts.json",
            displayName: "Set A - Basic Concepts",
            isFree: true,
            price: 0,
            setNumber: 1
        },
        {
            name: "Set B - Intermediate Level",
            fileName: "set_b_intermediate.json",
            displayName: "Set B - Intermediate Level",
            isFree: true,
            price: 0,
            setNumber: 2
        },
        {
            name: "Set C - Advanced Problems",
            fileName: "set_c_advanced.json",
            displayName: "Set C - Advanced Problems",
            isFree: false,
            price: PAYMENT_CONFIG.prices.mcq,
            setNumber: 3
        },
        {
            name: "Set D - Expert Challenge",
            fileName: "set_d_expert.json",
            displayName: "Set D - Expert Challenge",
            isFree: false,
            price: PAYMENT_CONFIG.prices.mcq,
            setNumber: 4
        }
    ];
}

function generateDemoSubjectiveSets() {
    return [
        {
            name: "Set A - Fundamentals",
            fileName: "set_a_fundamentals.json",
            displayName: "Set A - Fundamentals",
            isFree: true,
            price: 0,
            setNumber: 1
        },
        {
            name: "Set B - Application Based",
            fileName: "set_b_application.json",
            displayName: "Set B - Application Based",
            isFree: true,
            price: 0,
            setNumber: 2
        },
        {
            name: "Set C - Case Studies",
            fileName: "set_c_case_studies.json",
            displayName: "Set C - Case Studies",
            isFree: false,
            price: PAYMENT_CONFIG.prices.subjective,
            setNumber: 3
        },
        {
            name: "Set D - Professional Practice",
            fileName: "set_d_professional.json",
            displayName: "Set D - Professional Practice",
            isFree: false,
            price: PAYMENT_CONFIG.prices.subjective,
            setNumber: 4
        }
    ];
}

// ==============================================
// EXAM SET SELECTION
// ==============================================

async function showMCQExamSetSelection() {
    console.log("Showing MCQ exam set selection");
    
    try {
        const examSets = await discoverMCQExamSets();
        
        if (examSets.length === 0) {
            alert('No MCQ exam sets found. Please upload JSON files to your "Take Exam/Multiple Choice Exam/" folder.');
            resetExamTypeSelection();
            return;
        }
        
        const examTypeSelection = getDOMElement('exam-type-selection');
        const examSetSelection = getDOMElement('exam-set-selection');
        
        if (!examTypeSelection || !examSetSelection) return;
        
        hideElement(examTypeSelection);
        showElement(examSetSelection);
        
        AppState.examState.mcqSets = examSets;
        
        renderMCQExamSetSelection(examSets);
        
    } catch (error) {
        console.error('Error loading MCQ exam sets:', error);
        alert('Failed to load exam sets. Please try again.');
        resetExamTypeSelection();
    }
}

async function showSubjectiveExamSetSelection() {
    console.log("Showing subjective exam set selection");
    
    try {
        const examSets = await discoverSubjectiveExamSets();
        
        if (examSets.length === 0) {
            alert('No subjective exam sets available. Please upload JSON files to your "Take Exam/Subjective Exam/" folder.');
            resetExamTypeSelection();
            return;
        }
        
        const examTypeSelection = getDOMElement('exam-type-selection');
        const examSetSelection = getDOMElement('exam-set-selection');
        
        if (!examTypeSelection || !examSetSelection) return;
        
        hideElement(examTypeSelection);
        showElement(examSetSelection);
        
        AppState.examState.subjectiveSets = examSets;
        
        renderSubjectiveExamSetSelection(examSets);
        
    } catch (error) {
        console.error('Error loading subjective exam sets:', error);
        alert('Failed to load exam sets. Please try again.');
        resetExamTypeSelection();
    }
}

function renderMCQExamSetSelection(examSets) {
    const examSetSelection = getDOMElement('exam-set-selection');
    if (!examSetSelection) return;
    
    examSetSelection.innerHTML = `
        <h3>Select Multiple Choice Exam Set:</h3>
        <div class="subject-grid" style="margin-top: 1.5rem;" id="mcq-exam-set-grid">
            ${examSets.map((set, index) => {
                const isPurchased = isSetPurchased('mcq', set.displayName);
                const canAccess = set.isFree || isPurchased;
                const cardClass = canAccess ? '' : 'locked-set';
                
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
                        <small>30 minutes • ${set.isFree ? '<span class="demo-badge">FREE</span>' : `<span class="paid-badge">NPR ${set.price}</span>`}</small>
                        ${!canAccess ? '<p style="color: var(--accent-color); margin-top: 0.5rem; font-size: 0.9rem;"><i class="fas fa-lock"></i> Requires Purchase</p>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="demo-notice" style="margin-top: 1.5rem;">
            <i class="fas fa-info-circle"></i> Sets A & B are free. Others require purchase. Demo payment system enabled.
        </div>
        <button class="btn btn-secondary" id="back-to-exam-type-from-mcq-set" style="margin-top: 1.5rem;">
            <i class="fas fa-arrow-left"></i> Back to Exam Type
        </button>
    `;
    
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
        
        const backButton = document.getElementById('back-to-exam-type-from-mcq-set');
        if (backButton) {
            backButton.addEventListener('click', resetExamTypeSelection);
        }
    }, 100);
}

function renderSubjectiveExamSetSelection(examSets) {
    const examSetSelection = getDOMElement('exam-set-selection');
    if (!examSetSelection) return;
    
    examSetSelection.innerHTML = `
        <h3>Select Subjective Exam Set:</h3>
        <div class="subject-grid" style="margin-top: 1.5rem;" id="subjective-exam-set-grid">
            ${examSets.map((set, index) => {
                const isPurchased = isSetPurchased('subjective', set.displayName);
                const canAccess = set.isFree || isPurchased;
                const cardClass = canAccess ? '' : 'locked-set';
                
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
                        <small>3 hours • ${set.isFree ? '<span class="demo-badge">FREE</span>' : `<span class="paid-badge">NPR ${set.price}</span>`}</small>
                        ${!canAccess ? '<p style="color: var(--accent-color); margin-top: 0.5rem; font-size: 0.9rem;"><i class="fas fa-lock"></i> Requires Purchase</p>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="demo-notice" style="margin-top: 1.5rem;">
            <i class="fas fa-info-circle"></i> Sets A & B are free. Others require purchase. Demo payment system enabled.
        </div>
        <button class="btn btn-secondary" id="back-to-exam-type-from-subjective-set" style="margin-top: 1.5rem;">
            <i class="fas fa-arrow-left"></i> Back to Exam Type
        </button>
    `;
    
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
        
        const backButton = document.getElementById('back-to-exam-type-from-subjective-set');
        if (backButton) {
            backButton.addEventListener('click', resetExamTypeSelection);
        }
    }, 100);
}

// ==============================================
// EXAM LOADING FUNCTIONS
// ==============================================

async function loadAndStartMCQExam(selectedSet) {
    console.log("Loading MCQ exam:", selectedSet.displayName, "File:", selectedSet.fileName);
    
    try {
        const state = AppState.examState;
        state.type = 'multiple-choice';
        state.currentSet = selectedSet.displayName;
        state.currentFileName = selectedSet.fileName;
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.flagged = {};
        state.totalTime = 30 * 60;
        
        console.log("Loading questions...");
        state.questions = await loadMCQExam(selectedSet.fileName, selectedSet.displayName);
        
        console.log(`Loaded ${state.questions.length} questions`);
        
        if (state.questions.length === 0) {
            throw new Error('No questions loaded');
        }
        
        const examSetSelection = getDOMElement('exam-set-selection');
        const mcqExam = getDOMElement('multiple-choice-exam');
        const examTitle = getDOMElement('multiple-choice-exam-title');
        
        if (!examSetSelection || !mcqExam || !examTitle) {
            console.error('Required DOM elements not found');
            return;
        }
        
        hideElement(examSetSelection);
        showElement(mcqExam);
        examTitle.textContent = `Multiple Choice Exam - ${selectedSet.displayName}`;
        
        console.log("Loading first question...");
        loadMCQExamQuestion();
        startTimer('mcq');
        
        console.log("MCQ exam started successfully");
        
    } catch (error) {
        console.error('Error loading exam set:', error);
        alert(`Failed to load exam questions from ${selectedSet.fileName}. Error: ${error.message}`);
    }
}

async function loadAndStartSubjectiveExam(selectedSet) {
    console.log("Loading subjective exam:", selectedSet.displayName);
    
    const state = AppState.examState;
    state.type = 'subjective';
    state.currentSet = selectedSet.displayName;
    state.currentFileName = selectedSet.fileName;
    state.totalTime = 3 * 60 * 60;
    
    const examSetSelection = getDOMElement('exam-set-selection');
    const subjectiveExam = getDOMElement('subjective-exam');
    const examTitle = getDOMElement('subjective-exam-title');
    const questionsContainer = getDOMElement('subjective-exam-questions');
    
    if (!examSetSelection || !subjectiveExam || !examTitle || !questionsContainer) return;
    
    hideElement(examSetSelection);
    showElement(subjectiveExam);
    examTitle.textContent = `Subjective Exam - ${selectedSet.displayName}`;
    
    questionsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading exam questions...</div>';
    
    await loadSubjectiveExamContent(selectedSet.fileName, selectedSet.displayName);
    startTimer('subjective');
}

async function loadMCQExam(fileName, displayName) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam/${fileName}`;
    
    console.log(`Loading MCQ exam from: ${filePath}`);
    
    try {
        const jsonData = await getJsonFileFromGitHub(filePath);
        
        if (!jsonData) {
            console.error('No JSON data received for:', filePath);
            throw new Error('No JSON data received');
        }
        
        console.log(`JSON data loaded:`, Array.isArray(jsonData) ? `Array with ${jsonData.length} items` : 'Not an array');
        
        let questions = [];
        
        if (Array.isArray(jsonData)) {
            questions = jsonData.map((q, index) => {
                // Ensure all required fields exist
                const questionObj = {
                    id: `exam_${fileName}_${index}`,
                    question: q.question || `Question ${index + 1}`,
                    options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
                    correct: q.correct || (q.options && q.options[0]) || "A",
                    explanation: q.explanation || "No explanation provided"
                };
                
                // Validate options array
                if (!Array.isArray(questionObj.options) || questionObj.options.length === 0) {
                    console.warn(`Invalid options for question ${index + 1}, using defaults`);
                    questionObj.options = ["Option A", "Option B", "Option C", "Option D"];
                }
                
                // Ensure correct answer exists in options
                if (!questionObj.options.includes(questionObj.correct)) {
                    console.warn(`Correct answer "${questionObj.correct}" not in options for question ${index + 1}`);
                    questionObj.correct = questionObj.options[0];
                }
                
                return questionObj;
            });
        } else {
            console.warn('Unexpected JSON format, expected array');
            return [{
                id: `exam_${fileName}_0`,
                question: "Check your JSON file format. Expected an array of question objects.",
                options: ["Should be: [{question:'...', options:[], correct:'', explanation:''}]", "Array format required", "Direct array of objects", "Check JSON structure"],
                correct: "Should be: [{question:'...', options:[], correct:'', explanation:''}]",
                explanation: "Your JSON should be a direct array of question objects with question, options, correct, and explanation fields."
            }];
        }
        
        if (questions.length === 0) {
            console.warn('No questions loaded from JSON');
            return [getEmptyQuestionSet('Exam', displayName)];
        }
        
        console.log(`Successfully loaded ${questions.length} questions`);
        return questions;
        
    } catch (error) {
        console.error(`Error loading MCQ exam from ${fileName}:`, error);
        return [{
            id: `error_${fileName}_0`,
            question: `Error loading questions for ${displayName}`,
            options: ["JSON file not found", "Check GitHub path", "Verify file exists", "Contact admin"],
            correct: "JSON file not found",
            explanation: `Could not load ${fileName} from GitHub. Please check: 1) File exists, 2) JSON format is valid, 3) File is in correct folder.`
        }];
    }
}

async function loadSubjectiveExamContent(fileName, displayName) {
    const field = AppState.currentField;
    
    try {
        const filePath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Subjective Exam/${fileName}`;
        const jsonData = await getJsonFileFromGitHub(filePath);
        
        if (!jsonData) {
            throw new Error('No JSON data received');
        }
        
        let contentHtml = '';
        let totalQuestions = 0;
        let totalMarks = 0;
        
        if (Array.isArray(jsonData)) {
            contentHtml = createSubjectiveExamHTML(jsonData, displayName);
            totalQuestions = jsonData.length;
            totalMarks = jsonData.reduce((sum, q) => sum + (q.marks || 0), 0);
            
        } else if (jsonData.questions && Array.isArray(jsonData.questions)) {
            contentHtml = createSubjectiveExamHTML(jsonData.questions, displayName);
            totalQuestions = jsonData.questions.length;
            totalMarks = jsonData.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
            
        } else {
            console.warn('Unexpected JSON format, using demo content');
            displayDemoSubjectiveContent(displayName);
            return;
        }
        
        const questionsContainer = getDOMElement('subjective-exam-questions');
        if (questionsContainer) {
            questionsContainer.innerHTML = contentHtml;
        }
        
        const totalQuestionsElement = document.getElementById('subjective-total-questions');
        const totalMarksElement = document.getElementById('subjective-total-marks');
        
        if (totalQuestionsElement) totalQuestionsElement.textContent = totalQuestions;
        if (totalMarksElement) totalMarksElement.textContent = totalMarks;
        
        console.log(`Loaded subjective exam: ${totalQuestions} questions, ${totalMarks} total marks`);
        
    } catch (error) {
        console.error('Error loading subjective exam content:', error);
        displayDemoSubjectiveContent(displayName);
    }
}

function createSubjectiveExamHTML(questions, examName) {
    let html = `
        <div class="exam-instructions">
            <h4><i class="fas fa-info-circle"></i> Exam Instructions:</h4>
            <ul>
                <li>Answer all questions in the provided answer booklet or your own paper</li>
                <li>Scan your answers as a single PDF file</li>
                <li>Make sure your writing is clear and legible</li>
                <li>Write your name and exam set on every page</li>
                <li>Upload your answer sheet before time expires</li>
            </ul>
        </div>
    `;
    
    questions.forEach((q, index) => {
        const questionNum = index + 1;
        const marks = q.marks || 5;
        
        html += `
            <div class="subjective-question-item">
                <div class="subjective-question-header">
                    <div class="question-number-circle">${questionNum}</div>
                    <div class="subjective-question-text">${q.question || `Question ${questionNum}`}</div>
                </div>
                <div class="question-marks">
                    <i class="fas fa-star"></i> Marks: ${marks}
                </div>
                ${q.subquestions ? `
                    <div class="subquestions">
                        ${q.subquestions.map((sq, sqIndex) => `
                            <div class="subquestion">
                                <strong>(${String.fromCharCode(97 + sqIndex)})</strong> ${sq}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    return html;
}

function displayDemoSubjectiveContent(displayName) {
    const demoQuestions = [
        {
            question: "Explain the fundamental principles of structural analysis and their applications in civil engineering design.",
            marks: 10,
            subquestions: [
                "Define the three main types of structural loads",
                "Explain the concept of stress and strain with examples",
                "Describe the difference between static and dynamic analysis"
            ]
        },
        {
            question: "Discuss the factors affecting the selection of construction materials for different types of structures.",
            marks: 8
        },
        {
            question: "Calculate the required reinforcement for a simply supported beam with given dimensions and loading conditions.",
            marks: 12
        },
        {
            question: "Describe the quality control procedures for concrete construction projects.",
            marks: 7
        },
        {
            question: "Analyze the environmental impact assessment process for large infrastructure projects.",
            marks: 10
        }
    ];
    
    const contentHtml = createSubjectiveExamHTML(demoQuestions, displayName);
    const questionsContainer = getDOMElement('subjective-exam-questions');
    if (questionsContainer) {
        questionsContainer.innerHTML = contentHtml;
    }
    
    const totalQuestions = demoQuestions.length;
    const totalMarks = demoQuestions.reduce((sum, q) => sum + q.marks, 0);
    
    const totalQuestionsElement = document.getElementById('subjective-total-questions');
    const totalMarksElement = document.getElementById('subjective-total-marks');
    
    if (totalQuestionsElement) totalQuestionsElement.textContent = totalQuestions;
    if (totalMarksElement) totalMarksElement.textContent = totalMarks;
}

function getEmptyQuestionSet(subject, chapter) {
    return {
        id: `${subject}_${chapter}_0`,
        question: "No questions found in the JSON file.",
        options: ["Check file format", "Add questions to JSON", "Verify file path", "Contact admin"],
        correct: "Check file format",
        explanation: "Make sure your JSON file follows the correct format."
    };
}

function getErrorQuestionSet(subject, chapter, fileName) {
    return {
        id: `${subject}_${chapter}_0`,
        question: `Error loading questions for ${subject} - ${chapter}`,
        options: ["JSON file not found", "Check GitHub path", "Verify file exists", "Contact admin"],
        correct: "JSON file not found",
        explanation: `Could not load ${fileName} from your GitHub repository.`
    };
}

// ==============================================
// EXAM NAVIGATION FUNCTIONS
// ==============================================

function loadMCQExamQuestion() {
    const state = AppState.examState;
    if (!state.questions || state.questions.length === 0) {
        console.error("No questions available");
        return;
    }
    
    // FIX: Make sure we're accessing the correct question
    const questionIndex = state.currentQuestionIndex;
    const question = state.questions[questionIndex]; // This should get question 0, 1, 2, 3, etc.
    console.log(`Loading question ${questionIndex + 1} of ${state.questions.length}`);

    const multipleChoiceContainer = getDOMElement('multiple-choice-container');
    const currentExamQuestion = getDOMElement('current-exam-question');
    const totalExamQuestions = getDOMElement('total-exam-questions');
    const prevExamQuestion = getDOMElement('prev-exam-question');
    const nextExamQuestion = getDOMElement('next-exam-question');
    const flagExamQuestion = getDOMElement('flag-exam-question');
    
    if (!multipleChoiceContainer || !currentExamQuestion || !totalExamQuestions) return;
    
    multipleChoiceContainer.innerHTML = `
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
                        <div class="${optionClass}" data-exam-option="${option}" onclick="handleExamOptionClick(this)">
                            <div class="option-letter">${optionLetter}</div>
                            <div>${option}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    currentExamQuestion.textContent = state.currentQuestionIndex + 1;
    totalExamQuestions.textContent = state.questions.length;
    
    if (prevExamQuestion) {
        prevExamQuestion.disabled = state.currentQuestionIndex === 0;
    }
    
    if (nextExamQuestion) {
        nextExamQuestion.disabled = state.currentQuestionIndex === state.questions.length - 1;
    }
    
    if (flagExamQuestion) {
        if (state.flagged[state.currentQuestionIndex]) {
            flagExamQuestion.innerHTML = '<i class="fas fa-flag"></i> Unflag';
            flagExamQuestion.style.backgroundColor = '#e74c3c';
        } else {
            flagExamQuestion.innerHTML = '<i class="far fa-flag"></i> Flag';
            flagExamQuestion.style.backgroundColor = '';
        }
    }
    
    updateMCQExamProgress();
}

window.handleExamOptionClick = function(optionElement) {
    const optionValue = optionElement.dataset.examOption;
    const questionIndex = AppState.examState.currentQuestionIndex;
    
    const optionsContainer = optionElement.closest('.mcq-options');
    if (optionsContainer) {
        optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }
    
    optionElement.classList.add('selected');
    AppState.examState.answers[questionIndex] = optionValue;
    updateMCQExamProgress();
};

async function loadMCQExamQuestions(fileName) {
    const field = AppState.currentField;
    const filePath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam/${fileName}`;
    
    console.log(`Loading questions from: ${filePath}`);
    
    try {
        // Direct URL to raw JSON file
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${encodeURIComponent(filePath)}`;
        console.log(`Raw URL: ${rawUrl}`);
        
        const response = await fetch(rawUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        console.log('Loaded JSON data:', jsonData);
        
        if (!Array.isArray(jsonData)) {
            throw new Error('JSON data is not an array');
        }
        
        // Process questions
        const questions = jsonData.map((q, index) => {
            return {
                id: index + 1,
                question: q.question || `Question ${index + 1}`,
                options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
                correct: q.correct || 'A',
                explanation: q.explanation || 'No explanation provided'
            };
        });
        
        console.log(`Processed ${questions.length} questions`);
        return questions;
        
    } catch (error) {
        console.error('Error loading MCQ exam questions:', error);
        
        // Return demo questions if loading fails
        return [
            {
                id: 1,
                question: "Sample Question 1: What is the capital of Nepal?",
                options: ["Kathmandu", "Pokhara", "Birgunj", "Butwal"],
                correct: "Kathmandu",
                explanation: "Kathmandu is the capital city of Nepal."
            },
            {
                id: 2,
                question: "Sample Question 2: Which cement property is tested using Vicat apparatus?",
                options: ["Fineness", "Consistency", "Soundness", "Compressive strength"],
                correct: "Consistency",
                explanation: "Vicat apparatus determines standard consistency of cement paste."
            },
            {
                id: 3,
                question: "Sample Question 3: The minimum compressive strength of first class brick is:",
                options: ["3.5 MPa", "5.0 MPa", "7.5 MPa", "10.5 MPa"],
                correct: "10.5 MPa",
                explanation: "First class bricks should have minimum compressive strength of 10.5 MPa."
            }
        ];
    }
}

async function startMCQExam(selectedSet) {
    console.log('Starting MCQ exam with set:', selectedSet);
    
    try {
        // Show loading state
        const multipleChoiceContainer = document.getElementById('multiple-choice-container');
        if (multipleChoiceContainer) {
            multipleChoiceContainer.innerHTML = '<div class="loading">Loading questions...</div>';
        }
        
        // Load questions
        const questions = await loadMCQExamQuestions(selectedSet.fileName);
        console.log('Questions loaded:', questions);
        
        if (questions.length === 0) {
            throw new Error('No questions loaded');
        }
        
        // Update app state
        AppState.examState.type = 'mcq';
        AppState.examState.currentSet = selectedSet.displayName;
        AppState.examState.questions = questions;
        AppState.examState.currentQuestionIndex = 0;
        AppState.examState.answers = {};
        AppState.examState.flagged = {};
        
        // Show MCQ exam section
        document.getElementById('exam-type-selection').style.display = 'none';
        document.getElementById('exam-set-selection').style.display = 'none';
        document.getElementById('multiple-choice-exam').style.display = 'block';
        
        // Update title
        const titleElement = document.getElementById('multiple-choice-exam-title');
        if (titleElement) {
            titleElement.textContent = `MCQ Exam - ${selectedSet.displayName}`;
        }
        
        // Update progress
        updateMCQExamProgress();
        
        // Display first question
        displayMCQQuestion();
        
        // Start timer
        startMCQTimer();
        
        console.log('MCQ exam started successfully');
        
    } catch (error) {
        console.error('Error starting MCQ exam:', error);
        alert(`Failed to start exam: ${error.message}`);
        resetExamTypeSelection();
    }
}



function displayMCQQuestion() {
    const state = AppState.examState;
    
    // Check if we have questions
    if (!state.questions || state.questions.length === 0) {
        console.error("No questions available");
        const container = document.getElementById('multiple-choice-container');
        if (container) {
            container.innerHTML = '<div class="error-message">No questions available</div>';
        }
        return;
    }
    
    // Get the current question index (should be 0, 1, 2, 3...)
    const questionIndex = state.currentQuestionIndex;
    
    // Ensure index is within bounds
    if (questionIndex < 0 || questionIndex >= state.questions.length) {
        console.error(`Invalid question index: ${questionIndex}, total questions: ${state.questions.length}`);
        return;
    }
    
    // Get the question at the current index
    const question = state.questions[questionIndex];
    
    if (!question) {
        console.error(`No question found at index ${questionIndex}`);
        return;
    }
    
    // Get user's answer for this question
    const userAnswer = state.answers[questionIndex];
    const isFlagged = state.flagged[questionIndex] || false;
    
    // Get the container
    const container = document.getElementById('multiple-choice-container');
    if (!container) {
        console.error("Multiple choice container not found");
        return;
    }
    
    // Calculate question number (display as 1, 2, 3...)
    const questionNumber = questionIndex + 1;
    
    console.log(`Displaying question ${questionNumber} of ${state.questions.length}`);
    
    // Create the question HTML
    container.innerHTML = `
        <div class="mcq-question-container">
            <div class="question-number-badge">
                Question ${questionNumber}
                ${isFlagged ? '<span style="color: #e74c3c; margin-left: 10px;"><i class="fas fa-flag"></i> Flagged</span>' : ''}
            </div>
            <div class="mcq-question">${question.question}</div>
            <div class="mcq-options" id="exam-options-${questionIndex}">
                ${question.options.map((option, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
                    const isSelected = userAnswer === option;
                    const optionClass = `mcq-option ${isSelected ? 'selected' : ''}`;
                    
                    return `
                        <div class="${optionClass}" 
                             data-question-index="${questionIndex}" 
                             data-option="${option}"
                             onclick="handleExamOptionClick(this)">
                            <div class="option-letter">${optionLetter}</div>
                            <div>${option}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // Update question counter
    const currentElement = document.getElementById('current-exam-question');
    const totalElement = document.getElementById('total-exam-questions');
    
    if (currentElement) {
        currentElement.textContent = questionNumber; // Show 1, 2, 3...
    }
    if (totalElement) {
        totalElement.textContent = state.questions.length;
    }
    
    // Update navigation buttons state
    const prevButton = document.getElementById('prev-exam-question');
    const nextButton = document.getElementById('next-exam-question');
    const flagButton = document.getElementById('flag-exam-question');
    
    if (prevButton) {
        prevButton.disabled = questionIndex === 0;
    }
    if (nextButton) {
        nextButton.disabled = questionIndex === state.questions.length - 1;
    }
    if (flagButton) {
        flagButton.innerHTML = isFlagged ? 
            '<i class="fas fa-flag"></i> Unflag' : 
            '<i class="far fa-flag"></i> Flag';
        flagButton.style.backgroundColor = isFlagged ? '#e74c3c' : '';
    }
    
    // Update progress indicators
    updateMCQExamProgress();
}

// Helper function for option selection
window.handleExamOptionClick = function(optionElement) {
    const questionIndex = parseInt(optionElement.dataset.questionIndex);
    const selectedOption = optionElement.dataset.option;
    
    // Remove selected class from all options in this question
    const optionsContainer = optionElement.closest('.mcq-options');
    if (optionsContainer) {
        optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }
    
    // Add selected class to clicked option
    optionElement.classList.add('selected');
    
    // Save the answer
    AppState.examState.answers[questionIndex] = selectedOption;
    
    // Update progress
    updateMCQExamProgress();
};

// Function to update progress display
function updateMCQExamProgress() {
    const state = AppState.examState;
    const total = state.questions.length;
    const answered = Object.keys(state.answers).length;
    
    const totalElement = document.getElementById('mcq-total-questions');
    const answeredElement = document.getElementById('mcq-answered-questions');
    const remainingElement = document.getElementById('mcq-remaining-questions');
    
    if (totalElement) totalElement.textContent = total;
    if (answeredElement) answeredElement.textContent = answered;
    if (remainingElement) remainingElement.textContent = total - answered;
}

function selectMCQOption(selectedOption) {
    const state = AppState.examState;
    const questionIndex = state.currentQuestionIndex;
    
    // Update user's answer
    state.answers[questionIndex] = selectedOption;
    
    // Update the display
    displayMCQQuestion();
    
    // Update progress
    updateMCQExamProgress();
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
    
    if (!timerElement) return;
    
    let remaining = totalTime;
    
    const updateTimer = () => {
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (remaining <= 0) {
            clearInterval(timer);
            if (type === 'mcq') {
                submitMCQExam();
            } else {
                alert('Time is up! Your subjective exam will be submitted.');
                resetExamTypeSelection();
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
    
    AppState.examState.timer = timer;
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
    
    const mcqExam = getDOMElement('multiple-choice-exam');
    const examResults = getDOMElement('exam-results');
    
    if (!mcqExam || !examResults) return;
    
    hideElement(mcqExam);
    showElement(examResults);
    
    const scoreElement = document.getElementById('exam-score');
    const correctAnswersElement = document.getElementById('exam-correct-answers');
    const totalQuestionsElement = document.getElementById('exam-total-questions');
    const correctCountElement = document.getElementById('correct-count');
    const wrongCountElement = document.getElementById('wrong-count');
    const skippedCountElement = document.getElementById('skipped-count');
    
    if (scoreElement) scoreElement.textContent = percentage + '%';
    if (correctAnswersElement) correctAnswersElement.textContent = correct;
    if (totalQuestionsElement) totalQuestionsElement.textContent = state.questions.length;
    if (correctCountElement) correctCountElement.textContent = correct;
    if (wrongCountElement) wrongCountElement.textContent = wrong;
    if (skippedCountElement) skippedCountElement.textContent = skipped;
}

function resetExamTypeSelection() {
    const elements = [
        'exam-set-selection',
        'subjective-exam', 
        'multiple-choice-exam',
        'exam-results',
        'exam-type-selection'
    ];
    
    elements.forEach(id => {
        const element = getDOMElement(id);
        if (element) hideElement(element);
    });
    
    showElement(getDOMElement('exam-type-selection'));
    
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
// PAYMENT SYSTEM
// ==============================================

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
    
    let selectedGateway = 'esewa';
    
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
    
    modal.querySelector('.close-payment-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-payment').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#proceed-payment').addEventListener('click', () => {
        processPayment(selectedGateway, examType, examSet, modal);
    });
    
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
    
    modal.querySelector('.payment-modal-body').innerHTML = `
        <div class="payment-loading">
            <div class="payment-spinner"></div>
            <p>Processing ${gateway === 'esewa' ? 'eSewa' : 'Khalti'} payment...</p>
            <p class="demo-notice" style="margin-top: 1rem;">
                <i class="fas fa-info-circle"></i> Demo mode: Simulating payment process
            </p>
        </div>
    `;
    
    setTimeout(() => {
        const success = true;
        
        if (success) {
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
            
            markSetAsPurchased(examType === 'subjective' ? 'subjective' : 'mcq', examSet.displayName);
            
            modal.querySelector('#access-exam').addEventListener('click', () => {
                document.body.removeChild(modal);
                if (examType === 'subjective') {
                    openSubjectiveExamAfterPayment(examSet);
                } else {
                    openMCQExamAfterPayment(examSet);
                }
            });
            
        } else {
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
        
        const examSetSelection = getDOMElement('exam-set-selection');
        const subjectiveExam = getDOMElement('subjective-exam');
        const examTitle = getDOMElement('subjective-exam-title');
        
        if (!examSetSelection || !subjectiveExam || !examTitle) return;
        
        hideElement(examSetSelection);
        showElement(subjectiveExam);
        examTitle.textContent = `Subjective Exam - ${selectedSet.displayName}`;
        
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
        
        const examSetSelection = getDOMElement('exam-set-selection');
        const mcqExam = getDOMElement('multiple-choice-exam');
        const examTitle = getDOMElement('multiple-choice-exam-title');
        
        if (!examSetSelection || !mcqExam || !examTitle) return;
        
        hideElement(examSetSelection);
        showElement(mcqExam);
        examTitle.textContent = `Multiple Choice Exam - ${selectedSet.displayName}`;
        
        loadMCQExamQuestion();
        startTimer('mcq');
        
    } catch (error) {
        console.error('Error opening MCQ exam after payment:', error);
        alert(`Failed to load exam questions from ${selectedSet.fileName}.`);
    }
}

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
            if (confirm('Are you sure you want to submit your MCQ exam?')) {
                submitMCQExam();
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
        border-radius: 8px;
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
// INITIALIZATION FUNCTIONS
// ==============================================

function init() {
    console.log("Initializing application...");
    console.log("GitHub Config:", GITHUB_CONFIG);
    console.log("Field Config:", FIELD_CONFIG);
    console.log("Current Field:", AppState.currentField);
    
    initializeDOMReferences();
    setupEventListeners();
    setupExamEventListeners();
    loadField('civil');
    updateFieldIndicators();
    initPaymentSystem();
    console.log("Application initialized successfully");
}

function setupExamEventListeners() {
    console.log('Setting up exam event listeners');
    
    // Exam type selection
    document.querySelectorAll('.exam-type-card').forEach(card => {
        card.addEventListener('click', function() {
            const examType = this.dataset.examType;
            if (examType === 'multiple-choice') {
                showMCQExamSets();
            } else if (examType === 'subjective') {
                showSubjectiveExamSets();
            }
        });
    });
    
    // MCQ exam navigation
    document.getElementById('prev-exam-question')?.addEventListener('click', () => {
        if (AppState.examState.currentQuestionIndex > 0) {
            AppState.examState.currentQuestionIndex--;
            displayMCQQuestion();
        }
    });
    
    document.getElementById('next-exam-question')?.addEventListener('click', () => {
        if (AppState.examState.currentQuestionIndex < AppState.examState.questions.length - 1) {
            AppState.examState.currentQuestionIndex++;
            displayMCQQuestion();
        }
    });
    
    document.getElementById('flag-exam-question')?.addEventListener('click', () => {
        const index = AppState.examState.currentQuestionIndex;
        AppState.examState.flagged[index] = !AppState.examState.flagged[index];
        displayMCQQuestion();
    });
    
    document.getElementById('submit-mcq-exam')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to submit your exam?')) {
            submitMCQExam();
        }
    });
    
    // Back buttons
    document.getElementById('back-to-exam-type')?.addEventListener('click', resetExamTypeSelection);
    document.getElementById('back-to-exam-type-mcq')?.addEventListener('click', resetExamTypeSelection);
    document.getElementById('back-to-exam-type-results')?.addEventListener('click', resetExamTypeSelection);
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
