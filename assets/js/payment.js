// ==============================================
// PAYMENT SYSTEM
// ==============================================

const purchasedSets = {
    subjective: JSON.parse(localStorage.getItem('purchasedSubjectiveSets') || '[]'),
    mcq: JSON.parse(localStorage.getItem('purchasedMCQSets') || '[]')
};

function initPaymentSystem() {
    console.log("Payment system initialized");
    // Load purchased sets from localStorage
    purchasedSets.subjective = JSON.parse(localStorage.getItem('purchasedSubjectiveSets') || '[]');
    purchasedSets.mcq = JSON.parse(localStorage.getItem('purchasedMCQSets') || '[]');
    
    console.log("Loaded purchased sets:", purchasedSets);
}

function savePurchasedSets() {
    localStorage.setItem('purchasedSubjectiveSets', JSON.stringify(purchasedSets.subjective));
    localStorage.setItem('purchasedMCQSets', JSON.stringify(purchasedSets.mcq));
}

function isSetPurchased(examType, setName) {
    const sets = purchasedSets[examType];
    return Array.isArray(sets) && sets.includes(setName);
}

function markSetAsPurchased(examType, setName) {
    if (!isSetPurchased(examType, setName)) {
        purchasedSets[examType].push(setName);
        savePurchasedSets();
        console.log(`Set ${setName} marked as purchased for ${examType}`);
        
        // Update UI if set selection is currently shown
        updateExamSetUI();
    }
}

function updateExamSetUI() {
    // This function can be called to refresh the exam set UI after purchase
    const currentField = AppState.currentField;
    const currentExamType = AppState.examState.type;
    
    if (currentExamType === 'subjective') {
        // Re-render subjective exam sets
        if (AppState.examState.subjectiveSets.length > 0) {
            renderSubjectiveExamSetSelection(AppState.examState.subjectiveSets);
        }
    } else if (currentExamType === 'multiple-choice') {
        // Re-render MCQ exam sets
        if (AppState.examState.mcqSets.length > 0) {
            renderMCQExamSetSelection(AppState.examState.mcqSets);
        }
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
    
    // Simulate payment processing
    setTimeout(() => {
        const success = true; // Always succeed in demo mode
        
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
// PAYMENT CLEARANCE FUNCTIONS
// ==============================================

function clearAllPurchasedSets() {
    if (confirm('Are you sure you want to clear all purchased sets? This will reset all your purchases.')) {
        purchasedSets.subjective = [];
        purchasedSets.mcq = [];
        savePurchasedSets();
        alert('All purchased sets have been cleared.');
        updateExamSetUI();
    }
}

function getPurchasedSetsCount() {
    return {
        subjective: purchasedSets.subjective.length,
        mcq: purchasedSets.mcq.length,
        total: purchasedSets.subjective.length + purchasedSets.mcq.length
    };
}

// ==============================================
// GLOBAL PAYMENT FUNCTIONS
// ==============================================

// Make payment functions globally available
window.showPaymentModal = showPaymentModal;
window.clearAllPurchasedSets = clearAllPurchasedSets;
window.getPurchasedSetsCount = getPurchasedSetsCount;