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