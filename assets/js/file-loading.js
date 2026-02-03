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
            const fileUrl = file.download_url || getRawFileUrl(file.path);
            
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
                        <button class="btn btn-primary view-file-btn" 
                                data-file-url="${fileUrl}" 
                                data-file-name="${fileName}"
                                data-file-ext="${fileExt}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary download-file-btn" 
                                data-file-url="${fileUrl}" 
                                data-file-name="${fileName}">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        
        // Add event listeners for the buttons
        document.querySelectorAll('.view-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileUrl = e.target.dataset.fileUrl || e.target.closest('.view-file-btn').dataset.fileUrl;
                const fileName = e.target.dataset.fileName || e.target.closest('.view-file-btn').dataset.fileName;
                const fileExt = e.target.dataset.fileExt || e.target.closest('.view-file-btn').dataset.fileExt;
                viewFile(fileUrl, fileName, fileExt);
            });
        });
        
        document.querySelectorAll('.download-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileUrl = e.target.dataset.fileUrl || e.target.closest('.download-file-btn').dataset.fileUrl;
                const fileName = e.target.dataset.fileName || e.target.closest('.download-file-btn').dataset.fileName;
                downloadFile(fileUrl, fileName);
            });
        });
        
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
            const fileUrl = file.download_url || getRawFileUrl(file.path);
            
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
                        <button class="btn btn-primary view-file-btn" 
                                data-file-url="${fileUrl}" 
                                data-file-name="${fileName}"
                                data-file-ext="${fileExt}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary download-file-btn" 
                                data-file-url="${fileUrl}" 
                                data-file-name="${fileName}">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        
        // Add event listeners for the buttons
        document.querySelectorAll('.view-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileUrl = e.target.dataset.fileUrl || e.target.closest('.view-file-btn').dataset.fileUrl;
                const fileName = e.target.dataset.fileName || e.target.closest('.view-file-btn').dataset.fileName;
                const fileExt = e.target.dataset.fileExt || e.target.closest('.view-file-btn').dataset.fileExt;
                viewFile(fileUrl, fileName, fileExt);
            });
        });
        
        document.querySelectorAll('.download-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileUrl = e.target.dataset.fileUrl || e.target.closest('.download-file-btn').dataset.fileUrl;
                const fileName = e.target.dataset.fileName || e.target.closest('.download-file-btn').dataset.fileName;
                downloadFile(fileUrl, fileName);
            });
        });
        
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
            const fileUrl = file.download_url || getRawFileUrl(file.path);
            
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
                        <button class="btn btn-primary view-file-btn" 
                                data-file-url="${fileUrl}" 
                                data-file-name="${fileName}"
                                data-file-ext="${fileExt}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary download-file-btn" 
                                data-file-url="${fileUrl}" 
                                data-file-name="${fileName}">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        
        // Add event listeners for the buttons
        document.querySelectorAll('.view-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileUrl = e.target.dataset.fileUrl || e.target.closest('.view-file-btn').dataset.fileUrl;
                const fileName = e.target.dataset.fileName || e.target.closest('.view-file-btn').dataset.fileName;
                const fileExt = e.target.dataset.fileExt || e.target.closest('.view-file-btn').dataset.fileExt;
                viewFile(fileUrl, fileName, fileExt);
            });
        });
        
        document.querySelectorAll('.download-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileUrl = e.target.dataset.fileUrl || e.target.closest('.download-file-btn').dataset.fileUrl;
                const fileName = e.target.dataset.fileName || e.target.closest('.download-file-btn').dataset.fileName;
                downloadFile(fileUrl, fileName);
            });
        });
        
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
// PDF VIEWER FUNCTIONS
// ==============================================

// Global PDF viewer state
const PDFViewerState = {
    currentPdfUrl: null,
    currentFileName: null
};

// Initialize PDF modal
function initPdfModal() {
    const pdfModal = document.getElementById('pdf-modal');
    const closeBtn = document.querySelector('.close-pdf-modal');
    const downloadLink = document.getElementById('pdf-download-link');
    const pdfIframe = document.getElementById('pdf-viewer-iframe');
    
    if (!pdfModal || !closeBtn) return;
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear iframe src to stop loading
        if (pdfIframe) {
            pdfIframe.src = 'about:blank';
        }
        
        // Clear state
        PDFViewerState.currentPdfUrl = null;
        PDFViewerState.currentFileName = null;
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closeBtn.click();
        }
    });
    
    // Close on outside click
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            closeBtn.click();
        }
    });
    
    // Setup download link
    if (downloadLink) {
        downloadLink.addEventListener('click', (e) => {
            if (PDFViewerState.currentPdfUrl && PDFViewerState.currentFileName) {
                downloadFile(PDFViewerState.currentPdfUrl, PDFViewerState.currentFileName);
            }
        });
    }
}

// Function to view PDF in modal
function viewPdfInModal(fileUrl, fileName) {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfTitle = document.getElementById('pdf-modal-title');
    const pdfIframe = document.getElementById('pdf-viewer-iframe');
    const pdfFallback = document.getElementById('pdf-fallback');
    const downloadLink = document.getElementById('pdf-download-link');
    
    if (!pdfModal) {
        // Fallback to window.open if modal not found
        window.open(fileUrl, '_blank');
        return;
    }
    
    // Update state
    PDFViewerState.currentPdfUrl = fileUrl;
    PDFViewerState.currentFileName = fileName;
    
    // Update modal title
    if (pdfTitle) {
        pdfTitle.textContent = fileName.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
    }
    
    // Show modal
    pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup download link
    if (downloadLink) {
        downloadLink.href = fileUrl;
        downloadLink.download = fileName;
    }
    
    // Hide fallback initially
    if (pdfFallback) {
        pdfFallback.style.display = 'none';
    }
    
    // Show iframe
    if (pdfIframe) {
        pdfIframe.style.display = 'block';
        pdfIframe.src = 'about:blank';
        
        // Load PDF after a small delay
        setTimeout(() => {
            try {
                // Convert GitHub blob URL to raw URL if needed
                let pdfUrl = fileUrl;
                
                // Check if it's a GitHub blob URL
                if (fileUrl.includes('github.com') && fileUrl.includes('/blob/')) {
                    // Convert blob URL to raw URL
                    pdfUrl = fileUrl.replace('github.com', 'raw.githubusercontent.com')
                                   .replace('/blob/', '/');
                }
                
                // Try direct embedding first
                pdfIframe.src = pdfUrl;
                
                // Add error handler for iframe
                pdfIframe.onerror = () => {
                    console.log('Direct embedding failed, trying Google Docs viewer');
                    // Try Google Docs viewer as fallback
                    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
                    pdfIframe.src = googleViewerUrl;
                    
                    // Second error handler for Google Docs
                    pdfIframe.onerror = () => {
                        console.log('Google Docs viewer also failed');
                        if (pdfIframe) {
                            pdfIframe.style.display = 'none';
                        }
                        if (pdfFallback) {
                            pdfFallback.style.display = 'flex';
                        }
                    };
                };
                
                // Add load handler
                pdfIframe.onload = () => {
                    console.log('PDF loaded successfully');
                    // PDF loaded successfully
                };
                
            } catch (error) {
                console.error('Error loading PDF:', error);
                if (pdfIframe) {
                    pdfIframe.style.display = 'none';
                }
                if (pdfFallback) {
                    pdfFallback.style.display = 'flex';
                }
            }
        }, 100);
    }
}

// Global function to view files
window.viewFile = function(fileUrl, fileName, fileExt) {
    // If fileExt not provided, extract from fileName
    if (!fileExt) {
        fileExt = fileName.split('.').pop().toLowerCase();
    }
    
    if (fileExt === 'pdf') {
        // Use PDF modal for PDF files
        viewPdfInModal(fileUrl, fileName);
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExt)) {
        // For images, open in new tab
        window.open(fileUrl, '_blank');
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt)) {
        // For Office files, use Google Docs viewer
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        window.open(googleViewerUrl, '_blank');
    } else {
        // For other files, open in new tab
        try {
            window.open(fileUrl, '_blank');
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Unable to open file. Please try downloading instead.');
        }
    }
};

// Global function to download files
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
