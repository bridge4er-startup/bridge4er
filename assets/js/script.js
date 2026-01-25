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
// ENHANCED EXAM SET DISCOVERY WITH CONFIG PARSING
// ==============================================

async function discoverMCQExamSets() {
    const field = AppState.currentField;
    const folderPath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam`;
    
    try {
        const files = await listFilesFromGitHub(folderPath);
        
        if (!files || files.length === 0) {
            console.warn(`No files found in: ${folderPath}`);
            return generateDemoMCQSets();
        }
        
        const examSets = [];
        const jsonFiles = files.filter(file => {
            const fileName = file.name.toLowerCase();
            return fileName.endsWith('.json');
        });
        
        // Try to load config file for set-specific pricing and timing
        const configFile = files.find(file => file.name.toLowerCase() === 'config.json');
        let setConfigs = {};
        
        if (configFile) {
            try {
                const configData = await getJsonFileFromGitHub(configFile.path);
                if (configData && configData.sets) {
                    setConfigs = configData.sets;
                }
            } catch (error) {
                console.warn('Could not load config file, using defaults');
            }
        }
        
        jsonFiles.forEach((file, index) => {
            const fileName = file.name;
            const baseName = fileName.replace(/\.json$/i, '');
            const setName = baseName.replace(/_/g, ' ').trim();
            const isFree = index < EXAM_CONFIG.mcq.freeSets;
            
            // Get config for this specific set
            const setConfig = setConfigs[fileName] || setConfigs[setName] || {};
            
            // Use set-specific config or defaults
            const price = setConfig.price || (isFree ? 0 : PAYMENT_CONFIG.defaultPrices.mcq);
            const time = setConfig.time || EXAM_CONFIG.mcq.defaultTime;
            const questions = setConfig.questions || 20; // Default number of questions
            
            examSets.push({
                name: setName,
                fileName: fileName,
                displayName: setName,
                isFree: isFree,
                price: price,
                time: time, // Time in seconds
                questions: questions,
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
            set.isFree = index < EXAM_CONFIG.mcq.freeSets;
        });
        
        console.log(`Found ${examSets.length} MCQ exam sets`);
        return examSets;
        
    } catch (error) {
        console.error('Error discovering MCQ sets:', error);
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
        
        // Try to load config file for set-specific pricing and timing
        const configFile = files.find(file => file.name.toLowerCase() === 'config.json');
        let setConfigs = {};
        
        if (configFile) {
            try {
                const configData = await getJsonFileFromGitHub(configFile.path);
                if (configData && configData.sets) {
                    setConfigs = configData.sets;
                }
            } catch (error) {
                console.warn('Could not load config file, using defaults');
            }
        }
        
        jsonFiles.forEach((file, index) => {
            const fileName = file.name;
            const baseName = fileName.replace(/\.json$/i, '');
            const setName = baseName.replace(/_/g, ' ').trim();
            const isFree = index < EXAM_CONFIG.subjective.freeSets;
            
            // Get config for this specific set
            const setConfig = setConfigs[fileName] || setConfigs[setName] || {};
            
            // Use set-specific config or defaults
            const price = setConfig.price || (isFree ? 0 : PAYMENT_CONFIG.defaultPrices.subjective);
            const time = setConfig.time || EXAM_CONFIG.subjective.defaultTime;
            const questions = setConfig.questions || 'Various';
            
            examSets.push({
                name: setName,
                fileName: fileName,
                displayName: setName,
                isFree: isFree,
                price: price,
                time: time, // Time in seconds
                questions: questions,
                setNumber: index + 1,
                path: file.path,
                downloadUrl: file.download_url,
                config: setConfig
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
            set.isFree = index < EXAM_CONFIG.subjective.freeSets;
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
            time: 30 * 60, // 30 minutes
            questions: 20,
            setNumber: 1
        },
        {
            name: "Set B - Intermediate Level",
            fileName: "set_b_intermediate.json",
            displayName: "Set B - Intermediate Level",
            isFree: true,
            price: 0,
            time: 30 * 60,
            questions: 20,
            setNumber: 2
        },
        {
            name: "Set C - Advanced Problems",
            fileName: "set_c_advanced.json",
            displayName: "Set C - Advanced Problems",
            isFree: false,
            price: 75, // Custom price
            time: 45 * 60, // 45 minutes
            questions: 25,
            setNumber: 3
        },
        {
            name: "Set D - Expert Challenge",
            fileName: "set_d_expert.json",
            displayName: "Set D - Expert Challenge",
            isFree: false,
            price: 100, // Custom price
            time: 60 * 60, // 60 minutes
            questions: 30,
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
            time: 3 * 60 * 60, // 3 hours
            questions: "5-7",
            setNumber: 1
        },
        {
            name: "Set B - Application Based",
            fileName: "set_b_application.json",
            displayName: "Set B - Application Based",
            isFree: true,
            price: 0,
            time: 3 * 60 * 60,
            questions: "6-8",
            setNumber: 2
        },
        {
            name: "Set C - Case Studies",
            fileName: "set_c_case_studies.json",
            displayName: "Set C - Case Studies",
            isFree: false,
            price: 150, // Custom price
            time: 4 * 60 * 60, // 4 hours
            questions: "3-5",
            setNumber: 3
        },
        {
            name: "Set D - Professional Practice",
            fileName: "set_d_professional.json",
            displayName: "Set D - Professional Practice",
            isFree: false,
            price: 200, // Custom price
            time: 4 * 60 * 60, // 4 hours
            questions: "2-4",
            setNumber: 4
        }
    ];
}

// ==============================================
// ENHANCED EXAM SET SELECTION WITH PREMIUM LOOK
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
                const timeMinutes = Math.floor(set.time / 60);
                
                return `
                    <div class="subject-card ${cardClass}" 
                         data-exam-index="${index}" 
                         data-set-name="${set.displayName}" 
                         data-is-free="${set.isFree}" 
                         data-can-access="${canAccess}"
                         data-exam-type="mcq">
                        ${!canAccess ? `
                            <div class="lock-badge">
                                <i class="fas fa-crown"></i>
                                <div class="lock-tooltip">Premium Set</div>
                            </div>
                        ` : ''}
                        <i class="fas fa-file-alt"></i>
                        <h3>${set.displayName}</h3>
                        <p>Multiple Choice Exam</p>
                        <small>
                            ${timeMinutes} minutes • ${set.questions} questions • 
                            ${set.isFree ? 
                                '<span class="demo-badge">FREE</span>' : 
                                `<span class="paid-badge"><i class="fas fa-gem"></i> NPR ${set.price}</span>`
                            }
                        </small>
                        ${!canAccess ? `
                            <div class="premium-features">
                                <p><i class="fas fa-check-circle"></i> ${set.questions} challenging questions</p>
                                <p><i class="fas fa-check-circle"></i> ${timeMinutes} minute time limit</p>
                                <p><i class="fas fa-check-circle"></i> Detailed answer explanations</p>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="demo-notice" style="margin-top: 1.5rem;">
            <i class="fas fa-info-circle"></i> Sets A & B are free. Others require purchase. Payment required for each set.
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
                const timeHours = Math.floor(set.time / 3600);
                
                return `
                    <div class="subject-card ${cardClass}" 
                         data-exam-index="${index}" 
                         data-set-name="${set.displayName}" 
                         data-is-free="${set.isFree}" 
                         data-can-access="${canAccess}"
                         data-exam-type="subjective">
                        ${!canAccess ? `
                            <div class="lock-badge">
                                <i class="fas fa-crown"></i>
                                <div class="lock-tooltip">Premium Set</div>
                            </div>
                        ` : ''}
                        <i class="fas fa-file-pdf"></i>
                        <h3>${set.displayName}</h3>
                        <p>Subjective Exam</p>
                        <small>
                            ${timeHours} hours • ${set.questions} questions • 
                            ${set.isFree ? 
                                '<span class="demo-badge">FREE</span>' : 
                                `<span class="paid-badge"><i class="fas fa-gem"></i> NPR ${set.price}</span>`
                            }
                        </small>
                        ${!canAccess ? `
                            <div class="premium-features">
                                <p><i class="fas fa-check-circle"></i> ${set.questions} comprehensive questions</p>
                                <p><i class="fas fa-check-circle"></i> ${timeHours} hour time limit</p>
                                <p><i class="fas fa-check-circle"></i> Professional evaluation available</p>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="demo-notice" style="margin-top: 1.5rem;">
            <i class="fas fa-info-circle"></i> Sets A & B are free. Others require purchase. Payment required for each set.
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
// ENHANCED EXAM LOADING WITH JSON PARSING
// ==============================================

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
        state.totalTime = selectedSet.time || EXAM_CONFIG.mcq.defaultTime;
        state.currentExamConfig = selectedSet;
        
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
    state.totalTime = selectedSet.time || EXAM_CONFIG.subjective.defaultTime;
    state.currentExamConfig = selectedSet;
    
    const examSetSelection = getDOMElement('exam-set-selection');
    const subjectiveExam = getDOMElement('subjective-exam');
    const examTitle = getDOMElement('subjective-exam-title');
    const questionsContainer = getDOMElement('subjective-exam-questions');
    
    if (!examSetSelection || !subjectiveExam || !examTitle || !questionsContainer) return;
    
    hideElement(examSetSelection);
    showElement(subjectiveExam);
    examTitle.textContent = `Subjective Exam - ${selectedSet.displayName}`;
    
    questionsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading exam paper...</p>
        </div>
    `;
    
    await loadSubjectiveExamContent(selectedSet.fileName, selectedSet.displayName);
    startTimer('subjective');
}

async function loadMCQExam(fileName, displayName) {
    const field = AppState.currentField;
    
    try {
        const filePath = `${FIELD_CONFIG[field].folderPrefix}Take Exam/Multiple Choice Exam/${fileName}`;
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
                correct: q.correct || (q.options ? q.options[0] : "A"),
                explanation: q.explanation || "No explanation provided"
            }));
        } else if (jsonData.questions && Array.isArray(jsonData.questions)) {
            questions = jsonData.questions.map((q, index) => ({
                id: `exam_${fileName}_${index}`,
                question: q.question || `Question ${index + 1}`,
                options: q.options || ["Option A", "Option B", "Option C", "Option D"],
                correct: q.correct || (q.options ? q.options[0] : "A"),
                explanation: q.explanation || "No explanation provided"
            }));
        }
        
        if (questions.length === 0) {
            questions = [getEmptyQuestionSet('Exam', displayName)];
        }
        
        console.log(`Loaded ${questions.length} MCQ questions from ${fileName}`);
        return questions;
        
    } catch (error) {
        console.error('Error loading MCQ exam:', error);
        return [getErrorQuestionSet('Exam', displayName, fileName)];
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
        
        let questions = [];
        let totalMarks = 0;
        
        if (Array.isArray(jsonData)) {
            questions = jsonData;
        } else if (jsonData.questions && Array.isArray(jsonData.questions)) {
            questions = jsonData.questions;
        } else if (jsonData.exam && Array.isArray(jsonData.exam)) {
            questions = jsonData.exam;
        }
        
        // Calculate total marks
        totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
        
        const questionsContainer = getDOMElement('subjective-exam-questions');
        if (questionsContainer) {
            questionsContainer.innerHTML = createSubjectiveExamHTML(questions, displayName, totalMarks);
        }
        
        const totalQuestionsElement = document.getElementById('subjective-total-questions');
        const totalMarksElement = document.getElementById('subjective-total-marks');
        
        if (totalQuestionsElement) totalQuestionsElement.textContent = questions.length;
        if (totalMarksElement) totalMarksElement.textContent = totalMarks;
        
        console.log(`Loaded subjective exam: ${questions.length} questions, ${totalMarks} total marks`);
        
    } catch (error) {
        console.error('Error loading subjective exam content:', error);
        displayDemoSubjectiveContent(displayName);
    }
}

function createSubjectiveExamHTML(questions, examName, totalMarks) {
    const timeHours = Math.floor(AppState.examState.totalTime / 3600);
    const timeMinutes = Math.floor((AppState.examState.totalTime % 3600) / 60);
    
    let html = `
        <div class="subjective-exam-container">
            <div class="exam-header">
                <div style="flex: 1;">
                    <h3>${examName}</h3>
                    <p style="color: #666; margin-top: 0.5rem;">Professional Engineering Examination</p>
                </div>
                <div class="timer-container">
                    <i class="fas fa-clock"></i>
                    <div class="timer" id="subjective-timer">${timeHours.toString().padStart(2, '0')}:${timeMinutes.toString().padStart(2, '0')}:00</div>
                </div>
            </div>
            
            <div class="exam-progress">
                <div class="progress-item">
                    <i class="fas fa-question-circle"></i>
                    Total Questions: <span id="subjective-total-questions">${questions.length}</span>
                </div>
                <div class="progress-item">
                    <i class="fas fa-star"></i>
                    Total Marks: <span id="subjective-total-marks">${totalMarks}</span>
                </div>
                <div class="progress-item">
                    <i class="fas fa-clock"></i>
                    Time: ${timeHours} hours
                </div>
            </div>
            
            <div class="exam-instructions" style="margin: 2rem 0; padding: 1.5rem; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-info-circle"></i> Instructions:</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li>Answer all questions in the answer booklet provided.</li>
                    <li>Write your examination number on every answer sheet.</li>
                    <li>Time: ${timeHours} hours (${timeHours * 60} minutes)</li>
                    <li>Use black or blue ink pen only.</li>
                    <li>Show all calculations and assumptions clearly.</li>
                    <li>Draw neat sketches/diagrams wherever necessary.</li>
                </ul>
            </div>
            
            <div class="exam-paper">
    `;
    
    let currentCategory = '';
    
    questions.forEach((q, index) => {
        const questionNum = index + 1;
        const marks = q.marks || 5;
        
        // Check for category changes
        if (q.category && q.category !== currentCategory) {
            currentCategory = q.category;
            html += `
                <div class="category-header">
                    ${currentCategory}
                </div>
            `;
        }
        
        html += `
            <div class="subjective-question-item">
                <div class="subjective-question-header">
                    <div class="question-number-circle">${questionNum}</div>
                    <div class="subjective-question-text">${q.question || `Question ${questionNum}`}</div>
                </div>
                <div class="question-marks">
                    <i class="fas fa-star"></i> Marks: ${marks}
                </div>
        `;
        
        // Add subquestions if present
        if (q.subquestions && Array.isArray(q.subquestions)) {
            html += '<div class="subquestions">';
            q.subquestions.forEach((sq, sqIndex) => {
                html += `
                    <div class="subquestion">
                        <strong>(${String.fromCharCode(97 + sqIndex)})</strong> ${sq}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Add parts if present (alternative to subquestions)
        if (q.parts && Array.isArray(q.parts)) {
            html += '<div class="subquestions">';
            q.parts.forEach((part, partIndex) => {
                html += `
                    <div class="subquestion">
                        <strong>(${String.fromCharCode(97 + partIndex)})</strong> ${part}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Add notes if present
        if (q.notes) {
            html += `<div class="question-notes" style="margin-top: 0.5rem; font-style: italic; color: #666; font-size: 0.9rem;">
                <i class="fas fa-sticky-note"></i> ${q.notes}
            </div>`;
        }
        
        html += '</div>';
    });
    
    html += `
            </div>
            
            <div class="exam-footer" style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #eee; text-align: center; color: #666;">
                <p><strong>--- End of Examination Paper ---</strong></p>
                <p style="font-size: 0.9rem;">Please ensure all answers are written clearly and legibly.</p>
            </div>
        </div>
    `;
    
    return html;
}

function displayDemoSubjectiveContent(displayName) {
    const demoQuestions = [
        {
            category: "Section A: Fundamentals",
            question: "Explain the fundamental principles of structural analysis and their applications in civil engineering design.",
            marks: 10,
            subquestions: [
                "Define the three main types of structural loads",
                "Explain the concept of stress and strain with examples",
                "Describe the difference between static and dynamic analysis"
            ]
        },
        {
            category: "Section A: Fundamentals",
            question: "Discuss the factors affecting the selection of construction materials for different types of structures.",
            marks: 8,
            notes: "Consider factors like environmental conditions, cost, and structural requirements"
        },
        {
            category: "Section B: Analysis and Design",
            question: "Calculate the required reinforcement for a simply supported beam with given dimensions and loading conditions.",
            marks: 12,
            parts: [
                "Calculate the maximum bending moment",
                "Determine the required steel area",
                "Check for shear reinforcement requirements"
            ]
        },
        {
            question: "Describe the quality control procedures for concrete construction projects.",
            marks: 7
        },
        {
            category: "Section C: Professional Practice",
            question: "Analyze the environmental impact assessment process for large infrastructure projects.",
            marks: 10,
            subquestions: [
                "List the key components of an EIA report",
                "Explain the public consultation process",
                "Describe mitigation measures for common environmental impacts"
            ]
        }
    ];
    
    const totalMarks = demoQuestions.reduce((sum, q) => sum + q.marks, 0);
    const questionsContainer = getDOMElement('subjective-exam-questions');
    if (questionsContainer) {
        questionsContainer.innerHTML = createSubjectiveExamHTML(demoQuestions, displayName, totalMarks);
    }
    
    const totalQuestionsElement = document.getElementById('subjective-total-questions');
    const totalMarksElement = document.getElementById('subjective-total-marks');
    
    if (totalQuestionsElement) totalQuestionsElement.textContent = demoQuestions.length;
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
// ENHANCED PAYMENT SYSTEM (RESET ON BACK)
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

// Reset purchased sets when going back to exam type
function resetPurchasedSets() {
    purchasedSets.subjective = [];
    purchasedSets.mcq = [];
    savePurchasedSets();
    console.log("Purchased sets reset");
}

function showPaymentModal(examType, examSet) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3><i class="fas fa-crown"></i> Purchase Exam Set</h3>
                <button class="close-payment-modal">&times;</button>
            </div>
            <div class="payment-modal-body">
                <div class="payment-info">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <div class="premium-badge">
                            <i class="fas fa-gem"></i> PREMIUM
                        </div>
                    </div>
                    <h4 style="text-align: center;">${examSet.displayName}</h4>
                    <p style="text-align: center; color: #666;">${examType === 'subjective' ? 'Subjective Exam' : 'Multiple Choice Exam'}</p>
                    <div class="payment-amount">
                        NPR ${examSet.price}
                    </div>
                    <div class="payment-details" style="text-align: center; margin-top: 1rem;">
                        <p><i class="fas fa-clock"></i> Time: ${examType === 'subjective' ? Math.floor(examSet.time / 3600) + ' hours' : Math.floor(examSet.time / 60) + ' minutes'}</p>
                        <p><i class="fas fa-question-circle"></i> Questions: ${examSet.questions}</p>
                    </div>
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
                
                <div class="payment-warning" style="margin: 1rem 0; padding: 0.8rem; background-color: #fff3cd; border-radius: 6px; text-align: center;">
                    <i class="fas fa-exclamation-triangle"></i> Note: Payment is required for each set. Going back will require re-purchase.
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="btn btn-secondary" id="cancel-payment" style="flex: 1;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn btn-primary" id="proceed-payment" style="flex: 2;">
                        <i class="fas fa-lock"></i> Pay NPR ${examSet.price}
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
    const amount = examSet.price;
    
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
            
            // Mark this specific set as purchased
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
        AppState.examState.totalTime = selectedSet.time;
        AppState.examState.currentExamConfig = selectedSet;
        
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
        AppState.examState.totalTime = selectedSet.time;
        AppState.examState.currentExamConfig = selectedSet;
        
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
// UPDATED EXAM NAVIGATION FUNCTIONS
// ==============================================

function loadMCQExamQuestion() {
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
    let timerElement, totalTime;
    
    if (type === 'subjective') {
        timerElement = document.getElementById('subjective-timer');
        totalTime = AppState.examState.totalTime;
    } else {
        timerElement = document.getElementById('mcq-exam-timer');
        totalTime = AppState.examState.totalTime;
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
    
    // Reset purchased sets when going back
    resetPurchasedSets();
    
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
        subjectiveSets: [],
        currentExamConfig: null
    };
}

// ==============================================
// INITIALIZATION AND EVENT LISTENERS
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

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', loadComponents);
