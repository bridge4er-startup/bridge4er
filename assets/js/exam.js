// ==============================================
// EXAM SET DISCOVERY FUNCTIONS
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
                price: isFree ? 0 : PAYMENT_CONFIG.prices.mcq,
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
        }
        
        if (questions.length === 0) {
            questions = [getEmptyQuestionSet('Exam', displayName)];
        }
        
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
        
        let contentHtml = '';
        let totalQuestions = 0;
        let totalMarks = 0;
        
        // Check if it's the new format with examInfo
        if (jsonData.examInfo) {
            contentHtml = createSubjectiveExamHTML(jsonData, displayName);
            
            // Calculate totals
            if (jsonData.sections) {
                jsonData.sections.forEach(section => {
                    totalQuestions += section.questions.length;
                    totalMarks += section.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
                });
            }
        }
        // Old format (array of questions)
        else if (Array.isArray(jsonData)) {
            // Convert to new format
            const examData = {
                examInfo: {
                    title: "प्रदेश लोक सेवा आयोग",
                    subtitle: "इन्जिनियरिंग सेवा, सिभिल समूह, जनरल, हाइवे, स्यानिटरी, इर्रिगेशन उपसमूह अधिकृत सातौ तहको खुला समावेशी र अन्तर सेवा प्रतियोगितात्मक लिखित परीक्षा",
                    date: "२०८२।१०।१२",
                    time: "३ घण्टा",
                    paper: "द्वितीय",
                    subject: "Technical subject",
                    fullMarks: "१००"
                },
                instructions: [
                    "निम्न प्रश्नहरुको उत्तर Section अनुसार छुट्टाई उत्तरपुस्तिकामा लेख्नुपर्नेछ।"
                ],
                sections: [
                    {
                        section: "All",
                        title: "All Questions",
                        questions: jsonData
                    }
                ]
            };
            
            contentHtml = createSubjectiveExamHTML(examData, displayName);
            totalQuestions = jsonData.length;
            totalMarks = jsonData.reduce((sum, q) => sum + (q.marks || 0), 0);
        } else {
            console.warn('Unexpected JSON format, using demo content');
            displayDemoSubjectiveContent(displayName);
            return;
        }
        
        const questionsContainer = getDOMElement('subjective-exam-questions');
        if (questionsContainer) {
            questionsContainer.innerHTML = contentHtml;
        }
        
        document.getElementById('subjective-total-questions').textContent = totalQuestions;
        document.getElementById('subjective-total-marks').textContent = totalMarks;
        
        console.log(`Loaded subjective exam: ${totalQuestions} questions, ${totalMarks} total marks`);
        
    } catch (error) {
        console.error('Error loading subjective exam content:', error);
        displayDemoSubjectiveContent(displayName);
    }
}

function createSubjectiveExamHTML(examData, examName) {
    const { examInfo, instructions, sections } = examData;
    
    // Create a realistic exam paper header from JSON data
    let html = `
        <div class="exam-paper-container">
            <div class="exam-paper-header">
                <h2 class="nepali-text">${examInfo.title}</h2>
                <div class="exam-paper-subtitle nepali-text">${examInfo.subtitle}</div>
                
                <div class="exam-paper-details">
                    <div class="exam-paper-detail"><strong>मिति:</strong> ${examInfo.date}</div>
                    <div class="exam-paper-detail"><strong>समय:</strong> ${examInfo.time}</div>
                    <div class="exam-paper-detail"><strong>पत्र:</strong> ${examInfo.paper}</div>
                    <div class="exam-paper-detail"><strong>विषय:</strong> ${examInfo.subject}</div>
                    <div class="exam-paper-detail"><strong>पूर्णांक:</strong> ${examInfo.fullMarks}</div>
                </div>
            </div>
            
            <div class="exam-instructions-box">
                <h4 class="nepali-text">निर्देशनहरु:</h4>
                ${instructions.map(instruction => `<p class="nepali-text">${instruction}</p>`).join('')}
            </div>
    `;
    
    // Render each section
    sections.forEach((section, sectionIndex) => {
        // Calculate section marks if not provided
        const sectionMarks = section.marks || section.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
        
        html += `
            <div class="exam-section">
                <h3 class="exam-section-title">${section.title} (${sectionMarks} Marks)</h3>
        `;
        
        section.questions.forEach((question, qIndex) => {
            const questionNum = (sectionIndex === 0 ? qIndex + 1 : 
                sections.slice(0, sectionIndex).reduce((total, s) => total + s.questions.length, 0) + qIndex + 1);
            const marks = question.marks || 5;
            
            html += createQuestionHTML(question, questionNum, marks);
        });
        
        html += `</div>`;
    });
    
    // Close the container
    html += `</div>`;
    
    return html;
}

// Helper function remains the same
function createQuestionHTML(question, questionNum, marks) {
    let html = `
        <div class="exam-question">
            <span class="exam-question-number">${questionNum}.</span>
            <div class="exam-question-text">
                ${question.question || `Question ${questionNum}`}
                <span class="exam-question-marks">(${marks})</span>
            </div>
    `;
    
    // Add subquestions if they exist
    if (question.subquestions && Array.isArray(question.subquestions)) {
        question.subquestions.forEach((sub, subIndex) => {
            html += `
                <div class="exam-sub-question">
                    <span class="exam-sub-question-letter">(${String.fromCharCode(97 + subIndex)})</span>
                    <div>${sub}</div>
                </div>
            `;
        });
    }
    
    // Add answer space
    html += `
            <div class="answer-space">
                <span class="answer-space-label">Answer Space:</span>
                <div class="answer-lines"></div>
            </div>
        </div>
    `;
    
    return html;
}

function createQuestionHTML(question, questionNum, marks) {
    let html = `
        <div class="exam-question">
            <span class="exam-question-number">${questionNum}.</span>
            <div class="exam-question-text">
                ${question.question || `Question ${questionNum}`}
                <span class="exam-question-marks">(${marks})</span>
            </div>
    `;
    
    // Add subquestions if they exist
    if (question.subquestions && Array.isArray(question.subquestions)) {
        html += `<div class="exam-sub-question">`;
        question.subquestions.forEach((sub, subIndex) => {
            html += `
                <div class="exam-sub-question">
                    <span class="exam-sub-question-letter">(${String.fromCharCode(97 + subIndex)})</span>
                    ${sub}
                </div>
            `;
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

function displayDemoSubjectiveContent(displayName) {
    const demoExamData = {
        examInfo: {
            title: "प्रदेश लोक सेवा आयोग, मधेश प्रदेश",
            subtitle: "इन्जिनियरिंग सेवा, सिभिल समूह, जनरल, हाइवे, स्यानिटरी, इर्रिगेशन उपसमूह अधिकृत सातौ तहको खुला समावेशी र अन्तर सेवा प्रतियोगितात्मक लिखित परीक्षा",
            date: "२०८२।१०।१२",
            time: "३ घण्टा",
            paper: "द्वितीय",
            subject: "Technical subject",
            fullMarks: "१००"
        },
        instructions: [
            "निम्न प्रश्नहरुको उत्तर Section अनुसार छुट्टाई उत्तरपुस्तिकामा लेख्नुपर्नेछ।"
        ],
        sections: [
            {
                section: "A",
                title: "Section A",
                marks: 30,
                questions: [
                    {
                        question: "Explain the process of standard penetration test during soil exploration.",
                        marks: 5
                    },
                    {
                        question: "What are the main risks involved in bridge construction?",
                        marks: 5
                    },
                    {
                        question: "Distinguish between the 'Initial Load Test' and the 'Routine Load Test' for piles. Using the load-settlement curve, explain the 'Cyclic Load Test' method used to separate the skin friction from the end bearing component.",
                        marks: 10,
                        subquestions: [
                            "Explain the concept of skin friction",
                            "Describe the end bearing component",
                            "How does cyclic loading help in separation?"
                        ]
                    },
                    {
                        question: "What are the loads and the forces considered in design of a bridge foundation? Explain briefly with sketches?",
                        marks: 10
                    }
                ]
            },
            {
                section: "B",
                title: "Section B",
                marks: 25,
                questions: [
                    {
                        question: "Differentiate between firm power, secondary power, and average annual energy.",
                        marks: 5
                    },
                    {
                        question: "Derive Bernoulli's equation for steady, incompressible, and frictionless flow along a streamline, clearly stating all the assumptions involved. Explain the practical applications of Bernoulli's equation and discuss its limitations when applied to real fluid flow.",
                        marks: 10
                    },
                    {
                        question: "Discuss the salient features of Kennedy's Theory for the design of earth channels based on the critical velocity concept and mention its limitations?",
                        marks: 10
                    }
                ]
            }
        ]
    };
    
    const contentHtml = createSubjectiveExamHTML(demoExamData, displayName);
    const questionsContainer = getDOMElement('subjective-exam-questions');
    if (questionsContainer) {
        questionsContainer.innerHTML = contentHtml;
    }
    
    // Calculate totals
    let totalQuestions = 0;
    let totalMarks = 0;
    demoExamData.sections.forEach(section => {
        totalQuestions += section.questions.length;
        totalMarks += section.questions.reduce((sum, q) => sum + q.marks, 0);
    });
    
    document.getElementById('subjective-total-questions').textContent = totalQuestions;
    document.getElementById('subjective-total-marks').textContent = totalMarks;
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

// Global function for exam option clicks
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
