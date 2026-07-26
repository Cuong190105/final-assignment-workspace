let completedLessons = [];
let quizResults = {};
let completedSections = [];
let currentCourseId = null;
let currentSectionId = null;
let currentCourse = null;
let currentCourseDetail = null;
let currentSection = null;
let currentLesson = null;
let currentLessonId = null;
let activeQuizSectionId = null;

// Returns the current user ID as a string, or guest if not logged in
function getCurrentUserId() {
    if (typeof getLoggedInUser !== "function") {
        return "guest";
    }

    return String(getLoggedInUser()?.id ?? "guest");
}

// Returns sidebar UI elements to fill data
function getLessonSidebarElements() {
    return {
        sidebar: document.getElementById("lessonSidebar"),
        openBtn: document.getElementById("lessonSidebarOpenBtn"),
        closeBtn: document.getElementById("lessonSidebarCloseBtn"),
        backdrop: document.getElementById("lessonSidebarBackdrop"),
    };
}

// Returns lesson content UI elements to fill data
function getLessonContentElements() {
    return {
        videoContainer: document.getElementById("lessonVideoContainer"),
        quizContainer: document.getElementById("lessonQuizContainer"),
    };
}

// Show video
function showLessonVideo() {
    const { videoContainer, quizContainer } = getLessonContentElements();

    activeQuizSectionId = null;

    videoContainer?.classList.remove("d-none");
    quizContainer?.classList.add("d-none");
    if (quizContainer) {
        quizContainer.innerHTML = "";
    }
}

// Show quiz
function showLessonQuiz(sectionId) {
    const { videoContainer, quizContainer } = getLessonContentElements();

    activeQuizSectionId = sectionId;

    videoContainer?.classList.add("d-none");
    quizContainer?.classList.remove("d-none");
}

// Sets the open state of the lesson sidebar (mobile view)
function setLessonSidebarOpen(isOpen) {
    const { sidebar, backdrop } = getLessonSidebarElements();

    if (sidebar) {
        sidebar.classList.toggle("is-open", isOpen);
    }

    if (backdrop) {
        backdrop.classList.toggle("is-visible", isOpen);
    }
}

// Binds event listeners for opening and closing the lesson sidebar
function bindLessonSidebarControls() {
    const { openBtn, closeBtn, backdrop } = getLessonSidebarElements();

    if (openBtn) {
        openBtn.addEventListener("click", () => setLessonSidebarOpen(true));
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => setLessonSidebarOpen(false));
    }

    if (backdrop) {
        backdrop.addEventListener("click", () => setLessonSidebarOpen(false));
    }

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setLessonSidebarOpen(false);
        }
    });
}

// Get all lessons in the current course
function getLessonSequence() {
    if (!currentCourse?.sections) {
        return [];
    }

    return currentCourse.sections.flatMap((section) =>
        section.lessons.map((lesson) => ({
            sectionId: section.id,
            lessonId: lesson.id,
            section,
            lesson,
        })),
    );
}

// Resolves the lesson target based on sectionId and lessonId, or returns the first lesson if not found
function resolveLessonTarget(sectionId, lessonId) {
    const sequence = getLessonSequence();

    if (!sequence.length) {
        return null;
    }

    const exactMatch = sequence.find(
        (item) =>
            String(item.sectionId) === String(sectionId) &&
            String(item.lessonId) === String(lessonId),
    );

    return exactMatch || sequence[0];
}

// Returns the index of the current lesson in the sequence, or -1 if not found
function getCurrentLessonIndex() {
    const sequence = getLessonSequence();

    return sequence.findIndex(
        (item) =>
            String(item.sectionId) === String(currentSectionId) &&
            String(item.lessonId) === String(currentLessonId),
    );
}

// Updates the state of the previous and next lesson navigation buttons based on the current lesson
function updateLessonNavigationButtons() {
    const sequence = getLessonSequence();
    const currentIndex = getCurrentLessonIndex();
    const prevBtn = document.getElementById("prevLessonBtn");
    const nextBtn = document.getElementById("nextLessonBtn");

    if (!prevBtn || !nextBtn) {
        return;
    }

    const previousLesson = currentIndex > 0 ? sequence[currentIndex - 1] : null;
    const nextLesson =
        currentIndex >= 0 && currentIndex < sequence.length - 1
            ? sequence[currentIndex + 1]
            : null;

    prevBtn.disabled = !previousLesson;
    nextBtn.disabled = !nextLesson;

    prevBtn.onclick = previousLesson
        ? () => loadLesson(previousLesson.sectionId, previousLesson.lessonId)
        : null;

    nextBtn.onclick = nextLesson
        ? () => loadLesson(nextLesson.sectionId, nextLesson.lessonId)
        : null;
}

// Highlights the current lesson in the sidebar
function syncCurrentLessonHighlight() {
    const lessonTitles = document.querySelectorAll(".lesson-title");

    lessonTitles.forEach((title) => {
        const isCurrent =
            String(title.dataset.section) === String(currentSectionId) &&
            String(title.dataset.lesson) === String(currentLessonId);
        const lessonItem = title.closest(".lesson-item");

        title.classList.toggle("is-current", isCurrent);
        lessonItem?.classList.toggle("is-current", isCurrent);
    });
}

// Reveals the current section in the sidebar by expanding its accordion panel
function revealCurrentSection() {
    const sectionCollapse = document.getElementById(
        `section${currentSectionId}`,
    );

    if (!sectionCollapse) {
        return;
    }

    if (window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(sectionCollapse).show();
        return;
    }

    sectionCollapse.classList.add("show");
}

// Synchronizes the lesson navigation state by updating highlights, buttons, and revealing the current section
function syncLessonNavigationState() {
    syncCurrentLessonHighlight();
    updateLessonNavigationButtons();
    revealCurrentSection();
}

// Builds the query string parser
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Extracts the current course and section IDs from the lesson ID format
function getCurrentCourseAndSectionId() {
    // Lesson Id format: c{courseId}-s{sectionId}-l{lessonId}
    const parts = currentLessonId.split("-");
    currentCourseId = parts[0] ? Number(parts[0].slice(1)) : null;
    currentSectionId = parts[1] ? Number(parts[1].slice(1)) : null;
    return {
        currentCourseId,
        currentSectionId,
    };
}

// Retrieves the current lesson ID from the query parameters
function getCurrentLessonId() {
    const queryId = getQueryParam("id");
    return queryId ? queryId : null;
}

// Get the localStorage key for completed lessons for the current user and course
function getProgressStorageKey(courseId) {
    return `learnhub_completed_lessons_${getCurrentUserId()}_${courseId}`;
}

// Get the localStorage key for quiz results for the current user and course
function getQuizStorageKey(courseId) {
    return `learnhub_quiz_results_${getCurrentUserId()}_${courseId}`;
}

// Get the localStorage key for completed sections for the current user and course
function getCompletedSectionsStorageKey(courseId) {
    return `learnhub_completed_sections_${getCurrentUserId()}_${courseId}`;
}

// Load completed lessons from localStorage for the current user and course
function loadCompletedLessons(courseId) {
    try {
        const raw = localStorage.getItem(getProgressStorageKey(courseId));
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Save completed lessons to localStorage for the current user and course
function saveCompletedLessons(courseId, list) {
    localStorage.setItem(getProgressStorageKey(courseId), JSON.stringify(list));
}

// Load quiz results from localStorage for the current user and course
function loadQuizResults(courseId) {
    try {
        const raw = localStorage.getItem(getQuizStorageKey(courseId));
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

// Save quiz results to localStorage for the current user and course
function persistQuizResults(courseId, data) {
    localStorage.setItem(getQuizStorageKey(courseId), JSON.stringify(data));
}

// Load completed sections from localStorage for the current user and course
function loadCompletedSections(courseId) {
    try {
        const raw = localStorage.getItem(
            getCompletedSectionsStorageKey(courseId),
        );
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Save completed sections to localStorage for the current user and course
function persistCompletedSections(courseId, list) {
    localStorage.setItem(
        getCompletedSectionsStorageKey(courseId),
        JSON.stringify(list),
    );
}

// Load the current lesson and course information
function loadCurrentLessonAndCourseInfo() {
    currentLessonId = getCurrentLessonId();
    getCurrentCourseAndSectionId();
    currentCourse =
        getCourseById(currentCourseId) || getCourseCatalog()[0] || null;
    currentCourseDetail =
        getCourseDetail(currentCourseId) ||
        getCourseDetail(currentCourse?.id) ||
        null;

    if (!currentCourse || !currentCourseDetail) {
        alert("Không tìm thấy khóa học.");
        return;
    }

    currentCourse.sections = currentCourseDetail.sections;

    completedLessons = loadCompletedLessons(currentCourseId);
    quizResults = loadQuizResults(currentCourseId);
    completedSections = loadCompletedSections(currentCourseId);

    document.getElementById("courseTitle").textContent = currentCourse.title;

    const backToCourseBtn = document.getElementById("backToCourseBtn");
    if (backToCourseBtn) {
        backToCourseBtn.href = `course-detail.html?id=${currentCourseId}`;
    }

    const mobileBackToCourseBtn = document.getElementById(
        "mobileBackToCourseBtn",
    );
    if (mobileBackToCourseBtn) {
        mobileBackToCourseBtn.href = `course-detail.html?id=${currentCourseId}`;
    }
}

// Renders the curriculum sidebar with sections and lessons, and sets up event listeners
function renderCurriculum() {
    const accordion = document.getElementById("accordionCurriculum");
    if (!accordion || !currentCourse?.sections) return;
    accordion.innerHTML = currentCourse.sections
        .map((section) => {
            const isCurrentSection =
                String(section.id) === String(currentSectionId);
            const lessonHTML = section.lessons
                .map(
                    (lesson) => `
                        <div class="lesson-item">
                            <input 
                                type="checkbox" 
                                class="lesson-checkbox" 
                                data-id="${lesson.id}">
                            
                            <span
                                class="lesson-title" id="lessonTitle${lesson.id}"
                                data-section="${section.id}"
                                data-lesson="${lesson.id}">
                                ${lesson.title}
                            </span>
                        </div>
                    `,
                )
                .join("");
            return `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                    <button
                            id="accordionBtn${section.id}"
                            class="accordion-button${isCurrentSection ? "" : " collapsed"}"
                            type="button"
                            data-section="${section.id}"
                            data-bs-toggle="collapse"
                            data-bs-target="#section${section.id}"
                            aria-expanded="${isCurrentSection ? "true" : "false"}"
                        >

                            <span id="sectionTitle${section.id}">
                                ${section.title}
                            </span>
                        </button>
                    </h2>
                    <div 
                        id="section${section.id}" 
                        class="accordion-collapse collapse${isCurrentSection ? " show" : ""}" 
                        data-bs-parent="#accordionCurriculum">
                        <div class="accordion-body">
                            ${lessonHTML}
                            <button 
                                class="btn btn-primary mt-3 take-quiz-btn" 
                                data-section="${section.id}">
                                Take Quiz
                            </button>
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");

    addCheckboxEvents();
    addLessonEvents();
    addQuizEvents();

    restoreCheckboxes();
    restoreQuizResults();
    updateProgress();
    syncLessonNavigationState();
}

// Adds event listeners for lesson completion checkboxes
function addCheckboxEvents() {
    const accordion = document.getElementById("accordionCurriculum");

    if (!accordion || accordion.dataset.hasCheckboxListener) return;

    accordion.dataset.hasCheckboxListener = "true";

    accordion.addEventListener("change", function (e) {
        const box = e.target;
        if (!box.classList.contains("lesson-checkbox")) return;

        const lessonId = box.dataset.id;

        const section = currentCourse.sections.find((section) =>
            section.lessons.some((lesson) => lesson.id === lessonId),
        );

        const lessonTitle = document.getElementById(`lessonTitle${lessonId}`);

        if (box.checked) {
            if (!completedLessons.includes(lessonId)) {
                completedLessons.push(lessonId);
            }
            lessonTitle?.classList.add("lesson-completed");
        } else {
            completedLessons = completedLessons.filter((id) => id !== lessonId);
            lessonTitle?.classList.remove("lesson-completed");
        }

        saveProgress();
        updateProgress();
    });
}

// Saves the current progress of completed lessons to localStorage
function saveProgress() {
    saveCompletedLessons(currentCourseId, completedLessons);
}

// Updates the progress bar and text based on completed lessons
function updateProgress() {
    const totalLessons = currentCourse.sections.reduce(
        (total, section) => total + section.lessons.length,
        0,
    );
    const completed = currentCourse.sections
        .flatMap((section) => section.lessons)
        .filter((lesson) => completedLessons.includes(lesson.id)).length;
    const percent = totalLessons === 0 ? 0 : (completed / totalLessons) * 100;

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if (progressBar) {
        progressBar.style.width = percent + "%";
        progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));
        progressBar.textContent = percent > 0 ? `${Math.round(percent)}%` : "";
    }

    if (progressText) {
        progressText.textContent = `${completed} / ${totalLessons} lessons completed`;
    }
}

// Restores the state of lesson completion checkboxes based on completed lessons
function restoreCheckboxes() {
    const checkboxes = document.querySelectorAll(".lesson-checkbox");

    checkboxes.forEach((box) => {
        const lessonId = box.dataset.id;
        const lessonTitle = document.getElementById(`lessonTitle${lessonId}`);

        if (completedLessons.includes(lessonId)) {
            box.checked = true;
            lessonTitle.classList.add("lesson-completed");
        }
    });
}

// Adds click event listeners to lesson titles to load the corresponding lesson
function addLessonEvents() {
    const lessons = document.querySelectorAll(".lesson-title");
    lessons.forEach((item) => {
        item.addEventListener("click", function () {
            const sectionId = Number(this.dataset.section);
            const lessonId = this.dataset.lesson;
            loadLesson(sectionId, lessonId);
        });
    });
}

// Renders the quiz for a given section
function renderQuiz(sectionId, review = false) {
    const section = currentCourse.sections.find((s) => s.id === sectionId);
    const container = document.getElementById("lessonQuizContainer");

    if (!section || !container) return;

    const questionsHtml = section.quiz
        .map((question, index) => {
            const questionGroupName = `question-${sectionId}-${index}`;

            const optionsHtml = question.options
                .map((option, optionIndex) => {
                    const inputId = `question-${sectionId}-${index}-${optionIndex}`;

                    return `
                        <div class="form-check mb-2">
                            <input
                                class="form-check-input"
                                type="radio"
                                name="${questionGroupName}"
                                id="${inputId}"
                                value="${optionIndex}"
                                ${review ? "disabled" : ""}>
                            <label
                                class="form-check-label option-label"
                                for="${inputId}"
                                data-option="${option}"></label>
                        </div>
                    `;
                })
                .join("");

            return `
                <div class="card mt-3 quiz-question" data-question-index="${index}">
                    <div class="card-body">
                        <h6>Q${index + 1}. ${question.question}</h6>
                        ${optionsHtml}
                        <div class="quiz-feedback mt-2 d-none"></div>
                    </div>
                </div>
            `;
        })
        .join("");

    container.innerHTML = `
        <div class="card quiz-panel shadow-custom border-0">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <div>
                        <p class="text-uppercase text-muted small fw-semibold mb-1">Section quiz</p>
                        <h5 class="mb-0">${section.title}</h5>
                    </div>
                    <button type="button" class="btn-custom btn-outline-secondary" id="returnToLessonBtn">
                        Return to lesson
                    </button>
                </div>

                <form id="quizForm${sectionId}">
                    ${questionsHtml}

                    <div class="quiz-result mt-3 d-none" id="quizResult${sectionId}"></div>

                    <div class="d-flex flex-wrap gap-2 mt-3">
                        <button
                            class="btn btn-success"
                            type="submit"
                            id="submitQuiz${sectionId}"
                            ${review ? "disabled" : ""}>
                            Submit Quiz
                        </button>
                        <button
                            class="btn btn-outline-secondary d-none"
                            type="button"
                            id="retryBtn${sectionId}">
                            Retake Quiz
                        </button>
                        <button
                            class="btn btn-primary d-none"
                            type="button"
                            id="continueBtn${sectionId}">
                            Continue to next section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    container.querySelectorAll(".option-label").forEach((label) => {
        label.textContent = label.dataset.option;
    });

    const returnBtn = document.getElementById("returnToLessonBtn");
    returnBtn?.addEventListener("click", showLessonVideo);

    if (review) {
        section.quiz.forEach((question, index) => {
            const radios = document.querySelectorAll(
                `input[name="question-${sectionId}-${index}"]`,
            );

            radios.forEach((radio) => {
                if (Number(radio.value) === question.answer) {
                    radio.checked = true;

                    const label = radio.nextElementSibling;
                    if (label) {
                        label.style.color = "green";
                        label.style.fontWeight = "bold";
                    }
                }
            });
        });

        const result = document.getElementById(`quizResult${sectionId}`);
        const retryBtn = document.getElementById(`retryBtn${sectionId}`);
        const continueBtn = document.getElementById(`continueBtn${sectionId}`);

        if (result) {
            result.classList.remove("d-none");
            result.innerHTML = `
                <div class="alert alert-success mb-0">
                    <strong>Pass:</strong> Already completed
                </div>
            `;
        }

        if (retryBtn) retryBtn.classList.add("d-none");
        if (continueBtn) continueBtn.classList.remove("d-none");
    }

    const form = document.getElementById(`quizForm${sectionId}`);
    if (form && !review) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            submitQuiz(sectionId);
        });
    }

    const retryBtn = document.getElementById(`retryBtn${sectionId}`);
    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            renderQuiz(sectionId);
        });
    }

    const continueBtn = document.getElementById(`continueBtn${sectionId}`);
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            const index = currentCourse.sections.findIndex(
                (s) => s.id === sectionId,
            );
            const nextSection = currentCourse.sections[index + 1];

            if (!nextSection) return;

            const next = document.getElementById(`section${nextSection.id}`);

            bootstrap.Collapse.getOrCreateInstance(next).show();
        });
    }
}

// Adds click event listeners to Take Quiz buttons for each section
function addQuizEvents() {
    const buttons = document.querySelectorAll(".take-quiz-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            const sectionId = Number(this.dataset.section);

            showLessonQuiz(sectionId);
            renderQuiz(sectionId, Boolean(quizResults[sectionId]));

            const quizContainer = document.getElementById(
                "lessonQuizContainer",
            );
            quizContainer?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });
}

// Submits the quiz for a given section, checks answers, and displays results
function submitQuiz(sectionId) {
    const section = currentCourse.sections.find((s) => s.id === sectionId);
    let correct = 0;

    for (const [questionIndex, question] of section.quiz.entries()) {
        const questionGroupName = `question-${sectionId}-${questionIndex}`;
        const selected = document.querySelector(
            `input[name="${questionGroupName}"]:checked`,
        );

        // Chưa chọn câu này
        if (!selected) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const radios = document.querySelectorAll(
            `input[name="${questionGroupName}"]`,
        );

        radios.forEach((radio) => {
            const label = radio.nextElementSibling;

            label.style.color = "";
            label.style.fontWeight = "";

            if (radio.checked) {
                if (Number(radio.value) === question.answer) {
                    label.style.color = "green";
                    label.style.fontWeight = "bold";
                } else {
                    label.style.color = "red";
                    label.style.fontWeight = "bold";
                }
            }
        });

        if (Number(selected.value) === question.answer) {
            correct++;
        }
    }

    showQuizResult(sectionId, correct);
}

// Displays the quiz result for a given section, updates the UI, and saves the result
function showQuizResult(sectionId, correct) {
    const section = currentCourse.sections.find((s) => s.id === sectionId);
    const total = section.quiz.length;
    const percent = (correct / total) * 100;

    const result = document.getElementById(`quizResult${sectionId}`);
    if (!result) return;

    let html = `
        <div class="alert alert-info mt-3">
            Correct:
            ${correct}/${total}
            <br>
            Score:
            ${percent.toFixed(0)}%
        </div>
    `;

    if (percent >= 70) {
        quizResults[sectionId] = true;
        saveQuizResults();
        restoreQuizResults();
        html += `
            <p class="text-success fw-bold">
                You pass (>=70%)
            </p>

            <button
                class="btn btn-primary"
                id="continueBtn${sectionId}">
                Continue to next section
            </button>
        `;

        if (!completedSections.includes(sectionId)) {
            completedSections.push(sectionId);
            saveCompletedSections();
        }
    } else {
        quizResults[sectionId] = false;
        saveQuizResults();
        html += `
            <p class="text-danger fw-bold">
                You fail (<70%)
            </p>
            
            <button
                class="btn btn-danger"
                id="retryBtn${sectionId}">
                Retake Quiz
            </button>
        `;
    }

    result.innerHTML = html;
    result.classList.remove("d-none");

    const retryBtn = document.getElementById(`retryBtn${sectionId}`);
    const continueBtn = document.getElementById(`continueBtn${sectionId}`);

    if (retryBtn) {
        retryBtn.classList.toggle("d-none", percent >= 70);
        retryBtn.addEventListener("click", function () {
            renderQuiz(sectionId);
        });
    }

    if (percent >= 70) {
        if (continueBtn) {
            continueBtn.classList.remove("d-none");
            continueBtn.addEventListener("click", function () {
                const index = currentCourse.sections.findIndex(
                    (s) => s.id === sectionId,
                );

                const nextSection = currentCourse.sections[index + 1];

                if (!nextSection) return;

                const next = document.getElementById(
                    `section${nextSection.id}`,
                );

                bootstrap.Collapse.getOrCreateInstance(next).show();
            });
        }
    } else if (continueBtn) {
        continueBtn.classList.add("d-none");
    }
}

// Saves the current quiz results to localStorage for the current user and course
function saveQuizResults() {
    persistQuizResults(currentCourseId, quizResults);
}

// Saves the current completed sections to localStorage for the current user and course
function saveCompletedSections() {
    persistCompletedSections(currentCourseId, completedSections);
}

// Restores the state of quiz results in the UI based on saved quiz results
function restoreQuizResults() {
    Object.keys(quizResults).forEach((id) => {
        if (quizResults[id]) {
            const btn = document.querySelector(
                `.take-quiz-btn[data-section="${id}"]`,
            );
            if (btn) {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-success");
                btn.innerHTML = "Passed";
            }
        }
    });
}

// Load the lesson content (currently random 3 hardcoded video)
function loadLesson(sectionId, lessonId, options = {}) {
    const { syncHistory = true } = options;
    const target = resolveLessonTarget(sectionId, lessonId);

    if (!target) {
        return;
    }

    currentSectionId = target.sectionId;
    currentLessonId = target.lessonId;
    currentSection = target.section;
    currentLesson = target.lesson;

    if (syncHistory) {
        const nextUrl = `lesson.html?id=${encodeURIComponent(currentLessonId)}`;

        if (
            window.location.search !==
            `?id=${encodeURIComponent(currentLessonId)}`
        ) {
            window.history.pushState({}, "", nextUrl);
        }
    }

    document.getElementById("lessonTitle").textContent = currentLesson.title;
    const video = document.getElementById("lessonVideo");
    const randomVideoIndex = Math.floor(Math.random() * 3) + 1;
    video.src = `assets/videos/demo${randomVideoIndex}.mp4`;
    video.load();

    showLessonVideo();

    syncLessonNavigationState();
}

const currentLessonUser =
    typeof getLoggedInUser === "function" ? getLoggedInUser() : null;

if (!currentLessonUser) {
    window.location.replace("login.html");
} else {
    loadCurrentLessonAndCourseInfo();
    bindLessonSidebarControls();
    renderCurriculum();
    loadLesson(currentSectionId, currentLessonId, { syncHistory: false });

    window.addEventListener("popstate", () => {
        const nextLessonId = getCurrentLessonId();

        if (!nextLessonId) {
            return;
        }

        const parts = nextLessonId.split("-");
        const nextSectionId = parts[1]
            ? Number(parts[1].slice(1))
            : currentSectionId;

        loadLesson(nextSectionId, nextLessonId, { syncHistory: false });
    });
}
