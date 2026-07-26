/* ============================================================
   admin.js — Admin dashboard, CRUD, filters, localStorage
   Used by admin.html
   ============================================================ */

// The data in admin page is not linked to the main course catalog yet, so any course modification will not affect the course list in index.html

const ADMIN_STORAGE_KEY = "learnhub_admin_courses";
const ADMIN_PAGE_SIZE = 5;
const ADMIN_CATEGORIES = [
    "Web Dev",
    "Design",
    "Data Science",
    "Marketing",
    "Other",
];
const ADMIN_STATUSES = ["Published", "Draft"];

const adminState = {
    activeTab: "courses",
    courses: [],
    searchTerm: "",
    instructorFilter: "All",
    categoryFilter: "All",
    statusFilter: "All",
    sortBy: "default",
    currentPage: 1,
    editingId: null,
    deletingIds: [],
    selectedCourseIds: [],
};

let courseModal = null;
let deleteModal = null;
let adminToast = null;

// Returns a safe copy of the shared hardcoded course data.
function getSeedCourses() {
    return getCourseCatalog().map((course) => normalizeCourse(course));
}

// Adds missing admin fields and coerces values to the expected types.
function normalizeCourse(course) {
    return {
        id: Number(course.id),
        title: String(course.title || "").trim(),
        category: ADMIN_CATEGORIES.includes(course.category)
            ? course.category
            : "Other",
        instructor: String(course.instructor || "").trim(),
        rating: Number(course.rating) || 1,
        reviews: Number(course.reviews) || 0,
        lessons: Number(course.lessons) || 1,
        price: Number(course.price) || 0,
        status: ADMIN_STATUSES.includes(course.status)
            ? course.status
            : "Published",
        thumbClass: course.thumbClass || "thumb-web-dev",
        icon: course.icon || "bi-journal-bookmark-fill",
    };
}

// Loads courses from localStorage or seeds from app.js.
function loadCourses() {
    try {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!raw) {
            const seeded = getSeedCourses();
            saveCourses(seeded);
            return seeded;
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return getSeedCourses();
        }

        return parsed.map((course) => normalizeCourse(course));
    } catch {
        return getSeedCourses();
    }
}

// Saves courses to localStorage.
function saveCourses(courses) {
    localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify(courses.map(normalizeCourse)),
    );
}

// Formats a course price for the admin table.
function formatAdminPrice(price) {
    return Number(price) === 0 ? "FREE" : `$${Number(price)}`;
}

// Escapes user-controlled text before injecting HTML.
function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Returns the next numeric id for a new course.
function getNextCourseId() {
    if (adminState.courses.length === 0) return 1;
    return (
        Math.max(...adminState.courses.map((course) => Number(course.id))) + 1
    );
}

// Returns sorted unique instructor names.
function getInstructorOptions() {
    return Array.from(
        new Set(adminState.courses.map((course) => course.instructor)),
    )
        .filter((name) => name !== "")
        .sort((a, b) => a.localeCompare(b));
}

// Shows a Bootstrap toast with the given message.
function showToast(message) {
    const messageEl = document.getElementById("adminToastMessage");
    if (messageEl) messageEl.textContent = message;
    if (adminToast) adminToast.show();
}

// Restores focus to a text input after a live re-render.
function restoreInputFocus(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const end = input.value.length;
    input.focus();
    input.setSelectionRange(end, end);
}

// Sets the active sidebar tab and re-renders the view.
function setActiveTab(tabName) {
    adminState.activeTab = tabName;
    document.querySelectorAll(".admin-nav-link").forEach((button) => {
        button.classList.toggle("active", button.dataset.adminTab === tabName);
    });
    renderAdminView();
}

// Returns all courses after applying course table filters.
function getFilteredCourses() {
    const term = adminState.searchTerm.trim().toLowerCase();
    const filtered = adminState.courses.filter((course) => {
        const matchesSearch =
            term === "" ||
            course.title.toLowerCase().includes(term) ||
            course.instructor.toLowerCase().includes(term);
        const matchesInstructor =
            adminState.instructorFilter === "All" ||
            course.instructor === adminState.instructorFilter;
        const matchesCategory =
            adminState.categoryFilter === "All" ||
            course.category === adminState.categoryFilter;
        const matchesStatus =
            adminState.statusFilter === "All" ||
            course.status === adminState.statusFilter;

        return (
            matchesSearch &&
            matchesInstructor &&
            matchesCategory &&
            matchesStatus
        );
    });

    switch (adminState.sortBy) {
        case "title-asc":
            return filtered
                .slice()
                .sort((a, b) => a.title.localeCompare(b.title));
        case "instructor-asc":
            return filtered
                .slice()
                .sort((a, b) => a.instructor.localeCompare(b.instructor));
        case "lessons-desc":
            return filtered
                .slice()
                .sort((a, b) => Number(b.lessons) - Number(a.lessons));
        case "rating-desc":
            return filtered
                .slice()
                .sort((a, b) => Number(b.rating) - Number(a.rating));
        default:
            return filtered;
    }
}

// Returns pagination metadata for the current filtered course list.
function getPagination(filteredCourses) {
    const totalPages = Math.max(
        1,
        Math.ceil(filteredCourses.length / ADMIN_PAGE_SIZE),
    );
    const currentPage = Math.min(adminState.currentPage, totalPages);
    const start = (currentPage - 1) * ADMIN_PAGE_SIZE;
    const pageItems = filteredCourses.slice(start, start + ADMIN_PAGE_SIZE);

    adminState.currentPage = currentPage;
    return { totalPages, currentPage, pageItems };
}

// Builds the status badge for a course row.
function buildStatusBadge(status) {
    const badgeClass =
        status === "Published" ? "text-bg-success" : "text-bg-secondary";
    return `<span class="badge ${badgeClass}">${escapeHtml(status)}</span>`;
}

// Builds one course table row.
function buildCourseRow(course, index) {
    const checked = adminState.selectedCourseIds.includes(Number(course.id))
        ? "checked"
        : "";
    return `
        <tr>
            <td>${index}</td>
            <td>
                <input class="form-check-input admin-row-check" type="checkbox" data-select-course="${course.id}" ${checked} aria-label="Select course">
            </td>
            <td>
                <div class="fw-semibold">${escapeHtml(course.title)}</div>
            </td>
            <td>${escapeHtml(course.instructor)}</td>
            <td>${escapeHtml(course.category)}</td>
            <td>${Number(course.lessons)}</td>
            <td>${formatAdminPrice(course.price)}</td>
            <td>${Number(course.rating).toFixed(1)}</td>
            <td>${buildStatusBadge(course.status)}</td>
            <td>
                <div class="admin-action-group">
                    <button class="btn btn-sm btn-outline-primary" type="button" data-edit-course="${course.id}" aria-label="Edit course">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" type="button" data-delete-course="${course.id}" aria-label="Delete course">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Builds pagination buttons for the courses table.
function buildPagination(totalPages, currentPage) {
    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return `
            <button class="btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-primary"}" type="button" data-page="${page}">
                ${page}
            </button>
        `;
    }).join("");

    return `
        <div class="admin-pagination">
            <button class="btn btn-sm btn-outline-primary" type="button" data-page="prev" ${currentPage === 1 ? "disabled" : ""}>
                <i class="bi bi-chevron-left"></i> Prev
            </button>
            ${pageButtons}
            <button class="btn btn-sm btn-outline-primary" type="button" data-page="next" ${currentPage === totalPages ? "disabled" : ""}>
                Next <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    `;
}

// Converts a value into a safe CSV cell.
function toCsvCell(value) {
    const text = String(value).replaceAll('"', '""');
    return `"${text}"`;
}

// Downloads the current filtered and sorted course list as CSV.
function downloadCourseReport() {
    const headers = [
        "#",
        "Title",
        "Instructor",
        "Category",
        "Lessons",
        "Price",
        "Rating",
        "Status",
    ];
    const rows = getFilteredCourses().map((course, index) => [
        index + 1,
        course.title,
        course.instructor,
        course.category,
        course.lessons,
        Number(course.price),
        Number(course.rating).toFixed(1),
        course.status,
    ]);
    const csv = [headers, ...rows]
        .map((row) => row.map(toCsvCell).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "learnhub-course-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Report downloaded.");
}

// Adds or removes a course id from the selected list.
function toggleCourseSelection(courseId, checked) {
    const id = Number(courseId);
    if (checked && !adminState.selectedCourseIds.includes(id)) {
        adminState.selectedCourseIds.push(id);
    }

    if (!checked) {
        adminState.selectedCourseIds = adminState.selectedCourseIds.filter(
            (selectedId) => selectedId !== id,
        );
    }

    renderAdminView();
}

// Selects or clears all courses visible on the current page.
function toggleCurrentPageSelection(checked) {
    const { pageItems } = getPagination(getFilteredCourses());
    const pageIds = pageItems.map((course) => Number(course.id));

    if (checked) {
        adminState.selectedCourseIds = Array.from(
            new Set([...adminState.selectedCourseIds, ...pageIds]),
        );
    } else {
        adminState.selectedCourseIds = adminState.selectedCourseIds.filter(
            (id) => !pageIds.includes(id),
        );
    }

    renderAdminView();
}

// Keeps selected ids aligned with existing courses.
function pruneSelectedCourses() {
    const existingIds = adminState.courses.map((course) => Number(course.id));
    adminState.selectedCourseIds = adminState.selectedCourseIds.filter((id) =>
        existingIds.includes(id),
    );
}

// Renders a placeholder for unfinished admin sections.
function renderDevelopmentView(title) {
    return `
        <div class="admin-section-header">
            <div>
                <p class="admin-eyebrow">LearnHub Admin</p>
                <h1>${escapeHtml(title)}</h1>
            </div>
        </div>
        <div class="admin-dev-panel">
            <i class="bi bi-tools"></i>
            <p>Tính năng đang trong quá trình phát triển</p>
        </div>
    `;
}

// Renders the courses management tab.
function renderCoursesView() {
    const filteredCourses = getFilteredCourses();
    const { totalPages, currentPage, pageItems } =
        getPagination(filteredCourses);
    const startIndex = (currentPage - 1) * ADMIN_PAGE_SIZE;
    const instructorOptions = getInstructorOptions();
    const allPageSelected =
        pageItems.length > 0 &&
        pageItems.every((course) =>
            adminState.selectedCourseIds.includes(Number(course.id)),
        );
    const rows = pageItems.length
        ? pageItems
              .map((course, index) =>
                  buildCourseRow(course, startIndex + index + 1),
              )
              .join("")
        : `<tr><td colspan="10" class="text-center text-muted py-4">No results</td></tr>`;

    return `
        <div class="admin-section-header">
            <div>
                <p class="admin-eyebrow">Catalogue</p>
                <h1>Courses Management</h1>
            </div>
            <div class="admin-header-actions">
                <button class="btn btn-outline-danger" type="button" id="deleteSelectedBtn" ${adminState.selectedCourseIds.length === 0 ? "disabled" : ""}>
                    <i class="bi bi-trash-fill"></i> Delete Selected (${adminState.selectedCourseIds.length})
                </button>
                <button class="btn btn-outline-success" type="button" id="downloadReportBtn">
                    <i class="bi bi-download"></i> Download Report
                </button>
                <button class="btn btn-primary" type="button" id="addCourseBtn">
                    <i class="bi bi-plus-circle"></i> Add New Course
                </button>
            </div>
        </div>
        <div class="admin-panel">
            <div class="admin-toolbar">
                <div class="admin-search">
                    <i class="bi bi-search"></i>
                    <input class="form-control" id="adminSearchInput" type="search" placeholder="Search courses or instructors..." value="${escapeHtml(adminState.searchTerm)}" />
                </div>
                <select class="form-select" id="adminInstructorFilter" aria-label="Filter by instructor">
                    <option value="All">All Instructors</option>
                    ${instructorOptions
                        .map(
                            (instructor) => `
                        <option value="${escapeHtml(instructor)}" ${adminState.instructorFilter === instructor ? "selected" : ""}>${escapeHtml(instructor)}</option>
                    `,
                        )
                        .join("")}
                </select>
                <select class="form-select" id="adminCategoryFilter" aria-label="Filter by category">
                    <option value="All">All Categories</option>
                    ${ADMIN_CATEGORIES.map(
                        (category) => `
                        <option value="${category}" ${adminState.categoryFilter === category ? "selected" : ""}>${category}</option>
                    `,
                    ).join("")}
                </select>
                <select class="form-select" id="adminStatusFilter" aria-label="Filter by status">
                    <option value="All">All Statuses</option>
                    ${ADMIN_STATUSES.map(
                        (status) => `
                        <option value="${status}" ${adminState.statusFilter === status ? "selected" : ""}>${status}</option>
                    `,
                    ).join("")}
                </select>
                <select class="form-select" id="adminSortSelect" aria-label="Sort courses">
                    <option value="default">Sort: Default</option>
                    <option value="title-asc" ${adminState.sortBy === "title-asc" ? "selected" : ""}>Title A-Z</option>
                    <option value="instructor-asc" ${adminState.sortBy === "instructor-asc" ? "selected" : ""}>Instructor A-Z</option>
                    <option value="lessons-desc" ${adminState.sortBy === "lessons-desc" ? "selected" : ""}>Lessons High-Low</option>
                    <option value="rating-desc" ${adminState.sortBy === "rating-desc" ? "selected" : ""}>Rating High-Low</option>
                </select>
            </div>
            <div class="table-responsive">
                <table class="table admin-table align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <input class="form-check-input" id="selectPageCourses" type="checkbox" ${allPageSelected ? "checked" : ""} aria-label="Select all visible courses">
                            </th>
                            <th>Title</th>
                            <th>Instructor</th>
                            <th>Category</th>
                            <th>Lessons</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="admin-table-footer">
                <span>${filteredCourses.length} result${filteredCourses.length !== 1 ? "s" : ""}</span>
                ${buildPagination(totalPages, currentPage)}
            </div>
        </div>
    `;
}

// Renders the currently active admin tab.
function renderAdminView() {
    const view = document.getElementById("adminView");
    if (!view) return;

    const renderMap = {
        dashboard: () => renderDevelopmentView("Dashboard"),
        courses: renderCoursesView,
        instructors: () => renderDevelopmentView("Instructors"),
        reports: () => renderDevelopmentView("Reports"),
    };

    view.innerHTML = renderMap[adminState.activeTab]();
    bindCurrentViewEvents();
}

// Opens the create course modal with a blank form.
function openCreateModal() {
    adminState.editingId = null;
    const form = document.getElementById("courseForm");
    const title = document.getElementById("courseModalTitle");
    if (form) {
        form.reset();
        form.classList.remove("was-validated");
    }
    if (title) title.textContent = "Add New Course";
    document.getElementById("courseStatus").value = "Published";
    courseModal.show();
}

// Opens the edit course modal with existing values.
function openEditModal(courseId) {
    const course = adminState.courses.find(
        (item) => Number(item.id) === Number(courseId),
    );
    if (!course) return;

    adminState.editingId = Number(course.id);
    document.getElementById("courseModalTitle").textContent = "Edit Course";
    document.getElementById("courseId").value = course.id;
    document.getElementById("courseTitle").value = course.title;
    document.getElementById("courseCategory").value = course.category;
    document.getElementById("courseInstructor").value = course.instructor;
    document.getElementById("courseLessons").value = course.lessons;
    document.getElementById("coursePrice").value = course.price;
    document.getElementById("courseRating").value = course.rating;
    document.getElementById("courseStatus").value = course.status;
    document.getElementById("courseForm").classList.remove("was-validated");
    courseModal.show();
}

// Opens the delete confirmation modal for a course.
function openDeleteModal(courseId) {
    const course = adminState.courses.find(
        (item) => Number(item.id) === Number(courseId),
    );
    if (!course) return;

    adminState.deletingIds = [Number(course.id)];
    document.getElementById("deleteModalTitle").textContent = "Delete Course";
    document.getElementById("deleteCourseTitle").textContent = course.title;

    if (adminState.editingId === Number(course.id) && courseModal) {
        courseModal.hide();
    }

    deleteModal.show();
}

// Opens the delete confirmation modal for selected courses.
function openBulkDeleteModal() {
    if (adminState.selectedCourseIds.length === 0) return;

    adminState.deletingIds = adminState.selectedCourseIds.slice();
    document.getElementById("deleteModalTitle").textContent =
        "Delete Selected Courses";
    document.getElementById("deleteCourseTitle").textContent =
        `${adminState.deletingIds.length} selected courses`;

    if (
        adminState.deletingIds.includes(Number(adminState.editingId)) &&
        courseModal
    ) {
        courseModal.hide();
    }

    deleteModal.show();
}

// Reads and validates course form data.
function getCourseFormData() {
    return {
        title: document.getElementById("courseTitle").value.trim(),
        category: document.getElementById("courseCategory").value,
        instructor: document.getElementById("courseInstructor").value.trim(),
        lessons: Number(document.getElementById("courseLessons").value),
        price: Number(document.getElementById("coursePrice").value),
        rating: Number(document.getElementById("courseRating").value),
        status: document.getElementById("courseStatus").value,
    };
}

// Returns true when form data passes assignment validation rules.
function isValidCourseData(data) {
    return (
        data.title.length >= 5 &&
        ADMIN_CATEGORIES.includes(data.category) &&
        data.instructor.length > 0 &&
        Number.isInteger(data.lessons) &&
        data.lessons >= 1 &&
        data.lessons <= 100 &&
        data.price >= 0 &&
        data.rating >= 1 &&
        data.rating <= 5 &&
        ADMIN_STATUSES.includes(data.status)
    );
}

// Chooses a visual thumbnail style for the course category.
function getCourseVisuals(category) {
    const visualMap = {
        "Web Dev": { thumbClass: "thumb-web-dev", icon: "bi-code-slash" },
        Design: { thumbClass: "thumb-design", icon: "bi-palette" },
        "Data Science": {
            thumbClass: "thumb-data-science",
            icon: "bi-bar-chart-line",
        },
        Marketing: { thumbClass: "thumb-marketing", icon: "bi-megaphone" },
        Other: {
            thumbClass: "thumb-web-dev",
            icon: "bi-journal-bookmark-fill",
        },
    };
    return visualMap[category] || visualMap.Other;
}

// Creates a new course from form data.
function createCourse(data) {
    const visuals = getCourseVisuals(data.category);
    adminState.courses.push(
        normalizeCourse({
            ...data,
            ...visuals,
            id: getNextCourseId(),
            reviews: 0,
        }),
    );
    saveCourses(adminState.courses);
    adminState.currentPage =
        Math.ceil(getFilteredCourses().length / ADMIN_PAGE_SIZE) || 1;
    renderAdminView();
    showToast("Course created.");
}

// Updates an existing course from form data.
function updateCourse(data) {
    adminState.courses = adminState.courses.map((course) => {
        if (Number(course.id) !== Number(adminState.editingId)) return course;
        const visuals = getCourseVisuals(data.category);
        return normalizeCourse({
            ...course,
            ...data,
            ...visuals,
        });
    });
    saveCourses(adminState.courses);
    renderAdminView();
    showToast("Course updated.");
}

// Handles the course create/edit form submission.
function handleCourseFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = getCourseFormData();

    if (!form.checkValidity() || !isValidCourseData(data)) {
        form.classList.add("was-validated");
        return;
    }

    if (adminState.editingId) {
        updateCourse(data);
    } else {
        createCourse(data);
    }

    courseModal.hide();
    adminState.editingId = null;
    form.classList.remove("was-validated");
}

// Deletes the selected course and updates localStorage.
function confirmDeleteCourse() {
    if (adminState.deletingIds.length === 0) return;

    const deletedCount = adminState.deletingIds.length;
    adminState.courses = adminState.courses.filter((course) => {
        return !adminState.deletingIds.includes(Number(course.id));
    });
    pruneSelectedCourses();
    saveCourses(adminState.courses);
    adminState.deletingIds = [];
    deleteModal.hide();
    renderAdminView();
    showToast(
        deletedCount === 1 ? "Course deleted." : "Selected courses deleted.",
    );
}

// Binds events for the sidebar navigation.
function bindSidebarEvents() {
    document.querySelectorAll(".admin-nav-link").forEach((button) => {
        button.addEventListener("click", () =>
            setActiveTab(button.dataset.adminTab),
        );
    });
}

// Binds events that are present in the courses tab.
function bindCoursesEvents() {
    const searchInput = document.getElementById("adminSearchInput");
    const instructorFilter = document.getElementById("adminInstructorFilter");
    const categoryFilter = document.getElementById("adminCategoryFilter");
    const statusFilter = document.getElementById("adminStatusFilter");
    const sortSelect = document.getElementById("adminSortSelect");
    const addCourseBtn = document.getElementById("addCourseBtn");
    const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
    const downloadReportBtn = document.getElementById("downloadReportBtn");
    const selectPageCourses = document.getElementById("selectPageCourses");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            adminState.searchTerm = searchInput.value;
            adminState.currentPage = 1;
            renderAdminView();
            restoreInputFocus("adminSearchInput");
        });
    }

    if (instructorFilter) {
        instructorFilter.addEventListener("change", () => {
            adminState.instructorFilter = instructorFilter.value;
            adminState.currentPage = 1;
            renderAdminView();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            adminState.categoryFilter = categoryFilter.value;
            adminState.currentPage = 1;
            renderAdminView();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", () => {
            adminState.statusFilter = statusFilter.value;
            adminState.currentPage = 1;
            renderAdminView();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            adminState.sortBy = sortSelect.value;
            adminState.currentPage = 1;
            renderAdminView();
        });
    }

    if (addCourseBtn) {
        addCourseBtn.addEventListener("click", openCreateModal);
    }

    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener("click", openBulkDeleteModal);
    }

    if (downloadReportBtn) {
        downloadReportBtn.addEventListener("click", downloadCourseReport);
    }

    if (selectPageCourses) {
        selectPageCourses.addEventListener("change", () => {
            toggleCurrentPageSelection(selectPageCourses.checked);
        });
    }

    document.querySelectorAll("[data-edit-course]").forEach((button) => {
        button.addEventListener("click", () =>
            openEditModal(button.dataset.editCourse),
        );
    });

    document.querySelectorAll("[data-delete-course]").forEach((button) => {
        button.addEventListener("click", () =>
            openDeleteModal(button.dataset.deleteCourse),
        );
    });

    document.querySelectorAll("[data-select-course]").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            toggleCourseSelection(
                checkbox.dataset.selectCourse,
                checkbox.checked,
            );
        });
    });

    document.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", () => changePage(button.dataset.page));
    });
}

// Changes the current courses table page.
function changePage(pageValue) {
    const filteredCourses = getFilteredCourses();
    const totalPages = Math.max(
        1,
        Math.ceil(filteredCourses.length / ADMIN_PAGE_SIZE),
    );

    if (pageValue === "prev") {
        adminState.currentPage = Math.max(1, adminState.currentPage - 1);
    } else if (pageValue === "next") {
        adminState.currentPage = Math.min(
            totalPages,
            adminState.currentPage + 1,
        );
    } else {
        adminState.currentPage = Number(pageValue);
    }

    renderAdminView();
}

// Binds event listeners for whatever tab is currently rendered.
function bindCurrentViewEvents() {
    if (adminState.activeTab === "courses") {
        bindCoursesEvents();
    }
}

// Initializes Bootstrap components used by the admin page.
function initAdminComponents() {
    courseModal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("courseModal"),
    );
    deleteModal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("deleteModal"),
    );
    adminToast = bootstrap.Toast.getOrCreateInstance(
        document.getElementById("adminToast"),
    );
}

const currentAdminUser =
    typeof getLoggedInUser === "function" ? getLoggedInUser() : null;

if (!currentAdminUser) {
    window.location.replace("login.html");
} else {
    // Entry point for the admin page.
    document.addEventListener("DOMContentLoaded", () => {
        adminState.courses = loadCourses();
        saveCourses(adminState.courses);
        initAdminComponents();
        bindSidebarEvents();
        document
            .getElementById("courseForm")
            .addEventListener("submit", handleCourseFormSubmit);
        document
            .getElementById("confirmDeleteBtn")
            .addEventListener("click", confirmDeleteCourse);
        renderAdminView();
    });
}
