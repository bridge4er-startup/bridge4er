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
    
    // Store commonly used elements
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
// FILE LOADING FUNCTIONS (OPTIMIZED - ISSUE 1 FIX)
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
            list.innerHTML = 
                '<li style="text-align: center; padding: 2rem;"><p>No notice files available.</p></li>';
            return;
        }
        
        // Render first 5 files immediately
        renderFirstFiles('notice-list', files.slice(0, 5), 'notice');
        
        // Load remaining files in background
        if (files.length > 5) {
            setTimeout(() => {
                renderRemainingFiles('notice-list', files.slice(5), 'notice');
            }, 100);
        }
        
    } catch (error) {
        console.error('Error loading notice files:', error);
        handleFileLoadError('notice', 'notice files');
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
            list.innerHTML = 
                '<li style="text-align: center; padding: 2rem;"><p>No syllabus files available.</p></li>';
            return;
        }
        
        // Render first 5 files immediately
        renderFirstFiles('syllabus-list', files.slice(0, 5), 'syllabus');
        
        // Load remaining files in background
        if (files.length > 5) {
            setTimeout(() => {
                renderRemainingFiles('syllabus-list', files.slice(5), 'syllabus');
            }, 100);
        }
        
    } catch (error) {
        console.error('Error loading syllabus files:', error);
        handleFileLoadError('syllabus', 'syllabus files');
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
            list.innerHTML = 
                '<li style="text-align: center; padding: 2rem;"><p>No old question papers available.</p></li>';
            return;
        }
        
        // Render first 5 files immediately
        renderFirstFiles('old-questions-list', files.slice(0, 5), 'old-questions');
        
        // Load remaining files in background
        if (files.length > 5) {
            setTimeout(() => {
                renderRemainingFiles('old-questions-list', files.slice(5), 'old-questions');
            }, 100);
        }
        
    } catch (error) {
        console.error('Error loading old questions:', error);
        handleFileLoadError('old-questions', 'old questions');
    }
}

function renderFirstFiles(listId, files, type = 'generic') {
    const list = getDOMElement(listId);
    if (!list) return;
    
    list.innerHTML = files.map(file => createFileListItem(file, type)).join('');
}

function renderRemainingFiles(listId, files, type = 'generic') {
    const list = getDOMElement(listId);
    if (!list) return;
    
    const fragment = document.createDocumentFragment();
    files.forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = createFileListItem(file, type);
        fragment.appendChild(li);
    });
    list.appendChild(fragment);
}

function createFileListItem(file, type = 'generic') {
    const fileName = file.name;
    const friendlyName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const fileSize = formatFileSize(file.size || 0);
    const fileExt = fileName.split('.').pop().toLowerCase();
    const iconClass = getFileIconClass(fileExt);
    
    let extraInfo = '';
    
    if (type === 'old-questions') {
        const year = extractYearFromFilename(fileName);
        extraInfo = `Year: ${year} | `;
    }
    
    return `
        <div class="file-info">
            <div class="file-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="file-details">
                <h4>${friendlyName}</h4>
                <p>${extraInfo}Size: ${fileSize}</p>
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
    `;
}

function handleFileLoadError(section, type) {
    hideElement(getDOMElement(`${section}-loading`));
    
    const listElement = getDOMElement(`${section}-list`);
    if (listElement) {
        listElement.innerHTML = 
            `<li style="text-align: center; padding: 2rem; color: #e74c3c;">
                <p><i class="fas fa-exclamation-triangle"></i> Error loading ${type}.</p>
            </li>`;
        showElement(listElement);
    }
}

// ==============================================
// DEBOUNCED SEARCH FUNCTIONALITY
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
            stateKey: 'notice',
            resultsId: 'notice-results-info'
        },
        { 
            inputId: 'syllabus-search', 
            btnId: 'syllabus-search-btn', 
            listId: 'syllabus-list',
            stateKey: 'syllabus',
            resultsId: 'syllabus-results-info'
        },
        { 
            inputId: 'old-questions-search', 
            btnId: 'old-questions-search-btn', 
            listId: 'old-questions-list',
            stateKey: 'oldQuestions',
            resultsId: 'old-questions-results-info'
        }
    ];

    searchConfigs.forEach(config => {
        const input = getDOMElement(config.inputId);
        const button = getDOMElement(config.btnId);
        const resultsInfo = getDOMElement(config.resultsId);
        
        if (!input || !button) return;

        const performSearch = debounce(() => {
            const searchTerm = input.value.toLowerCase();
            AppState.searchState[config.stateKey] = searchTerm;
            filterFileList(config.listId, searchTerm, resultsInfo);
        }, 300);

        input.addEventListener('input', performSearch);
        button.addEventListener('click', performSearch);
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    });
}

function filterFileList(listId, searchTerm, resultsInfo = null) {
    const list = getDOMElement(listId);
    if (!list) return;
    
    const items = list.querySelectorAll('li');
    let visibleCount = 0;
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isVisible = searchTerm === '' || text.includes(searchTerm);
        
        item.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
    });
    
    if (resultsInfo) {
        resultsInfo.textContent = searchTerm === '' 
            ? `Showing all ${visibleCount} items`
            : `Found ${visibleCount} items matching "${searchTerm}"`;
    }
}

// ==============================================
// MCQ FUNCTIONS (OPTIMIZED)
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
        const subjects = await getSubjectsFromGitHub(folderPath);
        
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

async function getSubjectsFromGitHub(folderPath) {
    try {
        const response = await fetchWithRetry(getGitHubApiUrl(folderPath));
        
        if (!response.ok) {
            return [];
        }
        
        const data = await response.json();
        return Array.isArray(data) 
            ? data.filter(item => item.type === 'dir').map(item => item.name).sort()
            : [];
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return [];
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
        subjectGrid.innerHTML = 
            '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No MCQ subjects available.</p></div>';
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

// ==============================================
// PAYMENT SYSTEM (ISSUE 2 FIX)
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
// EXAM FUNCTIONS (ISSUE 3 FIX - BUTTONS FIXED)
// ==============================================

async function discoverExamSets(folderPath) {
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        return files
            .filter(file => file.name.toLowerCase().endsWith('.json'))
            .map((file, index) => {
                const setName = file.name.replace(/\.json$/i, '').replace(/_/g, ' ').trim();
                return {
                    name: setName || file.name.replace('.json', ''),
                    fileName: file.name,
                    displayName: setName || file.name.replace('.json', ''),
                    path: file.path,
                    download_url: file.download_url,
                    isFree: index < 2, // First 2 sets are free
                    price: index < 2 ? 0 : (folderPath.includes('Subjective') ? 100 : 50)
                };
            })
            .sort((a, b) => a.displayName.localeCompare(b.displayName));
        
    } catch (error) {
        console.error('Error discovering exam sets:', error);
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
        }
        
        return questions.length > 0 ? questions : [getEmptyQuestionSet('Exam', displayName)];
        
    } catch (error) {
        console.error('Error loading MCQ exam:', error);
        return [getErrorQuestionSet('Exam', displayName, fileName)];
    }
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
// EXAM NAVIGATION FUNCTIONS (FIXED BUTTONS)
// ==============================================

async function showMCQExamSetSelection() {
    console.log("Showing MCQ exam set selection");
    
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam`;
    
    try {
        const examSets = await discoverExamSets(folderPath);
        
        if (examSets.length === 0) {
            alert('No exam sets found. Please upload JSON files to your "Take Exam/Multiple Choice Exam/" folder.');
            resetExamTypeSelection();
            return;
        }
        
        const examTypeSelection = getDOMElement('exam-type-selection');
        const examSetSelection = getDOMElement('exam-set-selection');
        
        if (!examTypeSelection || !examSetSelection) return;
        
        hideElement(examTypeSelection);
        showElement(examSetSelection);
        
        AppState.examState.mcqSets = examSets;
        
        renderExamSetSelection(examSets, 'mcq');
        
    } catch (error) {
        console.error('Error loading MCQ exam sets:', error);
        alert('Failed to load exam sets. Please try again.');
        resetExamTypeSelection();
    }
}

async function showSubjectiveExamSetSelection() {
    console.log("Showing subjective exam set selection");
    
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Subjective Exam`;
    
    try {
        const examSets = await discoverExamSets(folderPath);
        
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
        
        renderExamSetSelection(examSets, 'subjective');
        
    } catch (error) {
        console.error('Error loading subjective exam sets:', error);
        alert('Failed to load exam sets. Please try again.');
        resetExamTypeSelection();
    }
}

function renderExamSetSelection(examSets, examType) {
    const examSetSelection = getDOMElement('exam-set-selection');
    if (!examSetSelection) return;
    
    const isMCQ = examType === 'mcq';
    const icon = isMCQ ? 'fa-file-alt' : 'fa-file-pdf';
    const examName = isMCQ ? 'Multiple Choice Exam' : 'Subjective Exam';
    const time = isMCQ ? '30 minutes' : '3 hours';
    
    examSetSelection.innerHTML = `
        <h3>Select ${examName} Set:</h3>
        <div class="subject-grid" style="margin-top: 1.5rem;" id="${examType}-exam-set-grid">
            ${examSets.map((set, index) => {
                const isPurchased = isSetPurchased(examType, set.displayName);
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
                         data-exam-type="${examType}">
                        ${!canAccess ? '<div class="lock-badge"><i class="fas fa-lock"></i></div>' : ''}
                        <i class="fas ${icon}"></i>
                        <h3>${set.displayName}</h3>
                        <p>${examName}</p>
                        <small>${time} • ${priceBadge}</small>
                        ${!canAccess ? '<p style="color: var(--accent-color); margin-top: 0.5rem; font-size: 0.9rem;"><i class="fas fa-lock"></i> Requires Purchase</p>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="demo-notice" style="margin-top: 1.5rem;">
            <i class="fas fa-info-circle"></i> Sets A & B are free. Others require purchase. Demo payment system enabled.
        </div>
        <button class="btn btn-secondary" id="back-to-exam-type-from-set" style="margin-top: 1.5rem;">
            <i class="fas fa-arrow-left"></i> Back to Exam Type
        </button>
    `;
    
    // Add event listeners
    setTimeout(() => {
        document.querySelectorAll(`#${examType}-exam-set-grid .subject-card`).forEach(card => {
            card.addEventListener('click', async () => {
                const setIndex = parseInt(card.dataset.examIndex);
                const selectedSet = examSets[setIndex];
                const canAccess = card.dataset.canAccess === 'true';
                
                if (canAccess) {
                    if (isMCQ) {
                        await loadAndStartMCQExam(selectedSet);
                    } else {
                        await loadAndStartSubjectiveExam(selectedSet);
                    }
                } else {
                    showPaymentModal(examType, selectedSet);
                }
            });
        });
        
        const backButton = document.getElementById('back-to-exam-type-from-set');
        if (backButton) {
            backButton.addEventListener('click', resetExamTypeSelection);
        }
    }, 100);
}

async function loadAndStartMCQExam(selectedSet) {
    console.log("Loading MCQ exam:", selectedSet.displayName);
    
    try {
        const state = AppState.examState;
        state.type = 'multiple-choice';
        state.currentSet = selectedSet.displayName;
        state.currentFileName = selectedSet.fileName;
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.flagged = {};
        state.totalTime = 30 * 60;
        
        const loadingHTML = '<div style="text-align: center; padding: 2rem;">Loading exam questions...</div>';
        const container = getDOMElement('multiple-choice-container');
        if (container) container.innerHTML = loadingHTML;
        
        state.questions = await loadMCQExam(selectedSet.fileName, selectedSet.displayName);
        
        if (state.questions.length === 0) {
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
        console.error('Error loading exam set:', error);
        alert(`Failed to load exam questions from ${selectedSet.fileName}.`);
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

function loadMCQExamQuestion() {
    console.log("Loading MCQ exam question:", AppState.examState.currentQuestionIndex);
    
    const state = AppState.examState;
    if (!state.questions || state.questions.length === 0) {
        console.error("No questions available");
        return;
    }
    
    const question = state.questions[state.currentQuestionIndex];
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
        prevExamQuestion.onclick = () => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex--;
                loadMCQExamQuestion();
            }
        };
    }
    
    if (nextExamQuestion) {
        nextExamQuestion.disabled = state.currentQuestionIndex === state.questions.length - 1;
        nextExamQuestion.onclick = () => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex++;
                loadMCQExamQuestion();
            }
        };
    }
    
    if (flagExamQuestion) {
        if (state.flagged[state.currentQuestionIndex]) {
            flagExamQuestion.innerHTML = '<i class="fas fa-flag"></i> Unflag';
            flagExamQuestion.style.backgroundColor = '#e74c3c';
        } else {
            flagExamQuestion.innerHTML = '<i class="far fa-flag"></i> Flag';
            flagExamQuestion.style.backgroundColor = '';
        }
        
        flagExamQuestion.onclick = () => {
            const index = state.currentQuestionIndex;
            state.flagged[index] = !state.flagged[index];
            loadMCQExamQuestion();
        };
    }
    
    updateMCQExamProgress();
}

// Global function for exam option clicks
window.handleExamOptionClick = function(optionElement) {
    const optionValue = optionElement.dataset.examOption;
    const questionIndex = AppState.examState.currentQuestionIndex;
    
    // Remove selection from all options in this container
    const optionsContainer = optionElement.closest('.mcq-options');
    if (optionsContainer) {
        optionsContainer.querySelectorAll('.mcq-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }
    
    // Select clicked option
    optionElement.classList.add('selected');
    
    // Store answer
    AppState.examState.answers[questionIndex] = optionValue;
    
    // Update progress
    updateMCQExamProgress();
};

function updateMCQExamProgress() {
    const total = AppState.examState.questions.length;
    const answered = Object.keys(AppState.examState.answers).length;
    
    const totalQuestionsElement = getDOMElement('mcq-total-questions');
    const answeredQuestionsElement = getDOMElement('mcq-answered-questions');
    const remainingQuestionsElement = getDOMElement('mcq-remaining-questions');
    
    if (totalQuestionsElement) totalQuestionsElement.textContent = total;
    if (answeredQuestionsElement) answeredQuestionsElement.textContent = answered;
    if (remainingQuestionsElement) remainingQuestionsElement.textContent = total - answered;
}

function startTimer(type) {
    console.log("Starting timer for:", type);
    
    // Clear any existing timer first
    if (type === 'subjective' && AppState.timers.subjectiveExam) {
        clearInterval(AppState.timers.subjectiveExam);
        AppState.timers.subjectiveExam = null;
    } else if (type === 'mcq' && AppState.timers.mcqExam) {
        clearInterval(AppState.timers.mcqExam);
        AppState.timers.mcqExam = null;
    }
    
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
    console.log("Submitting MCQ exam");
    
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
    
    // Update results
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
    console.log("Resetting exam type selection");
    
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
// EVENT LISTENERS (FIXED FOR BUTTONS - ISSUE 3)
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
        
        // Field options
        document.querySelectorAll('.field-option').forEach(option => {
            option.addEventListener('click', () => {
                const field = option.dataset.field;
                loadField(field);
                fieldDropdown.classList.remove('show');
            });
        });
        
        // Close dropdown when clicking outside
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
            
            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show section
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Reset practice sessions
            resetPracticeSessions();
            
            // Load section data if needed
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
        if (e.target.closest('.subject-card[data-subject][data-type="mcq"]')) {
            const card = e.target.closest('.subject-card[data-subject][data-type="mcq"]');
            const subject = card.dataset.subject;
            e.preventDefault();
            showChapterSelection(subject);
        }
        
        // MCQ Chapter Cards
        if (e.target.closest('.subject-card[data-chapter][data-type="mcq-chapter"]')) {
            const card = e.target.closest('.subject-card[data-chapter][data-type="mcq-chapter"]');
            const subject = card.dataset.subject;
            const chapterDisplayName = card.dataset.chapter;
            const chapterFileName = card.dataset.filename;
            e.preventDefault();
            startMCQPractice(subject, chapterDisplayName, chapterFileName);
        }
        
        // Exam Type Cards
        if (e.target.closest('.subject-card[data-exam-type]')) {
            const card = e.target.closest('.subject-card[data-exam-type]');
            const examType = card.dataset.examType;
            e.preventDefault();
            
            if (examType === 'subjective') {
                showSubjectiveExamSetSelection();
            } else if (examType === 'multiple-choice') {
                showMCQExamSetSelection();
            }
        }
    });
    
    // MCQ pagination buttons
    setupMCQPaginationListeners();
    
    // Subjective navigation buttons
    setupSubjectiveNavigationListeners();
    
    // Exam navigation buttons
    setupExamNavigationListeners();
    
    // Setup search
    setupSearch();
}

function setupMCQPaginationListeners() {
    const paginationSelectors = {
        '#first-page': () => {
            AppState.mcqState.currentPage = 1;
            renderCurrentPage();
        },
        '#prev-page': () => {
            if (AppState.mcqState.currentPage > 1) {
                AppState.mcqState.currentPage--;
                renderCurrentPage();
            }
        },
        '#next-page': () => {
            const totalPages = parseInt(getDOMElement('total-pages')?.textContent || '1');
            if (AppState.mcqState.currentPage < totalPages) {
                AppState.mcqState.currentPage++;
                renderCurrentPage();
            }
        },
        '#last-page': () => {
            AppState.mcqState.currentPage = parseInt(getDOMElement('total-pages')?.textContent || '1');
            renderCurrentPage();
        },
        '#questions-per-page': (e) => {
            const value = e.target.value;
            AppState.mcqState.questionsPerPage = value === 'all' ? 'all' : parseInt(value);
            AppState.mcqState.currentPage = 1;
            setupPagination();
            renderCurrentPage();
        },
        '#back-to-subjects': () => {
            const mcqPractice = getDOMElement('mcq-practice');
            const chapterSelection = getDOMElement('chapter-selection');
            if (mcqPractice && chapterSelection) {
                hideElement(mcqPractice);
                showElement(chapterSelection);
            }
        },
        '#back-to-subjects-from-chapter': () => {
            const chapterSelection = getDOMElement('chapter-selection');
            const subjectGrid = getDOMElement('subject-grid');
            if (chapterSelection && subjectGrid) {
                hideElement(chapterSelection);
                showElement(subjectGrid);
            }
        }
    };
    
    Object.entries(paginationSelectors).forEach(([selector, handler]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(selector.includes('select') ? 'change' : 'click', handler);
        }
    });
}

function setupSubjectiveNavigationListeners() {
    const subjectiveSelectors = {
        '#back-to-subjective-sets': () => {
            const subjectiveContent = getDOMElement('subjective-content');
            const chapterSelection = getDOMElement('subjective-chapter-selection');
            if (subjectiveContent && chapterSelection) {
                hideElement(subjectiveContent);
                showElement(chapterSelection);
            }
        },
        '#back-to-subjective-subjects': () => {
            const chapterSelection = getDOMElement('subjective-chapter-selection');
            const setGrid = getDOMElement('subjective-set-grid');
            if (chapterSelection && setGrid) {
                hideElement(chapterSelection);
                showElement(setGrid);
            }
        }
    };
    
    Object.entries(subjectiveSelectors).forEach(([selector, handler]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('click', handler);
        }
    });
}

function setupExamNavigationListeners() {
    const examSelectors = {
        '#submit-subjective-exam': () => {
            if (confirm('Are you sure you want to submit your subjective exam?')) {
                alert('Subjective exam submitted!');
                if (AppState.timers.subjectiveExam) clearInterval(AppState.timers.subjectiveExam);
                resetExamTypeSelection();
            }
        },
        '#submit-mcq-exam': submitMCQExam,
        '#back-to-exam-type': resetExamTypeSelection,
        '#back-to-exam-type-mcq': resetExamTypeSelection,
        '#back-to-exam-type-results': resetExamTypeSelection,
        '#view-answers': showExamAnswers
    };
    
    Object.entries(examSelectors).forEach(([selector, handler]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('click', handler);
        }
    });
}

// ==============================================
// INITIALIZATION FUNCTIONS
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
    
    // Clear cache
    clearGitHubCache();
    
    // Update state
    AppState.currentField = field;
    const config = FIELD_CONFIG[field];
    
    // Update UI
    const currentField = getDOMElement('current-field');
    const userField = getDOMElement('user-field');
    
    if (currentField) {
        currentField.innerHTML = `<i class="fas ${config.icon}"></i> ${config.name}`;
    }
    
    if (userField) {
        userField.textContent = config.name;
    }
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', config.color);
    
    const header = document.querySelector('header');
    if (header) {
        header.style.background = `linear-gradient(to right, ${config.color}, ${lightenColor(config.color, 20)})`;
    }
    
    // Update field indicators
    updateFieldIndicators();
    
    // Reset and reload all sections
    resetPracticeSessions();
    
    // Load initial data for active section
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
    const chapterSelection = getDOMElement('subjective-chapter-selection');
    
    if (subjectiveContent && chapterSelection) {
        hideElement(subjectiveContent);
        showElement(chapterSelection);
    }
};

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', loadComponents);
