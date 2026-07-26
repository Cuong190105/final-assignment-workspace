localStorage.clear();



let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
let quizResults = JSON.parse(localStorage.getItem("quizResults")) || {};

let completedSections = JSON.parse(localStorage.getItem("completedSections")) || [];

let currentCourse = null;
let currentSection = null;
let currentLesson = null;


// thay the khi ghep code với trang trước
if (!localStorage.getItem("currentCourseId")) {
    localStorage.setItem("currentCourseId", "1");
}

function loadCurrentCourse() {
    const courseId = Number(localStorage.getItem("currentCourseId"));
    currentCourse = courses.find(course => course.id === courseId);

    if (!currentCourse) {
        alert("Không tìm thấy khóa học.");
        return;
    }
    document.getElementById("courseTitle").textContent = currentCourse.title;

}

function renderCurriculum() {
    const accordion = document.getElementById("accordionCurriculum");

    if (!accordion || !currentCourse?.sections) return;

    accordion.innerHTML = currentCourse.sections.map(section => {
        const unlocked = isSectionUnlocked(section.id);
        const lessonHTML = section.lessons.map(lesson => `
            <div class="lesson-item">
                <input 
                    type="checkbox" 
                    class="lesson-checkbox" 
                    data-id="${lesson.id}"
                    ${!unlocked ? "disabled" : ""}>
                
            <span
                class="lesson-title ${!unlocked ? "text-muted" : ""}"                    id="lessonTitle${lesson.id}" 
                                data-section="${section.id}" 
                                data-lesson="${lesson.id}">
                                ${lesson.title}
                            </span>
                        </div>
                    `).join("");
        return `
            <div class="accordion-item">
                <h2 class="accordion-header">
                   <button
                        id="accordionBtn${section.id}"
                        class="accordion-button collapsed"
                        type="button"
                        data-section="${section.id}"

                        ${unlocked
                ? `
                                data-bs-toggle="collapse"
                                data-bs-target="#section${section.id}"
                                `
                : ""}
                    >

                        <span id="sectionTitle${section.id}">
                            ${section.title}
                            ${!unlocked ? " 🔒" : ""}
                        </span>
                    </button>
                </h2>
                <div 
                    id="section${section.id}" 
                    class="accordion-collapse collapse" 
                    data-bs-parent="#accordionCurriculum">
                    <div class="accordion-body">
                        ${lessonHTML}
                        <button 
                            class="btn btn-primary mt-3 take-quiz-btn" 
                            data-section="${section.id}">
                            Take Quiz
                        </button>
                        <div id="quizContainer${section.id}" class="mt-3"></div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    addCheckboxEvents();
    addLessonEvents();
    addQuizEvents();

    restoreCheckboxes();
    restoreQuizResults();
    addSectionEvents();
    updateProgress();
    updateSectionBadges();
}

function addCheckboxEvents() {
    const accordion = document.getElementById("accordionCurriculum");

    if (!accordion || accordion.dataset.hasCheckboxListener) return;

    accordion.dataset.hasCheckboxListener = "true";

    accordion.addEventListener("change", function (e) {
        const box = e.target;
        if (!box.classList.contains("lesson-checkbox")) return;

        const lessonId = Number(box.dataset.id);

        const section = currentCourse.sections.find(section =>
            section.lessons.some(lesson => lesson.id === lessonId)
        );

        if (!isSectionUnlocked(section.id)) {
            alert("Please pass the previous section quiz first.");
            box.checked = false;
            return;
        }
        const lessonTitle = document.getElementById(`lessonTitle${lessonId}`);

        if (box.checked) {
            if (!completedLessons.includes(lessonId)) {
                completedLessons.push(lessonId);
            }
            lessonTitle?.classList.add("lesson-completed");
        } else {
            completedLessons = completedLessons.filter(id => id !== lessonId);
            lessonTitle?.classList.remove("lesson-completed");
        }

        saveProgress();
        updateProgress();
        updateSectionBadges();
    });
}

function saveProgress() {
    localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
}

function updateProgress() {
    const totalLessons = currentCourse.sections.reduce(
        (total, section) => total + section.lessons.length,
        0
    );
    const completed = currentCourse.sections
        .flatMap(section => section.lessons)
        .filter(lesson => completedLessons.includes(lesson.id))
        .length; const percent = totalLessons === 0 ? 0 : (completed / totalLessons) * 100;

    document.getElementById("progressBar").style.width = percent + "%";

    document.getElementById("progressBar").innerHTML = Math.round(percent) + "%";

    document.getElementById("progressText").innerHTML = `${completed} / ${totalLessons} lessons completed`;
}

function updateSectionBadges() {
    currentCourse.sections.forEach(section => {
        const completed = section.lessons.every(lesson => completedLessons.includes(lesson.id));
        const title = document.getElementById(`sectionTitle${section.id}`);

        if (!title) return;

        if (completed) {
            title.innerHTML = `✅ ${section.title}`;
            title.classList.add("section-completed");
        }
        else {

            if (isSectionUnlocked(section.id)) {

                title.innerHTML = section.title;

            } else {

                title.innerHTML = `${section.title} 🔒`;

            }

            title.classList.remove("section-completed");

        }
    });
}

function restoreCheckboxes() {
    const checkboxes = document.querySelectorAll(".lesson-checkbox");

    checkboxes.forEach(box => {
        const lessonId = Number(box.dataset.id);
        const lessonTitle = document.getElementById(`lessonTitle${lessonId}`);

        if (completedLessons.includes(lessonId)) {
            box.checked = true;
            lessonTitle.classList.add("lesson-completed");
        }
    });
}

function addLessonEvents() {
    const lessons = document.querySelectorAll(".lesson-title");
    lessons.forEach(item => {
        item.addEventListener("click", function () {
            const sectionId = Number(this.dataset.section);

            if (!isSectionUnlocked(sectionId)) {
                alert("Please pass the previous section quiz first.");
                return;
            }
            const lessonId = Number(this.dataset.lesson);
            loadLesson(sectionId, lessonId);
        });
    });
}


function renderQuiz(sectionId, review = false) {
    const section = currentCourse.sections.find(s => s.id === sectionId);
    if (!section) return;
    const container = document.getElementById(`quizContainer${sectionId}`
    );

    let quizHTML = "";
    section.quiz.forEach((question, index) => {
        quizHTML += `
            <div class="card mt-3">
                <div class="card-body">
                    <h6>
                        Q${index + 1}.
                        ${question.question}
                    </h6>
        `;
        question.options.forEach((option, optionIndex) => {
            quizHTML += `
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="radio"
                        name="question${question.id}"
                        value="${optionIndex}"
                        ${review ? "disabled" : ""}>

                    <label
                        class="form-check-label option-label"
                        data-option="${option}">
                    </label>
                </div>
             `;
        });
        quizHTML += `</div></div>`;
    });
    if (!review) {

        quizHTML += `
        <button
            class="btn btn-success mt-3"
            id="submitQuiz${sectionId}">
            Submit Quiz
        </button>
    `;

    }

    container.innerHTML = quizHTML;
    const labels = container.querySelectorAll(".option-label");

    labels.forEach(label => {
        label.textContent = label.dataset.option;
    });
    if (review) {

        section.quiz.forEach(question => {

            const radios =
                document.querySelectorAll(
                    `input[name="question${question.id}"]`
                );

            radios.forEach(radio => {

                if (Number(radio.value) === question.answer) {

                    radio.checked = true;

                    const label =
                        radio.nextElementSibling;

                    label.style.color = "green";
                    label.style.fontWeight = "bold";

                }

            });

        });

    }

    if (!review) {

        const submitBtn =
            document.getElementById(
                `submitQuiz${sectionId}`
            );

        submitBtn.addEventListener("click", () => {
            submitQuiz(sectionId);
        });

    }
}

function addQuizEvents() {
    const buttons = document.querySelectorAll(".take-quiz-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function () {

            const sectionId = Number(this.dataset.section);

            // Nếu đã PASS thì chỉ xem lại đáp án
            if (quizResults[sectionId]) {
                renderQuiz(sectionId, true);
                return;
            }
            const container = document.getElementById(`quizContainer${sectionId}`);

            if (container.innerHTML.trim() !== "") {
                return;
            }

            if (!isSectionUnlocked(sectionId)) {
                alert("This section is still locked.");
                return;
            }

            const section =
                currentCourse.sections.find(
                    s => s.id === sectionId
                );

            const completed =
                section.lessons.every(
                    lesson => completedLessons.includes(lesson.id)
                );

            if (!completed) {
                alert("Please complete all lessons before taking the quiz.");
                return;
            }

            renderQuiz(sectionId);
            this.disabled = true;
            this.innerHTML = "Quiz Opened";

        });
    });
}

function submitQuiz(sectionId) {
    const section = currentCourse.sections.find(s => s.id === sectionId);
    let correct = 0;

    for (const question of section.quiz) {

        const selected = document.querySelector(
            `input[name="question${question.id}"]:checked`
        );

        // Chưa chọn câu này
        if (!selected) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const radios = document.querySelectorAll(
            `input[name="question${question.id}"]`
        );

        radios.forEach(radio => {

            const label = radio.nextElementSibling;

            label.style.color = "";
            label.style.fontWeight = "";

            if (radio.checked) {

                if (Number(radio.value) === question.answer) {
                    label.style.color = "green";
                    label.style.fontWeight = "bold";
                }
                else {
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

function showQuizResult(sectionId, correct) {
    const oldResult = document.getElementById(`quizResult${sectionId}`);
    if (oldResult) {
        oldResult.remove();
    }
    const section = currentCourse.sections.find(s => s.id === sectionId);
    const total = section.quiz.length;
    const percent = correct / total * 100;

    let html = `
    <div id="quizResult${sectionId}">
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
            completedSections.push(sectionId)
            saveCompletedSections();
        }
    }
    else {
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

    html += `</div>`;

    document.getElementById(`quizContainer${sectionId}`).innerHTML += html;

    const retryBtn =
        document.getElementById(
            `retryBtn${sectionId}`
        );

    if (retryBtn) {
        retryBtn.addEventListener("click", function () {

            renderQuiz(sectionId);

            const btn = document.querySelector(
                `.take-quiz-btn[data-section="${sectionId}"]`
            );

            btn.disabled = true;
            btn.innerHTML = "Quiz Opened";

        });
    }


    if (percent >= 70) {

        document.getElementById(`continueBtn${sectionId}`)
            .addEventListener("click", function () {

                renderCurriculum();

                const index =
                    currentCourse.sections.findIndex(
                        s => s.id === sectionId
                    );

                const nextSection =
                    currentCourse.sections[index + 1];

                if (!nextSection) return;

                const next =
                    document.getElementById(
                        `section${nextSection.id}`
                    );

                bootstrap.Collapse
                    .getOrCreateInstance(next)
                    .show();

            });

    }
}

function saveQuizResults() {
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
}

function saveCompletedSections() {
    localStorage.setItem("completedSections", JSON.stringify(completedSections));
}

function isSectionUnlocked(sectionId) {

    const index =
        currentCourse.sections.findIndex(
            section => section.id === sectionId
        );

    // Không tìm thấy
    if (index === -1) {
        return false;
    }

    // Section đầu tiên luôn mở
    if (index === 0) {
        return true;
    }

    // Lấy section trước
    const previousSection =
        currentCourse.sections[index - 1];

    return completedSections.includes(previousSection.id);

}

function restoreQuizResults() {
    Object.keys(quizResults).forEach(id => {
        if (quizResults[id]) {
            const btn = document.querySelector(`.take-quiz-btn[data-section="${id}"]`);
            if (btn) {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-success");
                btn.innerHTML = "Passed";
            }
        }
    });
}

function loadLesson(sectionId, lessonId) {
    currentSection = currentCourse.sections.find(section => section.id === sectionId);
    if (!currentSection) {
        return;
    }
    currentLesson = currentSection.lessons.find(lesson => lesson.id === lessonId);
    if (!currentLesson) {
        return;
    }
    document.getElementById("lessonTitle").textContent = currentLesson.title;
    const video = document.getElementById("lessonVideo");
    video.src = currentLesson.video;
    video.load();
}


function addSectionEvents() {

    const buttons = document.querySelectorAll(".accordion-button");

    buttons.forEach(button => {

        button.addEventListener("click", function (e) {

            const sectionId = Number(this.dataset.section);

            if (isSectionUnlocked(sectionId)) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const index = currentCourse.sections.findIndex(
                s => s.id === sectionId
            );

            const previousSection = currentCourse.sections[index - 1];

            alert(
                `Please complete and pass the quiz of "${previousSection.title}" before opening this section.`
            );

        });

    });

}


loadCurrentCourse();
renderCurriculum();

if (currentCourse?.sections?.[0]?.lessons?.[0]) {
    const firstSection = currentCourse.sections[0];
    const firstLesson = firstSection.lessons[0];
    loadLesson(firstSection.id, firstLesson.id);
}