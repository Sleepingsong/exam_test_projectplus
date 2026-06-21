document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const examScreen = document.getElementById('exam-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    // Setup Elements
    const timeLimitInput = document.getElementById('time-limit');
    const shuffleCheckbox = document.getElementById('shuffle-questions');
    const startBtn = document.getElementById('start-btn');
    
    // Exam Elements
    const currentQNumDisplay = document.getElementById('current-q-num');
    const totalQNumDisplay = document.getElementById('total-q-num');
    const progressFill = document.getElementById('progress-fill');
    const timerDisplay = document.getElementById('timer-display');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Explanation Elements
    const explanationPanel = document.getElementById('explanation-panel');
    const expCorrectText = document.getElementById('exp-correct-text');
    const expIncorrectText = document.getElementById('exp-incorrect-text');
    
    // Results Elements
    const finalScoreDisplay = document.getElementById('final-score');
    const finalTotalDisplay = document.getElementById('final-total');
    const statCorrect = document.getElementById('stat-correct');
    const statIncorrect = document.getElementById('stat-incorrect');
    const statTime = document.getElementById('stat-time');
    const restartBtn = document.getElementById('restart-btn');

    // State Variables
    let allQuestions = [];
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let selectedOptionId = null;
    let score = 0;
    let incorrectCount = 0;
    
    // Timer Variables
    let totalTimeSeconds = 0;
    let timeRemaining = 0;
    let timerInterval = null;
    let timeUsed = 0;

    // Initialize App
    async function initApp() {
        try {
            const response = await fetch('question.json');
            if (!response.ok) {
                throw new Error('ไม่สามารถโหลดข้อมูลข้อสอบได้');
            }
            const data = await response.json();
            allQuestions = data.questions;
            console.log('โหลดข้อสอบจาก question.json สำเร็จ');
        } catch (error) {
            console.warn('ไม่สามารถโหลด question.json ได้, กำลังพยายามใช้ข้อมูลสำรอง:', error);
            if (window.examData && window.examData.questions) {
                allQuestions = window.examData.questions;
                console.log('โหลดข้อสอบจาก question-data.js (สำรอง) สำเร็จ');
            } else {
                console.error(error);
                questionText.innerHTML = '⚠️ เกิดข้อผิดพลาดในการโหลดข้อสอบ กรุณาตรวจสอบไฟล์ question.json';
                startBtn.disabled = true;
                startBtn.innerHTML = 'ไม่พบข้อมูลข้อสอบ';
            }
        }
    }

    // Utility: Shuffle Array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Start Exam
    startBtn.addEventListener('click', () => {
        const timeMinutes = parseInt(timeLimitInput.value);
        if (isNaN(timeMinutes) || timeMinutes < 1) {
            alert('กรุณาระบุเวลาให้ถูกต้อง');
            return;
        }

        const shouldShuffle = shuffleCheckbox.checked;
        
        // Prepare questions
        currentQuestions = allQuestions.map(q => {
            const optionsArray = Object.keys(q.options).map(key => ({
                id: key,
                text: q.options[key],
                isCorrect: Array.isArray(q.correct_answer)
                    ? q.correct_answer.includes(key)
                    : key === q.correct_answer
            }));
            return {
                ...q,
                optionsArray: optionsArray
            };
        });

        if (shouldShuffle) {
            currentQuestions = shuffleArray(currentQuestions);
            currentQuestions = currentQuestions.map(q => {
                let shuffledOptions = shuffleArray(q.optionsArray);
                const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                const correctLabels = [];
                shuffledOptions = shuffledOptions.map((opt, idx) => {
                    const newId = labels[idx] || `Opt${idx + 1}`;
                    if (opt.isCorrect) {
                        correctLabels.push(newId);
                    }
                    return { ...opt, id: newId };
                });
                q.correct_answer = Array.isArray(q.correct_answer) ? correctLabels : (correctLabels[0] || '');
                return { ...q, optionsArray: shuffledOptions };
            });
        }

        // Reset state
        currentQuestionIndex = 0;
        score = 0;
        incorrectCount = 0;
        totalTimeSeconds = timeMinutes * 60;
        timeRemaining = totalTimeSeconds;
        timeUsed = 0;

        // UI Transition
        setupScreen.classList.remove('active');
        setupScreen.classList.add('hidden');
        examScreen.classList.remove('hidden');
        
        // Timeout to allow display block to apply before animating opacity
        setTimeout(() => {
            examScreen.classList.add('active');
            startTimer();
            loadQuestion();
        }, 50);
    });

    // Format Time
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // Timer logic
    function startTimer() {
        updateTimerDisplay();
        document.querySelector('.timer-container').classList.remove('warning');
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            timeUsed++;
            updateTimerDisplay();
            
            if (timeRemaining <= 60 && timeRemaining > 0) {
                document.querySelector('.timer-container').classList.add('warning');
            }
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                finishExam(true); // true means time's up
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timeRemaining);
    }

    // Load Question
    function loadQuestion() {
        const q = currentQuestions[currentQuestionIndex];
        
        // Update Progress
        currentQNumDisplay.textContent = currentQuestionIndex + 1;
        totalQNumDisplay.textContent = currentQuestions.length;
        const progressPercentage = ((currentQuestionIndex) / currentQuestions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        // Reset UI
        explanationPanel.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = true;
        nextBtn.classList.add('hidden');
        selectedOptionId = null;

        // Render Question
        questionText.innerHTML = `${currentQuestionIndex + 1}. ${q.question}`;
        
        // Render Options
        optionsContainer.innerHTML = '';
        q.optionsArray.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <div class="option-label">${opt.id}</div>
                <div class="option-text">${opt.text}</div>
            `;
            
            btn.addEventListener('click', () => {
                // Remove selected class from all
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                // Add to current
                btn.classList.add('selected');
                selectedOptionId = opt.id;
                submitBtn.disabled = false;
            });
            
            optionsContainer.appendChild(btn);
        });
    }

    // Submit Answer
    submitBtn.addEventListener('click', () => {
        if (!selectedOptionId) return;

        const q = currentQuestions[currentQuestionIndex];
        const isCorrect = Array.isArray(q.correct_answer)
            ? q.correct_answer.includes(selectedOptionId)
            : selectedOptionId === q.correct_answer;
        
        // Disable all options
        const allOptionBtns = document.querySelectorAll('.option-btn');
        allOptionBtns.forEach(btn => {
            btn.disabled = true;
            const label = btn.querySelector('.option-label').textContent;
            
            const isLabelCorrect = Array.isArray(q.correct_answer)
                ? q.correct_answer.includes(label)
                : label === q.correct_answer;

            if (isLabelCorrect) {
                btn.classList.add('correct');
            } else if (label === selectedOptionId && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Update Score
        if (isCorrect) {
            score++;
        } else {
            incorrectCount++;
        }

        // Show Explanation
        expCorrectText.innerHTML = `<strong>เหตุผลที่ถูกต้อง:</strong> ${q.explanation.correct_reason}`;
        
        let incorrectHtml = '<strong>เหตุผลที่ตัวเลือกอื่นผิด:</strong><ul>';
        if (q.explanation.incorrect_reasons) {
            for (const [key, reason] of Object.entries(q.explanation.incorrect_reasons)) {
                incorrectHtml += `<li><strong>${key}</strong>: ${reason}</li>`;
            }
        }
        incorrectHtml += '</ul>';
        expIncorrectText.innerHTML = incorrectHtml;
        explanationPanel.classList.remove('hidden');

        // Swap buttons
        submitBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
        
        // Update Progress bar to reflect completion of this question
        const progressPercentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    });

    // Next Question
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex >= currentQuestions.length) {
            finishExam(false);
        } else {
            loadQuestion();
        }
    });

    // Finish Exam
    function finishExam(isTimeUp) {
        clearInterval(timerInterval);
        
        if (isTimeUp) {
            alert('หมดเวลาทำข้อสอบแล้ว!');
        }

        // Update Results UI
        finalScoreDisplay.textContent = score;
        finalTotalDisplay.textContent = currentQuestions.length;
        statCorrect.textContent = score;
        statIncorrect.textContent = currentQuestions.length - score; // If time's up, unanswered are counted as incorrect visually here, or we can use incorrectCount. Let's use (total - score).
        statTime.textContent = formatTime(timeUsed);

        // Transition
        examScreen.classList.remove('active');
        examScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        setTimeout(() => {
            resultsScreen.classList.add('active');
        }, 50);
    }

    // Restart Exam
    restartBtn.addEventListener('click', () => {
        resultsScreen.classList.remove('active');
        resultsScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        
        setTimeout(() => {
            setupScreen.classList.add('active');
        }, 50);
    });

    // Run Init
    initApp();
});
