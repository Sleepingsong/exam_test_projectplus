document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Elements & Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or user preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply theme
    applyTheme(currentTheme);
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        currentTheme = theme;
        
        // Update toggle icon
        if (theme === 'light') {
            themeToggleIcon.className = 'fa-solid fa-moon';
        } else {
            themeToggleIcon.className = 'fa-solid fa-sun';
        }
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
    });

    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const examScreen = document.getElementById('exam-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    // Setup Elements
    const examModeSelect = document.getElementById('exam-mode');
    const realExamDetails = document.getElementById('real-exam-details');
    const examLengthSelect = document.getElementById('exam-length');
    const shuffleCheckbox = document.getElementById('shuffle-questions');
    const startBtn = document.getElementById('start-btn');
    
    // Exam Elements
    const currentQNumDisplay = document.getElementById('current-q-num');
    const totalQNumDisplay = document.getElementById('total-q-num');
    const progressFill = document.getElementById('progress-fill');
    const timerDisplay = document.getElementById('timer-display');
    const timerContainer = timerDisplay.closest('.timer-container');
    const stopBtn = document.getElementById('stop-btn');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    // Explanation Elements
    const explanationPanel = document.getElementById('explanation-panel');
    const expCorrectText = document.getElementById('exp-correct-text');
    const expIncorrectText = document.getElementById('exp-incorrect-text');
    
    // Results Elements
    const finalScoreDisplay = document.getElementById('final-score');
    const finalTotalDisplay = document.getElementById('final-total');
    const finalPercentageDisplay = document.getElementById('final-percentage');
    const resultStatus = document.getElementById('result-status');
    const statCorrect = document.getElementById('stat-correct');
    const statIncorrect = document.getElementById('stat-incorrect');
    const statTime = document.getElementById('stat-time');
    const restartBtn = document.getElementById('restart-btn');

    const REAL_EXAM_QUESTION_COUNT = 90;
    const REAL_EXAM_TIME_LIMIT_SECONDS = 90 * 60;
    const REAL_EXAM_MAX_SCORE = 900;
    const REAL_EXAM_PASSING_SCORE = 750;

    // State Variables
    let allQuestions = [];
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let selectedOptionId = null;
    let score = 0;
    let incorrectCount = 0;
    let isRealExamMode = false;
    
    // Timer Variables
    let timerInterval = null;
    let timeUsed = 0;
    let timeLimitSeconds = null;

    // Initialize App
    async function initApp() {
        try {
            const response = await fetch('question.json');
            if (!response.ok) {
                throw new Error('ไม่สามารถโหลดข้อมูลข้อสอบได้');
            }
            const data = await response.json();
            allQuestions = data.questions;
            populateExamLengthOptions();
            updateExamModeUI();
            console.log('โหลดข้อสอบจาก question.json สำเร็จ');
        } catch (error) {
            console.warn('ไม่สามารถโหลด question.json ได้, กำลังพยายามใช้ข้อมูลสำรอง:', error);
            if (window.examData && window.examData.questions) {
                allQuestions = window.examData.questions;
                populateExamLengthOptions();
                updateExamModeUI();
                console.log('โหลดข้อสอบจาก question-data.js (สำรอง) สำเร็จ');
            } else {
                console.error(error);
                questionText.innerHTML = '⚠️ เกิดข้อผิดพลาดในการโหลดข้อสอบ กรุณาตรวจสอบไฟล์ question.json';
                startBtn.disabled = true;
                startBtn.innerHTML = 'ไม่พบข้อมูลข้อสอบ';
            }
        }
    }

    function populateExamLengthOptions() {
        examLengthSelect.innerHTML = '';
        
        const total = allQuestions.length;
        const chunkSize = 40;
        let setNum = 1;
        
        for (let i = 0; i < total; i += chunkSize) {
            const end = Math.min(i + chunkSize, total);
            const option = document.createElement('option');
            option.value = `${i}-${end}`;
            option.textContent = `ชุดที่ ${setNum} (ข้อ ${i + 1} - ${end})`;
            examLengthSelect.appendChild(option);
            setNum++;
        }
        
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = `ทั้งหมด (${total} ข้อ)`;
        examLengthSelect.appendChild(allOption);
    }

    function updateExamModeUI() {
        const realModeSelected = examModeSelect.value === 'real';
        realExamDetails.classList.toggle('hidden', !realModeSelected);
        examLengthSelect.disabled = realModeSelected;
        shuffleCheckbox.disabled = realModeSelected;
        examLengthSelect.closest('.settings-group').classList.toggle('disabled', realModeSelected);
        shuffleCheckbox.closest('.settings-group').classList.toggle('disabled', realModeSelected);
    }

    examModeSelect.addEventListener('change', updateExamModeUI);

    // Utility: Shuffle Array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Utility: Check if user answers match correct answers
    function checkAnswerCorrect(correctAnswer, userSelectedAnswer) {
        if (Array.isArray(correctAnswer)) {
            const userAns = Array.isArray(userSelectedAnswer) ? userSelectedAnswer : [userSelectedAnswer];
            if (correctAnswer.length !== userAns.length) return false;
            return correctAnswer.every(ans => userAns.includes(ans));
        } else {
            return correctAnswer === userSelectedAnswer;
        }
    }

    function prepareQuestions(selectedQuestions) {
        return selectedQuestions.map(q => {
            const optionsArray = Object.keys(q.options).map(key => ({
                id: key,
                text: q.options[key],
                isCorrect: Array.isArray(q.correct_answer)
                    ? q.correct_answer.includes(key)
                    : key === q.correct_answer
            }));
            return {
                ...q,
                optionsArray: optionsArray,
                isAnswered: false,
                userSelectedAnswer: null
            };
        });
    }

    function shufflePreparedQuestions(questions) {
        return shuffleArray(questions).map(q => {
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

    // Start Exam
    startBtn.addEventListener('click', () => {
        isRealExamMode = examModeSelect.value === 'real';
        const shouldShuffle = shuffleCheckbox.checked;
        const examLength = examLengthSelect.value;
        
        let selectedQuestions = [...allQuestions];
        if (isRealExamMode) {
            selectedQuestions = shuffleArray(selectedQuestions).slice(0, REAL_EXAM_QUESTION_COUNT);
        } else if (examLength !== 'all') {
            const parts = examLength.split('-');
            const startIdx = parseInt(parts[0], 10);
            const endIdx = parseInt(parts[1], 10);
            selectedQuestions = selectedQuestions.slice(startIdx, endIdx);
        }

        currentQuestions = prepareQuestions(selectedQuestions);

        if (!isRealExamMode && shouldShuffle) {
            currentQuestions = shufflePreparedQuestions(currentQuestions);
        }

        // Reset state
        currentQuestionIndex = 0;
        score = 0;
        incorrectCount = 0;
        timeUsed = 0;
        timeLimitSeconds = isRealExamMode ? REAL_EXAM_TIME_LIMIT_SECONDS : null;
        timerContainer.classList.remove('warning');
        resultStatus.classList.add('hidden');
        resultStatus.classList.remove('pass', 'fail');

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

    // Format Time Thai
    function formatTimeThai(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} นาที ${s} วินาที`;
    }

    // Timer logic
    function startTimer() {
        clearInterval(timerInterval);
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeUsed++;
            updateTimerDisplay();
            if (timeLimitSeconds && timeUsed >= timeLimitSeconds) {
                finishExam(true);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        if (timeLimitSeconds) {
            const remaining = Math.max(timeLimitSeconds - timeUsed, 0);
            timerDisplay.textContent = formatTime(remaining);
            timerContainer.classList.toggle('warning', remaining <= 300);
        } else {
            timerDisplay.textContent = formatTime(timeUsed);
            timerContainer.classList.remove('warning');
        }
    }

    // Load Question
    function loadQuestion() {
        const q = currentQuestions[currentQuestionIndex];
        
        // Update Progress
        currentQNumDisplay.textContent = currentQuestionIndex + 1;
        totalQNumDisplay.textContent = currentQuestions.length;
        const progressPercentage = ((currentQuestionIndex) / currentQuestions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        // Update Prev Button
        if (currentQuestionIndex > 0) {
            prevBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
        }

        // Reset UI
        explanationPanel.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = true;
        nextBtn.classList.add('hidden');
        nextBtn.disabled = false;
        nextBtn.innerHTML = currentQuestionIndex === currentQuestions.length - 1
            ? `ส่งข้อสอบ <i class="fa-solid fa-flag-checkered"></i>`
            : `ข้อถัดไป <i class="fa-solid fa-arrow-right"></i>`;
        const isMultipleChoice = Array.isArray(q.correct_answer);
        selectedOptionId = q.userSelectedAnswer
            ? (Array.isArray(q.userSelectedAnswer) ? [...q.userSelectedAnswer] : q.userSelectedAnswer)
            : (isMultipleChoice ? [] : null);

        if (isRealExamMode) {
            submitBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
        } else if (isMultipleChoice) {
            submitBtn.innerHTML = `ตรวจคำตอบ (เลือก ${q.correct_answer.length} ข้อ) <i class="fa-solid fa-check"></i>`;
        } else {
            submitBtn.innerHTML = `ตรวจคำตอบ <i class="fa-solid fa-check"></i>`;
        }

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
                if (q.isAnswered && !isRealExamMode) return;
                
                if (isMultipleChoice) {
                    const idx = selectedOptionId.indexOf(opt.id);
                    if (idx > -1) {
                        btn.classList.remove('selected');
                        selectedOptionId.splice(idx, 1);
                    } else {
                        if (selectedOptionId.length < q.correct_answer.length) {
                            btn.classList.add('selected');
                            selectedOptionId.push(opt.id);
                        } else {
                            const oldestId = selectedOptionId.shift();
                            const oldestBtn = Array.from(optionsContainer.querySelectorAll('.option-btn')).find(
                                b => b.querySelector('.option-label').textContent === oldestId
                            );
                            if (oldestBtn) {
                                oldestBtn.classList.remove('selected');
                            }
                            btn.classList.add('selected');
                            selectedOptionId.push(opt.id);
                        }
                    }
                    
                    const remaining = q.correct_answer.length - selectedOptionId.length;
                    if (remaining > 0) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = `ตรวจคำตอบ (เลือกอีก ${remaining} ข้อ) <i class="fa-solid fa-check"></i>`;
                    } else {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `ตรวจคำตอบ <i class="fa-solid fa-check"></i>`;
                    }
                } else {
                    if (selectedOptionId === opt.id) {
                        btn.classList.remove('selected');
                        selectedOptionId = null;
                        submitBtn.disabled = true;
                    } else {
                        optionsContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        selectedOptionId = opt.id;
                        submitBtn.disabled = false;
                    }
                }

                if (isRealExamMode) {
                    q.userSelectedAnswer = Array.isArray(selectedOptionId)
                        ? [...selectedOptionId]
                        : selectedOptionId;
                    q.isAnswered = Array.isArray(selectedOptionId)
                        ? selectedOptionId.length > 0
                        : Boolean(selectedOptionId);
                }
            });
            
            optionsContainer.appendChild(btn);
        });

        if (isRealExamMode) {
            const allOptionBtns = document.querySelectorAll('.option-btn');
            allOptionBtns.forEach(btn => {
                const label = btn.querySelector('.option-label').textContent;
                const isLabelSelected = Array.isArray(q.userSelectedAnswer)
                    ? q.userSelectedAnswer.includes(label)
                    : label === q.userSelectedAnswer;
                btn.classList.toggle('selected', isLabelSelected);
            });
            return;
        }

        // Restore answered state if already answered
        if (q.isAnswered) {
            submitBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
            
            const isCorrect = checkAnswerCorrect(q.correct_answer, q.userSelectedAnswer);

            const allOptionBtns = document.querySelectorAll('.option-btn');
            allOptionBtns.forEach(btn => {
                btn.disabled = true;
                const label = btn.querySelector('.option-label').textContent;
                
                const isLabelCorrect = Array.isArray(q.correct_answer)
                    ? q.correct_answer.includes(label)
                    : label === q.correct_answer;

                const isLabelSelected = Array.isArray(q.userSelectedAnswer)
                    ? q.userSelectedAnswer.includes(label)
                    : label === q.userSelectedAnswer;

                if (isLabelCorrect) {
                    btn.classList.add('correct');
                } else if (isLabelSelected) {
                    btn.classList.add('incorrect');
                }
            });

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
        }
    }

    // Submit Answer
    submitBtn.addEventListener('click', () => {
        const q = currentQuestions[currentQuestionIndex];
        const isMultipleChoice = Array.isArray(q.correct_answer);

        if (isMultipleChoice) {
            if (!selectedOptionId || selectedOptionId.length !== q.correct_answer.length) return;
        } else {
            if (!selectedOptionId) return;
        }

        q.isAnswered = true;
        q.userSelectedAnswer = selectedOptionId;

        const isCorrect = checkAnswerCorrect(q.correct_answer, selectedOptionId);
        
        // Disable all options
        const allOptionBtns = document.querySelectorAll('.option-btn');
        allOptionBtns.forEach(btn => {
            btn.disabled = true;
            const label = btn.querySelector('.option-label').textContent;
            
            const isLabelCorrect = Array.isArray(q.correct_answer)
                ? q.correct_answer.includes(label)
                : label === q.correct_answer;

            const isLabelSelected = Array.isArray(selectedOptionId)
                ? selectedOptionId.includes(label)
                : label === selectedOptionId;

            if (isLabelCorrect) {
                btn.classList.add('correct');
            } else if (isLabelSelected) {
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

    // Previous Question
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    });

    // Stop Exam
    stopBtn.addEventListener('click', () => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการหยุดทำข้อสอบและดูผลคะแนน?')) {
            finishExam(false);
        }
    });

    function calculateFinalScore() {
        return currentQuestions.reduce((total, q) => {
            if (!q.isAnswered) return total;
            return checkAnswerCorrect(q.correct_answer, q.userSelectedAnswer) ? total + 1 : total;
        }, 0);
    }

    // Finish Exam
    function finishExam(isTimeUp) {
        clearInterval(timerInterval);
        score = calculateFinalScore();
        
        if (isTimeUp) {
            alert('หมดเวลาทำข้อสอบแล้ว!');
        }

        // Update Results UI
        const percentage = currentQuestions.length > 0 ? Math.round((score / currentQuestions.length) * 100) : 0;
        const scaledScore = currentQuestions.length > 0
            ? Math.round((score / currentQuestions.length) * REAL_EXAM_MAX_SCORE)
            : 0;

        if (isRealExamMode) {
            const passed = scaledScore >= REAL_EXAM_PASSING_SCORE;
            finalScoreDisplay.textContent = scaledScore;
            finalTotalDisplay.textContent = REAL_EXAM_MAX_SCORE;
            finalPercentageDisplay.textContent = `${score}/${currentQuestions.length} ข้อ (${percentage}%)`;
            resultStatus.textContent = passed
                ? `ผ่านเกณฑ์ ${REAL_EXAM_PASSING_SCORE}/${REAL_EXAM_MAX_SCORE}`
                : `ยังไม่ผ่านเกณฑ์ ${REAL_EXAM_PASSING_SCORE}/${REAL_EXAM_MAX_SCORE}`;
            resultStatus.classList.remove('hidden', 'pass', 'fail');
            resultStatus.classList.add(passed ? 'pass' : 'fail');
        } else {
            finalScoreDisplay.textContent = score;
            finalTotalDisplay.textContent = currentQuestions.length;
            finalPercentageDisplay.textContent = `${percentage}%`;
            resultStatus.classList.add('hidden');
            resultStatus.classList.remove('pass', 'fail');
        }

        statCorrect.textContent = score;
        statIncorrect.textContent = currentQuestions.length - score; // If time's up, unanswered are counted as incorrect visually here, or we can use incorrectCount. Let's use (total - score).
        statTime.textContent = formatTimeThai(timeUsed);

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
