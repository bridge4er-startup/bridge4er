// ==============================================
// SUBJECTIVE FUNCTIONS
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
        // Use the PDF modal instead of inline viewer
        viewPdfInModal(fileUrl, fileName);
        
        // Hide the book reader and go back to books view
        const bookReader = document.getElementById('book-reader');
        const booksView = document.getElementById('subject-books-view');
        if (bookReader && booksView) {
            bookReader.style.display = 'none';
            booksView.style.display = 'block';
        }
        return; // Exit function early
 
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
