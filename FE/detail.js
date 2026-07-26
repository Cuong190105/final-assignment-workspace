/* ============================================================
    detail.js — Course Detail, Progress, Quiz
    Used by course-detail.html
    Requires shared course helpers from app.js
    ============================================================ */

// Page state
const detailState = {
    courseId: null,
    course: null,
    detail: null,
    completedLessons: [],
    sectionPassMap: {},
    activeQuizSectionIndex: null,
    currentUser: null,
};

// Builds the query string parser
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Returns the current user ID or guest if not logged in
function getCurrentUserId() {
    if (typeof getLoggedInUser !== "function") {
        return "guest";
    }

    return String(getLoggedInUser()?.id ?? "guest");
}

// Checks if a user is logged in
function hasLoggedInUser() {
    return Boolean(detailState.currentUser);
}

// Formats price as FREE or $xx
function formatPrice(price) {
    return price === 0 ? "FREE" : `$${price}`;
}

// Finds a course by id from the legacy local copy
function getLegacyCourseById(id) {
    return null;
}

// Reads detail content from the legacy local copy
function getLegacyCourseDetail(id) {
    return LEGACY_COURSE_DETAILS[id] || null;
}

// Returns the localStorage key for lesson progress
function getProgressStorageKey(courseId) {
    return `learnhub_completed_lessons_${getCurrentUserId()}_${courseId}`;
}

// Returns the localStorage key for quiz results
function getQuizStorageKey(courseId) {
    return `learnhub_quiz_results_${getCurrentUserId()}_${courseId}`;
}

// Loads completed lessons from localStorage
function loadCompletedLessons(courseId) {
    try {
        const raw = localStorage.getItem(getProgressStorageKey(courseId));
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Saves completed lessons to localStorage
function saveCompletedLessons(courseId, list) {
    localStorage.setItem(getProgressStorageKey(courseId), JSON.stringify(list));
}

// Loads quiz pass/fail state from localStorage
function loadQuizResults(courseId) {
    try {
        const raw = localStorage.getItem(getQuizStorageKey(courseId));
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

// Saves quiz pass/fail state to localStorage
function saveQuizResults(courseId, data) {
    localStorage.setItem(getQuizStorageKey(courseId), JSON.stringify(data));
}

// Returns all lessons in all sections
function getAllLessons(detail) {
    return detail.sections.flatMap((section) => section.lessons);
}

// Counts lessons in a section
function getSectionLessonCount(section) {
    return section.lessons.length;
}

// Returns true if a lesson is completed
function isLessonCompleted(lessonId) {
    return detailState.completedLessons.includes(lessonId);
}

// Adds or removes a lesson from completed list
function toggleLessonCompletion(lessonId, checked) {
    if (checked) {
        if (!detailState.completedLessons.includes(lessonId)) {
            detailState.completedLessons.push(lessonId);
        }
    } else {
        detailState.completedLessons = detailState.completedLessons.filter(
            (id) => id !== lessonId,
        );
    }

    saveCompletedLessons(detailState.courseId, detailState.completedLessons);
    updateProgressUI();
    updateSectionBadges();
}

// Calculates overall progress
function getProgressStats() {
    const allLessons = getAllLessons(detailState.detail);
    const total = allLessons.length;
    const completed = allLessons.filter((lesson) =>
        isLessonCompleted(lesson.id),
    ).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percent };
}

// Updates progress bar and text
function updateProgressUI() {
    if (!hasLoggedInUser()) {
        const progressSection = document.getElementById("progressSection");
        const progressText = document.getElementById("progressText");
        const progressBar = document.getElementById("progressBar");

        progressSection?.classList.add("d-none");

        if (progressText) {
            progressText.textContent = "Login to track your progress";
        }

        if (progressBar) {
            progressBar.style.width = "0%";
            progressBar.setAttribute("aria-valuenow", "0");
            progressBar.textContent = "";
        }

        return;
    }

    const { total, completed, percent } = getProgressStats();

    const progressText = document.getElementById("progressText");
    const progressBar = document.getElementById("progressBar");

    if (progressText) {
        progressText.textContent = `${completed} / ${total} lessons completed`;
    }

    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute("aria-valuenow", String(percent));
        progressBar.textContent = percent > 0 ? `${percent}%` : "";
    }
}

// Updates section badges when all lessons are completed
function updateSectionBadges() {
    detailState.detail.sections.forEach((section, sectionIndex) => {
        const allDone = section.lessons.every((lesson) =>
            isLessonCompleted(lesson.id),
        );
        const badge = document.getElementById(`sectionBadge-${sectionIndex}`);

        if (badge) {
            badge.classList.toggle("d-none", !allDone);
        }
    });
}

// Renders the course header and sidebar data
function renderCourseInfo() {
    const courseBanner = document.getElementById("courseBanner");
    const sidebarThumbnail = document.getElementById("sidebarThumbnail");
    const courseTitle = document.getElementById("courseTitle");
    const courseRating = document.getElementById("courseRating");
    const courseStudents = document.getElementById("courseStudents");
    const courseInstructor = document.getElementById("courseInstructor");
    const coursePrice = document.getElementById("coursePrice");
    const lessonCount = document.getElementById("lessonCount");
    const learnList = document.getElementById("learnList");
    const description1 = document.getElementById("description1");
    const description2 = document.getElementById("description2");

    const iconMap = {
        "bi-code-slash": "bi-code-slash",
        "bi-braces": "bi-braces",
        "bi-palette": "bi-palette",
        "bi-vector-pen": "bi-vector-pen",
        "bi-bar-chart-line": "bi-bar-chart-line",
        "bi-graph-up": "bi-graph-up",
        "bi-megaphone": "bi-megaphone",
        "bi-search": "bi-search",
    };

    const bannerIcon =
        detailState.course.icon && iconMap[detailState.course.icon]
            ? detailState.course.icon
            : "bi-mortarboard-fill";

    if (courseBanner) {
        courseBanner.className = `course-detail-banner rounded-custom shadow-custom mb-4 ${detailState.detail.bannerClass}`;
        courseBanner.innerHTML = `
            <div class="detail-banner-overlay">
                <i class="bi ${bannerIcon}"></i>
            </div>
        `;
    }

    if (sidebarThumbnail) {
        sidebarThumbnail.className = `course-thumbnail ${detailState.detail.sidebarClass}`;
        sidebarThumbnail.innerHTML = `
            <div class="detail-banner-overlay detail-banner-overlay-small">
                <i class="bi ${bannerIcon}"></i>
            </div>
        `;
    }

    if (courseTitle) courseTitle.textContent = detailState.course.title;
    if (courseRating)
        courseRating.textContent = `${detailState.course.rating.toFixed(1)} (${detailState.course.reviews} reviews)`;
    if (courseStudents)
        courseStudents.textContent = `${detailState.detail.students} students`;
    if (courseInstructor)
        courseInstructor.textContent = `By: ${detailState.course.instructor}`;
    if (coursePrice)
        coursePrice.textContent = formatPrice(detailState.course.price);
    if (lessonCount) lessonCount.textContent = `${detailState.course.lessons}`;
    if (description1)
        description1.textContent = detailState.detail.description1;
    if (description2)
        description2.textContent = detailState.detail.description2;

    if (learnList) {
        learnList.innerHTML = detailState.detail.learn
            .map(
                (item) => `
                <li class="learn-item">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    <span>${item}</span>
                </li>
            `,
            )
            .join("");
    }
}

// Builds the quiz card for one section
function buildQuizPanel(section, sectionIndex) {
    const questionsHtml = section.quiz
        .map((question, questionIndex) => {
            const optionsHtml = question.options
                .map((option, optionIndex) => {
                    const inputId = `quiz-${sectionIndex}-${questionIndex}-${optionIndex}`;
                    return `
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio"
                                name="quiz-${sectionIndex}-${questionIndex}"
                                id="${inputId}"
                                value="${optionIndex}">
                            <label class="form-check-label" for="${inputId}">
                                ${option}
                            </label>
                        </div>
                    `;
                })
                .join("");

            return `
                <div class="quiz-question mb-4" data-question-index="${questionIndex}">
                    <p class="fw-semibold mb-2">Q${questionIndex + 1}. ${question.question}</p>
                    ${optionsHtml}
                    <div class="quiz-feedback mt-2 d-none"></div>
                </div>
            `;
        })
        .join("");

    return `
        <div class="quiz-panel card shadow-custom border-0 mt-3 d-none" id="quizPanel-${sectionIndex}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h5 class="mb-0">Quiz: ${section.title}</h5>
                    <span class="badge text-bg-secondary">Pass score: 70%</span>
                </div>
                <form class="quiz-form" id="quizForm-${sectionIndex}">
                    ${questionsHtml}
                    <div class="quiz-result mb-3 d-none" id="quizResult-${sectionIndex}"></div>
                    <div class="d-flex flex-wrap gap-2">
                        <button type="submit" class="btn-custom btn-primary-custom" id="submitQuiz-${sectionIndex}">
                            Submit Quiz
                        </button>
                        <button type="button" class="btn-custom btn-outline-secondary d-none" id="retakeQuiz-${sectionIndex}">
                            Retake Quiz
                        </button>
                        <button type="button" class="btn-custom btn-primary-custom d-none" id="continueQuiz-${sectionIndex}">
                            Continue to next section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Renders the curriculum accordion
function renderCurriculum() {
    const accordion = document.getElementById("curriculumAccordion");
    if (!accordion) return;

    accordion.innerHTML = detailState.detail.sections
        .map((section, sectionIndex) => {
            const sectionContent = hasLoggedInUser()
                ? `
                            ${section.lessons
                                .map((lesson, lessonIndex) => {
                                    const checkboxId = `${lesson.id}`;
                                    return `
                        <div class="lesson-item d-flex align-items-start gap-3 py-2">
                            <div class="form-check">
                                <input
                                    class="form-check-input lesson-checkbox"
                                    type="checkbox"
                                    id="${checkboxId}"
                                    data-lesson-id="${lesson.id}"
                                    ${isLessonCompleted(lesson.id) ? "checked" : ""}>
                            </div>
                            <a href="lesson.html?id=${lesson.id}" class="text-decoration-none d-flex align-items-center flex-grow-1">
                                <div class="flex-grow-1">
                                    <label class="lesson-label fw-medium">
                                        ${lessonIndex + 1}. ${lesson.title}
                                    </label>
                                </div>
                                <span class="lesson-link">
                                    View Lesson
                                </span>
                            </a>
                        </div>
                    `;
                                })
                                .join("")}

                            <div class="d-flex justify-content-end mt-3">
                                <button type="button"
                                    class="btn-custom btn-outline-primary open-quiz-btn"
                                    id="openQuiz-${sectionIndex}"
                                    data-section-index="${sectionIndex}">
                                    Take Quiz
                                </button>
                            </div>
                            ${buildQuizPanel(section, sectionIndex)}
                    `
                : "";
            const badgeId = `sectionBadge-${sectionIndex}`;
            const collapseId = `collapse-${sectionIndex}`;
            const headingId = `heading-${sectionIndex}`;

            return `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="${headingId}">
                        <button class="accordion-button ${sectionIndex === 0 ? "" : "collapsed"}" type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#${collapseId}"
                            aria-expanded="${sectionIndex === 0 ? "true" : "false"}"
                            aria-controls="${collapseId}">
                            <span class="me-2">${section.title}</span>
                            <span class="badge text-bg-success ms-auto me-2 d-none" id="${badgeId}">Completed</span>
                        </button>
                    </h2>
                    <div id="${collapseId}"
                        class="accordion-collapse collapse ${sectionIndex === 0 ? "show" : ""}"
                        aria-labelledby="${headingId}"
                        data-bs-parent="#curriculumAccordion">
                        <div class="accordion-body">
                            ${sectionContent}
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");
}

// Adds event listeners to lesson checkboxes
function bindLessonCheckboxes() {
    document.querySelectorAll(".lesson-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const lessonId = checkbox.dataset.lessonId;
            toggleLessonCompletion(lessonId, checkbox.checked);
        });
    });
}

// Shows the quiz for a section
function showQuiz(sectionIndex) {
    const quizPanel = document.getElementById(`quizPanel-${sectionIndex}`);
    if (quizPanel) {
        quizPanel.classList.remove("d-none");
        quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Hides the quiz for a section
function hideQuiz(sectionIndex) {
    const quizPanel = document.getElementById(`quizPanel-${sectionIndex}`);
    if (quizPanel) {
        quizPanel.classList.add("d-none");
    }
}

// Resets quiz form and feedback
function resetQuizUI(sectionIndex) {
    const form = document.getElementById(`quizForm-${sectionIndex}`);
    const result = document.getElementById(`quizResult-${sectionIndex}`);
    const retakeBtn = document.getElementById(`retakeQuiz-${sectionIndex}`);
    const continueBtn = document.getElementById(`continueQuiz-${sectionIndex}`);

    if (form) {
        form.querySelectorAll("input[type='radio']").forEach((input) => {
            input.checked = false;
        });

        form.querySelectorAll(".quiz-question").forEach((questionBlock) => {
            questionBlock.classList.remove("quiz-correct", "quiz-wrong");
            const feedback = questionBlock.querySelector(".quiz-feedback");
            if (feedback) {
                feedback.classList.add("d-none");
                feedback.textContent = "";
            }
        });
    }

    if (result) {
        result.classList.add("d-none");
        result.innerHTML = "";
    }

    if (retakeBtn) retakeBtn.classList.add("d-none");
    if (continueBtn) continueBtn.classList.add("d-none");
}

// Opens the next accordion section
function openNextSection(sectionIndex) {
    const nextSectionButton = document.querySelector(
        `#heading-${sectionIndex + 1} .accordion-button`,
    );
    if (nextSectionButton) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(
            document.getElementById(`collapse-${sectionIndex + 1}`),
        );
        bsCollapse.show();
        nextSectionButton.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
}

// Updates the quiz UI after submission
function showQuizResult(sectionIndex, score, total) {
    const result = document.getElementById(`quizResult-${sectionIndex}`);
    const retakeBtn = document.getElementById(`retakeQuiz-${sectionIndex}`);
    const continueBtn = document.getElementById(`continueQuiz-${sectionIndex}`);

    if (!result) return;

    const percent = Math.round((score / total) * 100);
    const passed = percent >= 70;

    result.classList.remove("d-none");
    result.innerHTML = `
        <div class="alert ${passed ? "alert-success" : "alert-danger"} mb-0">
            <strong>${passed ? "Pass" : "Fail"}:</strong> ${score} / ${total} correct (${percent}%)
        </div>
    `;

    if (passed) {
        if (retakeBtn) retakeBtn.classList.add("d-none");
        if (continueBtn) continueBtn.classList.remove("d-none");
    } else {
        if (retakeBtn) retakeBtn.classList.remove("d-none");
        if (continueBtn) continueBtn.classList.add("d-none");
    }
}

// Marks questions as correct/wrong
function markQuizAnswers(sectionIndex, section) {
    section.quiz.forEach((question, questionIndex) => {
        const selected = document.querySelector(
            `input[name="quiz-${sectionIndex}-${questionIndex}"]:checked`,
        );
        const questionBlock = document.querySelector(
            `#quizForm-${sectionIndex} .quiz-question[data-question-index="${questionIndex}"]`,
        );
        const feedback = questionBlock?.querySelector(".quiz-feedback");

        if (!questionBlock || !feedback) return;

        questionBlock.classList.remove("quiz-correct", "quiz-wrong");

        if (!selected) {
            questionBlock.classList.add("quiz-wrong");
            feedback.classList.remove("d-none");
            feedback.innerHTML = `<span class="text-danger fw-semibold">No answer selected.</span>`;
            return;
        }

        const chosen = Number(selected.value);
        const correct = chosen === question.answer;

        questionBlock.classList.add(correct ? "quiz-correct" : "quiz-wrong");
        feedback.classList.remove("d-none");
        feedback.innerHTML = correct
            ? `<span class="text-success fw-semibold">Correct answer.</span>`
            : `<span class="text-danger fw-semibold">Wrong answer. Correct: ${question.options[question.answer]}</span>`;
    });
}

// Handles quiz submission
function submitQuiz(sectionIndex) {
    const section = detailState.detail.sections[sectionIndex];
    let score = 0;
    const total = section.quiz.length;

    section.quiz.forEach((question, questionIndex) => {
        const selected = document.querySelector(
            `input[name="quiz-${sectionIndex}-${questionIndex}"]:checked`,
        );
        if (selected && Number(selected.value) === question.answer) {
            score += 1;
        }
    });

    markQuizAnswers(sectionIndex, section);
    showQuizResult(sectionIndex, score, total);

    const passed = Math.round((score / total) * 100) >= 70;
    detailState.sectionPassMap[sectionIndex] = passed;
    saveQuizResults(detailState.courseId, detailState.sectionPassMap);
}

// Binds quiz buttons and form handlers
function bindQuizEvents() {
    document.querySelectorAll(".open-quiz-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const sectionIndex = Number(button.dataset.sectionIndex);
            showQuiz(sectionIndex);
        });
    });

    detailState.detail.sections.forEach((section, sectionIndex) => {
        const form = document.getElementById(`quizForm-${sectionIndex}`);
        const retakeBtn = document.getElementById(`retakeQuiz-${sectionIndex}`);
        const continueBtn = document.getElementById(
            `continueQuiz-${sectionIndex}`,
        );

        if (form) {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                submitQuiz(sectionIndex);
            });
        }

        if (retakeBtn) {
            retakeBtn.addEventListener("click", () => {
                resetQuizUI(sectionIndex);
                showQuiz(sectionIndex);
            });
        }

        if (continueBtn) {
            continueBtn.addEventListener("click", () => {
                const nextIndex = sectionIndex + 1;
                if (nextIndex < detailState.detail.sections.length) {
                    openNextSection(sectionIndex);
                }
            });
        }
    });
}

// Restores quiz UI if previously passed
function restoreQuizState() {
    detailState.detail.sections.forEach((section, sectionIndex) => {
        if (detailState.sectionPassMap[sectionIndex]) {
            const result = document.getElementById(
                `quizResult-${sectionIndex}`,
            );
            const retakeBtn = document.getElementById(
                `retakeQuiz-${sectionIndex}`,
            );
            const continueBtn = document.getElementById(
                `continueQuiz-${sectionIndex}`,
            );

            if (result) {
                result.classList.remove("d-none");
                result.innerHTML = `
                    <div class="alert alert-success mb-0">
                        <strong>Pass:</strong> Already completed
                    </div>
                `;
            }

            if (retakeBtn) retakeBtn.classList.add("d-none");
            if (continueBtn) continueBtn.classList.remove("d-none");
        } else {
            resetQuizUI(sectionIndex);
        }
    });
}

// Entry point
document.addEventListener("DOMContentLoaded", () => {
    const courseId = getQueryParam("id") || "1";
    const course = getCourseById(courseId);
    const detail = getCourseDetail(courseId);
    const currentUser =
        typeof getLoggedInUser === "function" ? getLoggedInUser() : null;

    if (!course || !detail) {
        document.body.innerHTML = `
            <div class="container py-5 text-center">
                <h1 class="mb-3">Course not found</h1>
                <p class="text-muted">The requested course detail page could not be loaded.</p>
                <a href="index.html" class="btn-custom btn-primary-custom">Back to Courses</a>
            </div>
        `;
        return;
    }

    detailState.courseId = courseId;
    detailState.course = course;
    detailState.detail = detail;
    detailState.currentUser = currentUser;
    detailState.completedLessons = loadCompletedLessons(courseId);
    detailState.sectionPassMap = loadQuizResults(courseId);

    renderCourseInfo();
    renderCurriculum();
    bindLessonCheckboxes();
    bindQuizEvents();
    updateProgressUI();
    updateSectionBadges();
    restoreQuizState();
});
