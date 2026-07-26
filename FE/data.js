const courses = [

    {

        id: 1,

        title: "HTML Fundamentals",

        description: "Learn the fundamentals of HTML and build your first web pages.",

        instructor: "John Smith",

        thumbnail: "assets/images/html.jpg",

        price: 499000,

        enrolled: false,

        sections: [

            {
                id: 1,
                title: "HTML Basics",

                lessons: [
                    { id: 1, title: "Introduction to HTML", video: "assets/videos/demo.mp4" },
                    { id: 2, title: "HTML Document Structure", video: "assets/videos/demo1.mp4" },
                    { id: 3, title: "Headings and Paragraphs", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [

                    {
                        id: 1,
                        question: "What does HTML stand for?",
                        options: [
                            "HyperText Markup Language",
                            "HighText Machine Language",
                            "Hyperlink Markup Language",
                            "Home Tool Markup Language"
                        ],
                        answer: 0
                    },

                    {
                        id: 2,
                        question: "Which tag is used to create a paragraph?",
                        options: [
                            "<div>",
                            "<p>",
                            "<h1>",
                            "<span>"
                        ],
                        answer: 1
                    },

                    {
                        id: 3,
                        question: "Which tag creates the largest heading?",
                        options: [
                            "<h6>",
                            "<title>",
                            "<h1>",
                            "<header>"
                        ],
                        answer: 2
                    }

                ]
            },

            {
                id: 2,
                title: "HTML Elements",

                lessons: [
                    { id: 4, title: "Links", video: "assets/videos/demo.mp4" },
                    { id: 5, title: "Images", video: "assets/videos/demo1.mp4" },
                    { id: 6, title: "Lists", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [

                    {
                        id: 4,
                        question: "Which tag creates a hyperlink?",
                        options: [
                            "<link>",
                            "<a>",
                            "<img>",
                            "<href>"
                        ],
                        answer: 1
                    },

                    {
                        id: 5,
                        question: "Which attribute specifies an image source?",
                        options: [
                            "href",
                            "alt",
                            "src",
                            "path"
                        ],
                        answer: 2
                    },

                    {
                        id: 6,
                        question: "Which tag creates an unordered list?",
                        options: [
                            "<ol>",
                            "<ul>",
                            "<li>",
                            "<table>"
                        ],
                        answer: 1
                    }

                ]
            }

        ]
    },

    {
        id: 2,

        title: "CSS Essentials",

        description: "Learn how to style websites with modern CSS.",

        instructor: "Emily Johnson",

        thumbnail: "assets/images/css.jpg",

        price: 599000,

        enrolled: false,

        sections: [

            {
                id: 3,
                title: "CSS Basics",

                lessons: [
                    { id: 7, title: "Introduction to CSS", video: "assets/videos/demo.mp4" },
                    { id: 8, title: "Selectors", video: "assets/videos/demo1.mp4" },
                    { id: 9, title: "Colors and Backgrounds", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [

                    {
                        id: 7,
                        question: "Which property changes text color?",
                        options: [
                            "background",
                            "font-color",
                            "color",
                            "text-color"
                        ],
                        answer: 2
                    },

                    {
                        id: 8,
                        question: "Which selector targets an element by id?",
                        options: [
                            ".",
                            "#",
                            "*",
                            "&"
                        ],
                        answer: 1
                    },

                    {
                        id: 9,
                        question: "Which property changes the background color?",
                        options: [
                            "background-color",
                            "color",
                            "bg-color",
                            "fill"
                        ],
                        answer: 0
                    }

                ]
            },

            {
                id: 4,
                title: "CSS Layout",

                lessons: [
                    { id: 10, title: "Box Model", video: "assets/videos/demo.mp4" },
                    { id: 11, title: "Flexbox", video: "assets/videos/demo1.mp4" },
                    { id: 12, title: "Grid Layout", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [

                    {
                        id: 10,
                        question: "What does the CSS Box Model include?",
                        options: [
                            "Margin, Border, Padding, Content",
                            "Width and Height only",
                            "Header and Footer",
                            "Text and Images"
                        ],
                        answer: 0
                    },

                    {
                        id: 11,
                        question: "Which property enables Flexbox?",
                        options: [
                            "display: grid",
                            "display: block",
                            "display: flex",
                            "position: flex"
                        ],
                        answer: 2
                    },

                    {
                        id: 12,
                        question: "Which layout system is best for two-dimensional layouts?",
                        options: [
                            "Float",
                            "Flexbox",
                            "Grid",
                            "Inline-block"
                        ],
                        answer: 2
                    }

                ]
            }

        ]
    },
    {
        id: 3,
        title: "JavaScript Essentials",
        description: "Learn JavaScript programming from scratch.",
        instructor: "David Wilson",
        thumbnail: "assets/images/javascript.jpg",
        price: 799000,
        enrolled: false,

        sections: [
            {
                id: 1,
                title: "JavaScript Basics",

                lessons: [
                    { id: 201, title: "Variables", video: "assets/videos/demo.mp4" },
                    { id: 202, title: "Data Types", video: "assets/videos/demo1.mp4" },
                    { id: 203, title: "Functions", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [
                    {
                        id: 201,
                        question: "Which keyword declares a block-scoped variable?",
                        options: ["var", "let", "const", "Both let and const"],
                        answer: 3
                    },
                    {
                        id: 202,
                        question: "Which symbol is used for comments?",
                        options: ["//", "<!-- -->", "##", "**"],
                        answer: 0
                    },
                    {
                        id: 203,
                        question: "How do you call a function named test?",
                        options: ["call test()", "test()", "function test()", "run(test)"],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "Bootstrap 5",
        description: "Build responsive websites quickly with Bootstrap.",
        instructor: "Sarah Brown",
        thumbnail: "assets/images/bootstrap.jpg",
        price: 399000,
        enrolled: false,

        sections: [
            {
                id: 1,
                title: "Getting Started",

                lessons: [
                    { id: 301, title: "Bootstrap Introduction", video: "assets/videos/demo.mp4" },
                    { id: 302, title: "Grid System", video: "assets/videos/demo1.mp4" },
                    { id: 303, title: "Buttons & Cards", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [
                    {
                        id: 301,
                        question: "Bootstrap is mainly used for?",
                        options: [
                            "Backend development",
                            "Responsive web design",
                            "Database management",
                            "Game development"
                        ],
                        answer: 1
                    },
                    {
                        id: 302,
                        question: "How many columns are in Bootstrap grid?",
                        options: ["10", "12", "16", "24"],
                        answer: 1
                    },
                    {
                        id: 303,
                        question: "Which class creates a primary button?",
                        options: [
                            "btn-success",
                            "btn-primary",
                            "button-primary",
                            "primary-btn"
                        ],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "React Basics",
        description: "Build modern web applications using React.",
        instructor: "Michael Lee",
        thumbnail: "assets/images/react.jpg",
        price: 999000,
        enrolled: false,

        sections: [
            {
                id: 1,
                title: "React Introduction",

                lessons: [
                    { id: 401, title: "What is React?", video: "assets/videos/demo.mp4" },
                    { id: 402, title: "Components", video: "assets/videos/demo1.mp4" },
                    { id: 403, title: "JSX", video: "assets/videos/demo2.mp4" }
                ],

                quiz: [
                    {
                        id: 401,
                        question: "React is mainly used to build?",
                        options: [
                            "Operating systems",
                            "User interfaces",
                            "Databases",
                            "Networks"
                        ],
                        answer: 1
                    },
                    {
                        id: 402,
                        question: "JSX is?",
                        options: [
                            "A database",
                            "A CSS framework",
                            "JavaScript XML syntax",
                            "A server"
                        ],
                        answer: 2
                    },
                    {
                        id: 403,
                        question: "React components usually return?",
                        options: [
                            "HTML/JSX",
                            "SQL",
                            "CSS",
                            "XML files"
                        ],
                        answer: 0
                    }
                ]
            }
        ]
    }


];

