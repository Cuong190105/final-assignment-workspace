/* ============================================================
   app.js — Shared data & utility functions
   Used by index.html (Course Listing + Search/Filter/Sort)
   ============================================================ */

// Hardcoded user credentials
const USERS = [
    {
        id: 1,
        fullname: "Admin One",
        username: "admin1",
        password: "adminpass1",
        role: "admin",
    },
    {
        id: 2,
        fullname: "Student One",
        username: "student1",
        password: "password1",
        role: "student",
    },
    {
        id: 3,
        fullname: "Student Two",
        username: "student2",
        password: "password2",
        role: "student",
    },
    {
        id: 4,
        fullname: "Student Three",
        username: "student3",
        password: "password3",
        role: "student",
    },
];

// Hardcoded course catalogue — at least 6 courses across 3+ categories
const COURSES = [
    {
        id: 1,
        title: "HTML & CSS Fundamentals",
        category: "Web Dev",
        instructor: "Nguyen Van A",
        rating: 4.8,
        reviews: 120,
        lessons: 12,
        price: 0,
        thumbClass: "thumb-web-dev",
        icon: "bi-code-slash",
    },
    {
        id: 2,
        title: "Modern JavaScript (ES6+)",
        category: "Web Dev",
        instructor: "Tran Thi B",
        rating: 4.9,
        reviews: 240,
        lessons: 20,
        price: 89,
        thumbClass: "thumb-web-dev",
        icon: "bi-braces",
    },
    {
        id: 3,
        title: "UI/UX Design Principles",
        category: "Design",
        instructor: "Le Van C",
        rating: 4.5,
        reviews: 89,
        lessons: 8,
        price: 49,
        thumbClass: "thumb-design",
        icon: "bi-palette",
    },
    {
        id: 4,
        title: "Figma for Beginners",
        category: "Design",
        instructor: "Pham Thi D",
        rating: 4.6,
        reviews: 156,
        lessons: 10,
        price: 39,
        thumbClass: "thumb-design",
        icon: "bi-vector-pen",
    },
    {
        id: 5,
        title: "Python for Data Science",
        category: "Data Science",
        instructor: "Hoang Van E",
        rating: 4.9,
        reviews: 310,
        lessons: 24,
        price: 99,
        thumbClass: "thumb-data-science",
        icon: "bi-bar-chart-line",
    },
    {
        id: 6,
        title: "Data Visualization with Charts",
        category: "Data Science",
        instructor: "Vu Thi F",
        rating: 4.4,
        reviews: 74,
        lessons: 14,
        price: 59,
        thumbClass: "thumb-data-science",
        icon: "bi-graph-up",
    },
    {
        id: 7,
        title: "Digital Marketing Essentials",
        category: "Marketing",
        instructor: "Do Van G",
        rating: 4.3,
        reviews: 63,
        lessons: 9,
        price: 0,
        thumbClass: "thumb-marketing",
        icon: "bi-megaphone",
    },
    {
        id: 8,
        title: "SEO & Content Strategy",
        category: "Marketing",
        instructor: "Bui Thi H",
        rating: 4.7,
        reviews: 132,
        lessons: 16,
        price: 69,
        thumbClass: "thumb-marketing",
        icon: "bi-search",
    },
];

const COURSE_DETAILS = {
    1: {
        students: 1200,
        bannerClass: "detail-banner-web",
        sidebarClass: "detail-banner-web",
        learn: [
            "Build semantic web pages with HTML5",
            "Style responsive layouts with modern CSS",
            "Use Flexbox and Grid confidently",
            "Create clean, accessible interfaces",
        ],
        description1:
            "This course gives you a practical foundation in HTML and CSS. You will learn how to structure pages, style them properly, and build layouts that work across desktop, tablet, and mobile screens.",
        description2:
            "The lessons are designed for beginners and focus on real examples. By the end, you will be able to create responsive landing pages and simple website layouts from scratch.",
        sections: [
            {
                title: "Section 1 — HTML Basics",
                id: 1,
                lessons: [
                    { id: "c1-s1-l1", title: "Introduction to HTML" },
                    { id: "c1-s1-l2", title: "Text, Links, and Images" },
                    { id: "c1-s1-l3", title: "Lists and Tables" },
                ],
                quiz: [
                    {
                        question: "What does HTML stand for?",
                        options: [
                            "HyperText Markup Language",
                            "HighText Machine Language",
                            "Hyperlink Text Markup Language",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Which tag defines a paragraph?",
                        options: ["<para>", "<p>", "<pg>"],
                        answer: 1,
                    },
                    {
                        question: "Which tag is used for the largest heading?",
                        options: ["<h6>", "<heading>", "<h1>"],
                        answer: 2,
                    },
                ],
            },
            {
                title: "Section 2 — CSS Basics",
                id: 2,
                lessons: [
                    { id: "c1-s2-l1", title: "Selectors and Properties" },
                    { id: "c1-s2-l2", title: "Box Model" },
                    { id: "c1-s2-l3", title: "Colors and Typography" },
                    { id: "c1-s2-l4", title: "Layouts with Flexbox" },
                ],
                quiz: [
                    {
                        question: "Which property changes text color?",
                        options: ["font-style", "color", "text-align"],
                        answer: 1,
                    },
                    {
                        question: "Which is part of the CSS box model?",
                        options: ["Margin", "Route", "Header"],
                        answer: 0,
                    },
                    {
                        question: "Flexbox is mainly used for...",
                        options: [
                            "2D layout alignment",
                            "Database storage",
                            "Image compression",
                        ],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    2: {
        students: 980,
        bannerClass: "detail-banner-js",
        sidebarClass: "detail-banner-js",
        learn: [
            "Use modern JavaScript syntax",
            "Work with arrays and objects",
            "Handle events with addEventListener",
            "Build interactive UI components",
        ],
        description1:
            "This course covers essential JavaScript concepts for building interactive web pages. You will practice DOM manipulation, event handling, and data-driven rendering.",
        description2:
            "It is a hands-on course with small projects and examples. By the end you will be able to write reusable JavaScript for real web interfaces.",
        sections: [
            {
                title: "Section 1 — JavaScript Fundamentals",
                id: 1,
                lessons: [
                    { id: "c2-s1-l1", title: "Variables and Data Types" },
                    { id: "c2-s1-l2", title: "Functions and Scope" },
                    { id: "c2-s1-l3", title: "Arrays and Loops" },
                ],
                quiz: [
                    {
                        question:
                            "Which keyword declares a block-scoped variable?",
                        options: ["var", "let", "int"],
                        answer: 1,
                    },
                    {
                        question: "What does DOM stand for?",
                        options: [
                            "Document Object Model",
                            "Data Object Map",
                            "Digital Output Method",
                        ],
                        answer: 0,
                    },
                    {
                        question:
                            "Which method adds a new item to the end of an array?",
                        options: ["push()", "pop()", "shift()"],
                        answer: 0,
                    },
                ],
            },
            {
                title: "Section 2 — Interactive Pages",
                id: 2,
                lessons: [
                    { id: "c2-s2-l1", title: "Event Handling" },
                    { id: "c2-s2-l2", title: "DOM Updates" },
                    { id: "c2-s2-l3", title: "Form Validation" },
                    { id: "c2-s2-l4", title: "Local Storage" },
                ],
                quiz: [
                    {
                        question:
                            "Which event is triggered when typing in an input field?",
                        options: ["click", "input", "submit"],
                        answer: 1,
                    },
                    {
                        question: "Which API stores data in the browser?",
                        options: [
                            "localStorage",
                            "sessionPrint",
                            "browserCache",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Which method attaches an event listener?",
                        options: [
                            "addEventListener()",
                            "attachEvent()",
                            "bindClick()",
                        ],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    3: {
        students: 450,
        bannerClass: "detail-banner-design",
        sidebarClass: "detail-banner-design",
        learn: [
            "Understand UI/UX principles",
            "Create user-friendly layouts",
            "Apply visual hierarchy correctly",
            "Design consistent interfaces",
        ],
        description1:
            "This course introduces the basics of UI/UX design with a focus on clarity, spacing, and usability.",
        description2:
            "You will learn how to think about user needs and build layouts that feel simple and polished.",
        sections: [
            {
                title: "Section 1 — Design Foundations",
                id: 1,
                lessons: [
                    { id: "c3-s1-l1", title: "UI vs UX" },
                    { id: "c3-s1-l2", title: "Typography Basics" },
                    { id: "c3-s1-l3", title: "Color Theory" },
                ],
                quiz: [
                    {
                        question: "UI stands for...",
                        options: [
                            "User Interface",
                            "Unified Input",
                            "Unique Idea",
                        ],
                        answer: 0,
                    },
                    {
                        question: "A good layout should be...",
                        options: [
                            "Confusing",
                            "Clear and consistent",
                            "Random",
                        ],
                        answer: 1,
                    },
                    {
                        question: "Visual hierarchy helps users...",
                        options: [
                            "Find important content",
                            "Delete elements",
                            "Change file names",
                        ],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    4: {
        students: 520,
        bannerClass: "detail-banner-design",
        sidebarClass: "detail-banner-design",
        learn: [
            "Design interfaces in Figma",
            "Build reusable components",
            "Work with layers and frames",
            "Export assets efficiently",
        ],
        description1:
            "Learn the essentials of Figma and build practical design skills for real projects.",
        description2:
            "The course guides you through interface design workflows, from sketching ideas to exporting assets.",
        sections: [
            {
                title: "Section 1 — Figma Workflow",
                id: 1,
                lessons: [
                    { id: "c4-s1-l1", title: "Getting Started with Figma" },
                    { id: "c4-s1-l2", title: "Frames and Shapes" },
                    { id: "c4-s1-l3", title: "Auto Layout Basics" },
                ],
                quiz: [
                    {
                        question: "Figma is mainly used for...",
                        options: [
                            "Designing interfaces",
                            "Running databases",
                            "Writing server code",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Auto layout helps with...",
                        options: [
                            "Responsive spacing",
                            "Audio editing",
                            "File compression",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Frames are used to...",
                        options: [
                            "Organize designs",
                            "Host websites",
                            "Store passwords",
                        ],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    5: {
        students: 1500,
        bannerClass: "detail-banner-data",
        sidebarClass: "detail-banner-data",
        learn: [
            "Analyze data with Python",
            "Use Pandas for cleaning data",
            "Create charts and plots",
            "Work with datasets confidently",
        ],
        description1:
            "This course builds your data science foundation using Python and common data tools.",
        description2:
            "You will learn how to clean, explore, and visualize data in a structured way.",
        sections: [
            {
                title: "Section 1 — Python for Data",
                id: 1,
                lessons: [
                    { id: "c5-s1-l1", title: "Python Refresher" },
                    { id: "c5-s1-l2", title: "NumPy Basics" },
                    { id: "c5-s1-l3", title: "Pandas Introduction" },
                ],
                quiz: [
                    {
                        question: "Pandas is used for...",
                        options: [
                            "Data analysis",
                            "Web hosting",
                            "Game rendering",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Which library is common for plotting?",
                        options: ["Matplotlib", "Bootstrap", "Express"],
                        answer: 0,
                    },
                    {
                        question: "A dataset is a collection of...",
                        options: ["Data records", "Passwords", "Icons"],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    6: {
        students: 870,
        bannerClass: "detail-banner-data",
        sidebarClass: "detail-banner-data",
        learn: [
            "Create useful dashboards",
            "Choose the right chart type",
            "Present data clearly",
            "Explain trends with visuals",
        ],
        description1:
            "This course helps you turn raw data into clear charts and dashboards.",
        description2:
            "You will practice selecting visuals that communicate information quickly and accurately.",
        sections: [
            {
                title: "Section 1 — Chart Fundamentals",
                id: 1,
                lessons: [
                    { id: "c6-s1-l1", title: "Choosing Chart Types" },
                    { id: "c6-s1-l2", title: "Bar and Line Charts" },
                    { id: "c6-s1-l3", title: "Dashboard Layouts" },
                ],
                quiz: [
                    {
                        question: "Bar charts are good for...",
                        options: [
                            "Comparing values",
                            "Editing photos",
                            "Writing code",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Line charts often show...",
                        options: [
                            "Trends over time",
                            "Menu items",
                            "Login forms",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Good data visualization should be...",
                        options: ["Clear", "Overloaded", "Hidden"],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    7: {
        students: 300,
        bannerClass: "detail-banner-marketing",
        sidebarClass: "detail-banner-marketing",
        learn: [
            "Understand digital marketing basics",
            "Plan campaigns clearly",
            "Use content strategy effectively",
            "Measure simple performance metrics",
        ],
        description1:
            "This course introduces essential digital marketing concepts for beginners.",
        description2:
            "You will learn how to plan, publish, and evaluate marketing content in a simple way.",
        sections: [
            {
                title: "Section 1 — Marketing Basics",
                id: 1,
                lessons: [
                    { id: "c7-s1-l1", title: "Introduction to Marketing" },
                    { id: "c7-s1-l2", title: "Content Strategy" },
                    { id: "c7-s1-l3", title: "Campaign Planning" },
                ],
                quiz: [
                    {
                        question: "Marketing is about...",
                        options: [
                            "Promoting value",
                            "Cleaning files",
                            "Fixing monitors",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Content strategy focuses on...",
                        options: [
                            "Planning content",
                            "Buying keyboards",
                            "Changing passwords",
                        ],
                        answer: 0,
                    },
                    {
                        question: "A campaign should have...",
                        options: [
                            "Clear goals",
                            "No audience",
                            "Random timing",
                        ],
                        answer: 0,
                    },
                ],
            },
        ],
    },
    8: {
        students: 610,
        bannerClass: "detail-banner-marketing",
        sidebarClass: "detail-banner-marketing",
        learn: [
            "Improve search visibility",
            "Create useful content",
            "Understand keyword basics",
            "Track simple SEO results",
        ],
        description1:
            "Learn the basics of SEO and how content strategy supports better visibility.",
        description2:
            "This course is practical and focused on simple steps you can apply to real projects.",
        sections: [
            {
                title: "Section 1 — SEO Fundamentals",
                id: 1,
                lessons: [
                    { id: "c8-s1-l1", title: "How Search Works" },
                    { id: "c8-s1-l2", title: "Keywords and Content" },
                    { id: "c8-s1-l3", title: "Measuring SEO" },
                ],
                quiz: [
                    {
                        question: "SEO helps improve...",
                        options: [
                            "Search visibility",
                            "Monitor brightness",
                            "File size",
                        ],
                        answer: 0,
                    },
                    {
                        question: "Keywords help search engines...",
                        options: [
                            "Understand content",
                            "Delete pages",
                            "Format tables",
                        ],
                        answer: 0,
                    },
                    {
                        question: "SEO results are often measured with...",
                        options: ["Analytics", "Paint", "USB"],
                        answer: 0,
                    },
                ],
            },
        ],
    },
};

const COURSE_DATA_STORAGE_KEY = "learnhub_course_data";

// Add COURSES and COURSE_DETAILS to localStorage for default data
function saveCourseData() {
    localStorage.setItem(
        COURSE_DATA_STORAGE_KEY,
        JSON.stringify({ courses: COURSES, details: COURSE_DETAILS }),
    );
}

// Load course data from localStorage, or return default if not present
function loadCourseData() {
    try {
        const raw = localStorage.getItem(COURSE_DATA_STORAGE_KEY);

        if (!raw) {
            return { courses: COURSES, details: COURSE_DETAILS };
        }

        const parsed = JSON.parse(raw);

        if (!parsed || typeof parsed !== "object") {
            return { courses: COURSES, details: COURSE_DETAILS };
        }

        return {
            courses: Array.isArray(parsed.courses) ? parsed.courses : COURSES,
            details:
                parsed.details && typeof parsed.details === "object"
                    ? parsed.details
                    : COURSE_DETAILS,
        };
    } catch {
        return { courses: COURSES, details: COURSE_DETAILS };
    }
}

// Returns the full course catalogue
function getCourseCatalog() {
    return loadCourseData().courses;
}

// Returns a single course object by ID, or undefined if not found
function getCourseById(id) {
    return getCourseCatalog().find(
        (course) => String(course.id) === String(id),
    );
}

// Returns the detailed course info object by ID, or null if not found
function getCourseDetail(id) {
    const details = loadCourseData().details;
    return details[String(id)] || details[Number(id)] || null;
}

// Current UI state for filtering/sorting the course grid
const state = {
    searchTerm: "",
    activeCategory: "All",
    sortBy: "default",
};

// Returns the currently logged-in user object from localStorage, or null if not logged in
function getLoggedInUser() {
    const rawUser = localStorage.getItem("loggedInUser");

    if (!rawUser) {
        return null;
    }

    try {
        const parsedUser = JSON.parse(rawUser);

        return parsedUser && typeof parsedUser === "object" ? parsedUser : null;
    } catch {
        return null;
    }
}

// Log out current user by clearing the localStorage entry
function clearLoggedInUser() {
    localStorage.removeItem("loggedInUser");
}

// Formats a numeric price into a display string ("FREE" or "$49")
function formatPrice(price) {
    return price === 0 ? "FREE" : `$${price}`;
}

// Builds the HTML markup for a single course card
function buildCourseCard(course) {
    return `
    <div class="col-lg-4 col-md-6 col-12 course-col" data-id="${course.id}">
      <div class="course-card">
        <div class="course-image thumb-placeholder ${course.thumbClass}">
          <i class="bi ${course.icon}"></i>
        </div>
        <div class="course-body">
          <span class="badge-category">${course.category}</span>
          <h3 class="course-title">${course.title}</h3>
          <div class="course-meta">
            <i class="bi bi-star-fill course-rating"></i>
            <span>${course.rating.toFixed(1)} (${course.reviews})</span>
          </div>
          <div class="course-meta">
            <i class="bi bi-person-fill"></i>
            <span>${course.instructor}</span>
          </div>
          <div class="course-meta">
            <i class="bi bi-journal-bookmark-fill"></i>
            <span>${course.lessons} lessons</span>
          </div>
          <div class="course-footer">
            <span class="course-price">${formatPrice(course.price)}</span>
            <a href="course-detail.html?id=${course.id}" class="btn-custom btn-primary-custom">Enroll</a>
          </div>
        </div>
      </div>
    </div>`;
}

// Applies search + category filters, then the chosen sort order, to COURSES
function getFilteredCourses() {
    let list = getCourseCatalog().filter((course) => {
        const matchesCategory =
            state.activeCategory === "All" ||
            course.category === state.activeCategory;

        const term = state.searchTerm.trim().toLowerCase();
        const matchesSearch =
            term === "" ||
            course.title.toLowerCase().includes(term) ||
            course.instructor.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
    });

    switch (state.sortBy) {
        case "price-asc":
            list = list.slice().sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            list = list.slice().sort((a, b) => b.price - a.price);
            break;
        case "rating-desc":
            list = list.slice().sort((a, b) => b.rating - a.rating);
            break;
        default:
            // "default" keeps original catalogue order
            break;
    }

    return list;
}

// Re-renders the course grid based on current filter/sort state
function renderCourses() {
    const grid = document.getElementById("courseGrid");
    const noCourses = document.getElementById("noCourses");
    const resultsCount = document.getElementById("resultsCount");

    const filtered = getFilteredCourses();

    grid.innerHTML = filtered.map(buildCourseCard).join("");
    resultsCount.textContent = `${filtered.length} course${filtered.length !== 1 ? "s" : ""} found`;

    noCourses.classList.toggle("show", filtered.length === 0);
}

// Updates the active state (visual highlight) on category tab buttons
function setActiveTab(category) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === category);
    });
}

// Wires up the search input: live filter + clear (x) button behaviour
function initSearch() {
    const input = document.getElementById("searchInput");
    const wrapper = document.getElementById("searchWrapper");
    const clearBtn = document.getElementById("searchClear");

    input.addEventListener("input", () => {
        state.searchTerm = input.value;
        wrapper.classList.toggle("has-text", input.value.length > 0);
        renderCourses();
    });

    clearBtn.addEventListener("click", () => {
        input.value = "";
        state.searchTerm = "";
        wrapper.classList.remove("has-text");
        renderCourses();
        input.focus();
    });
}

// Wires up the category tab buttons to filter the grid on click
function initCategoryTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            state.activeCategory = btn.dataset.category;
            setActiveTab(state.activeCategory);
            renderCourses();
        });
    });
}

// Wires up the sort dropdown to re-order the grid on change
function initSort() {
    const select = document.getElementById("sortSelect");
    select.addEventListener("change", () => {
        state.sortBy = select.value;
        renderCourses();
    });
}

// Change login button to user info + logout if logged in
function renderAuthNav() {
    const authNav = document.querySelector("[data-auth-nav]");
    const navBar = document.querySelector(".navbar-nav");

    if (!authNav) {
        return;
    }

    const user = getLoggedInUser();
    authNav.innerHTML = "";

    if (!user) {
        const loginLink = document.createElement("a");
        loginLink.className = "btn-custom btn-primary-custom";
        loginLink.href = "login.html";
        loginLink.textContent = "Login";
        authNav.appendChild(loginLink);
        return;
    } else if (user.role === "admin") {
        try {
            const adminLink = document.createElement("a");
            adminLink.className = "nav-link nav-admin";
            adminLink.href = "admin.html";
            adminLink.textContent = "Admin Panel";
            const adminNavItem = document.createElement("li");
            adminNavItem.className = "nav-item";
            adminNavItem.appendChild(adminLink);
            navBar.appendChild(adminNavItem);
        } catch (error) {
            console.log("Just a page with no navbar, ignore this error");
        }
    }

    const stack = document.createElement("div");
    stack.className = "auth-nav-stack";

    const userName = document.createElement("span");
    userName.className = "auth-user-name";
    userName.textContent = user.fullname || user.username || "User";

    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "btn-custom btn-logout-custom";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", () => {
        clearLoggedInUser();
        renderAuthNav();
        window.location.href = "index.html";
    });

    stack.append(userName, logoutButton);
    authNav.appendChild(stack);
}

// Display messages on login
function setAuthMessage(message, type = "success") {
    const alertBox = document.getElementById("authMessage");

    if (!alertBox) {
        return;
    }

    alertBox.className = `alert alert-${type} auth-message show`;
    alertBox.textContent = message;
}

// Toggle password visibility
function togglePassword(button) {
    const targetId = button.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (!input) {
        return;
    }

    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    button.innerHTML = isPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    button.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
    );
}

// Handle login
function handleAuthSubmit(form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            setAuthMessage("Please fill in all required fields.", "danger");
            return;
        }

        const username = form.querySelector("#username")?.value.trim();
        const password = form.querySelector("#loginPassword")?.value.trim();
        const user = USERS.find(
            (user) => user.username === username && user.password === password,
        );
        if (user) {
            setAuthMessage("Login successful.");
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    id: user.id,
                    fullname: user.fullname,
                    role: user.role || "student",
                }),
            );
            window.setTimeout(() => {
                window.location.href = "index.html";
            }, 900);
            return;
        } else {
            setAuthMessage("Invalid username or password.", "danger");
        }
    });
}

// Add function to login form items
function initAuthPage() {
    const authForms = document.querySelectorAll("[data-auth-form]");

    if (authForms.length === 0) {
        return;
    }

    authForms.forEach(handleAuthSubmit);

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
        button.addEventListener("click", () => togglePassword(button));
    });
}

// Entry point: runs once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    saveCourseData();
    renderAuthNav();

    if (document.getElementById("courseGrid")) {
        initSearch();
        initCategoryTabs();
        initSort();
        renderCourses();
    }

    initAuthPage();
});
