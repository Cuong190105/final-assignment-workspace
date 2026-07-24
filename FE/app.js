/* ============================================================
   app.js — Shared data & utility functions
   Used by index.html (Course Listing + Search/Filter/Sort)
   ============================================================ */

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
        icon: "bi-code-slash"
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
        icon: "bi-braces"
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
        icon: "bi-palette"
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
        icon: "bi-vector-pen"
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
        icon: "bi-bar-chart-line"
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
        icon: "bi-graph-up"
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
        icon: "bi-megaphone"
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
        icon: "bi-search"
    }
];

// Current UI state for filtering/sorting the course grid
const state = {
    searchTerm: "",
    activeCategory: "All",
    sortBy: "default"
};

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
    let list = COURSES.filter((course) => {
        const matchesCategory =
            state.activeCategory === "All" || course.category === state.activeCategory;

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

// Entry point: runs once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initSearch();
    initCategoryTabs();
    initSort();
    renderCourses();
});
