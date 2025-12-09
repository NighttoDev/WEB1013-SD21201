// Initialize i18next
document.addEventListener('DOMContentLoaded', () => {
    i18next
        .use(i18nextHttpBackend)
        .init({
            lng: localStorage.getItem('selectedLanguage') || 'vi', // Default language
            fallbackLng: 'vi',
            backend: {
                loadPath: 'locales/{{lng}}/translation.json'
            },
            debug: true // Enable debug to see what's happening in console
        }, function (err, t) {
            if (err) return console.error('i18next init error:', err);
            updateContent();
            updateActiveState(i18next.language);
            // Handle blog detail page specifically
            if (window.location.pathname.includes('blog-detail.html')) {
                loadBlogContent();
            }
            // Handle blog listing page
            if (window.location.pathname.includes('blog.html')) {
                renderBlogListing();
            }
            // Handle Home Page
            if (document.getElementById('home-featured-posts')) {
                renderHomeLatestPosts();
            }
            // Handle Project Listing
            if (document.getElementById('projects-container')) {
                renderProjects();
            }

        });

    // Language Dropdown Logic
    const langLinks = document.querySelectorAll('.lang-drop-content a');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');

            i18next.changeLanguage(lang, (err, t) => {
                if (err) return console.error('Error changing language:', err);
                localStorage.setItem('selectedLanguage', lang);
                updateContent();
                updateActiveState(lang);
                // Reload blog content on language change
                if (window.location.pathname.includes('blog-detail.html')) {
                    loadBlogContent();
                }
                // Reload blog listing
                if (window.location.pathname.includes('blog.html')) {
                    renderBlogListing();
                }
                // Reload home page
                if (document.getElementById('home-featured-posts')) {
                    renderHomeLatestPosts();
                }
                // Reload projects
                if (document.getElementById('projects-container')) {
                    renderProjects();
                }
            });
        });
    });
});

function loadBlogContent() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) return; // Handle no ID case if needed

    const baseKey = `blog_posts.${postId}`;

    // safe check if post exists
    if (!i18next.exists(`${baseKey}.title`)) return;

    document.getElementById('blog-title').innerText = i18next.t(`${baseKey}.title`);
    document.getElementById('blog-date').innerText = i18next.t(`${baseKey}.date`);
    document.getElementById('blog-category').innerText = i18next.t(`${baseKey}.category`);
    document.getElementById('blog-content').innerHTML = i18next.t(`${baseKey}.content`);

    // Specific specific image handling if needed, or just set src
    const imgUrl = i18next.t(`${baseKey}.image`);
    document.getElementById('blog-hero').style.backgroundImage = `url('${imgUrl}')`;
}

function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');

        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = i18next.t(key);
        } else {
            // Check for HTML content in translation (contains <) - use html
            // Otherwise use text to remain safe
            const translation = i18next.t(key);
            if (translation.includes('<')) {
                element.innerHTML = translation;
            } else {
                element.innerText = translation;
            }
        }
    });
}

function updateActiveState(lang) {
    document.querySelectorAll('.lang-drop-content a').forEach(link => {
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function renderBlogListing() {
    const mainContainer = document.getElementById('featured-main-container');
    const sideContainer = document.getElementById('featured-side-container');
    const gridContainer = document.getElementById('all-posts-container');

    // Only proceed if we are on the blog listing page
    if (!mainContainer || !sideContainer || !gridContainer) return;

    // Get all blog posts from the current language resource
    // Accessing strict resource structure
    const postsObj = i18next.getResourceBundle(i18next.language, 'translation').blog_posts;

    if (!postsObj) return;

    // Convert object to array and sort by ID descending (assuming higher ID = newer)
    const sortedPosts = Object.entries(postsObj)
        .map(([id, post]) => ({ id, ...post }))
        .sort((a, b) => parseInt(b.id) - parseInt(a.id));

    // Clear content
    mainContainer.innerHTML = '';
    sideContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    // Render Posts
    sortedPosts.forEach((post, index) => {
        // First post: Main Feature
        if (index === 0) {
            mainContainer.innerHTML = `
                <article class="featured-card">
                    <div class="featured-thumb">
                        <a href="blog-detail.html?id=${post.id}">
                            <img src="${post.image}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="featured-content">
                        <div class="meta-row">
                            <span class="meta-author">Khoa Tran</span>
                            <span>•</span>
                            <span>${post.date}</span>
                        </div>
                        <h3 class="featured-title"><a href="blog-detail.html?id=${post.id}">${post.title}</a></h3>
                        <p class="featured-excerpt">${stripHtml(post.content).substring(0, 120)}...</p>
                        <span class="tag-badge">${post.category}</span>
                    </div>
                </article>
            `;
        }
        // Next 2 posts: Side Features
        else if (index > 0 && index < 3) {
            sideContainer.innerHTML += `
                <article class="side-card">
                    <div class="side-thumb">
                        <a href="blog-detail.html?id=${post.id}">
                            <img src="${post.image}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="side-content">
                        <div class="meta-row" style="margin-bottom: 0.5rem;">
                            <span class="meta-author">Khoa Tran</span>
                            <span>•</span>
                            <span>${post.date}</span>
                        </div>
                        <h3 class="side-title"><a href="blog-detail.html?id=${post.id}">${post.title}</a></h3>
                        <span class="tag-badge">${post.category}</span>
                    </div>
                </article>
            `;
        }
        // Remaining: Grid
        else {
            gridContainer.innerHTML += `
                <article class="blog-grid-card">
                    <div class="grid-thumb">
                        <a href="blog-detail.html?id=${post.id}">
                            <img src="${post.image}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="grid-content">
                        <div class="meta-row">
                            <span class="meta-author">Khoa Tran</span>
                            <span>•</span>
                            <span>${post.date}</span>
                        </div>
                        <h3 class="grid-title"><a href="blog-detail.html?id=${post.id}">${post.title}</a></h3>
                        <p class="grid-excerpt">${stripHtml(post.content).substring(0, 100)}...</p>
                        <span class="tag-badge">${post.category}</span>
                    </div>
                </article>
            `;
        }
    });
}

function renderHomeLatestPosts() {
    const container = document.getElementById('home-featured-posts');
    if (!container) return;

    // Get posts
    const postsObj = i18next.getResourceBundle(i18next.language, 'translation').blog_posts;
    if (!postsObj) return;

    // Sort and take top 3
    const sortedPosts = Object.entries(postsObj)
        .map(([id, post]) => ({ id, ...post }))
        .sort((a, b) => parseInt(b.id) - parseInt(a.id))
        .slice(0, 3);

    container.innerHTML = '';

    const readMoreText = i18next.t('read_more') || 'Read More';

    sortedPosts.forEach(post => {
        container.innerHTML += `
            <article class="home-blog-card">
                <div class="blog-thumb">
                    <a href="blog-detail.html?id=${post.id}">
                        <img src="${post.image}" alt="${post.title}">
                    </a>
                </div>
                <div class="blog-content">
                    <h3><a href="blog-detail.html?id=${post.id}">${post.title}</a></h3>
                    <p>${stripHtml(post.content).substring(0, 80)}...</p>
                    <a href="blog-detail.html?id=${post.id}" class="link-text">${readMoreText} &rarr;</a>
                </div>
            </article>
        `;
    });
}

// Helper to strip HTML for excerpts
function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Get projects
    const projectsObj = i18next.getResourceBundle(i18next.language, 'translation').projects;
    if (!projectsObj) return;

    const sortedProjects = Object.entries(projectsObj)
        .map(([id, proj]) => ({ id, ...proj }));

    container.innerHTML = '';

    sortedProjects.forEach(proj => {
        // Generate tech tags
        let techTags = '';
        if (proj.tech && Array.isArray(proj.tech)) {
            proj.tech.forEach(tech => {
                techTags += `<span class="tech-tag">${tech}</span>`;
            });
        }

        container.innerHTML += `
            <article class="project-card">
                <div class="project-thumb">
                    <img src="${proj.image}" alt="${proj.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.description}</p>

                    <div class="project-tech-stack">
                        ${techTags}
                    </div>

                    <div class="project-meta">
                        <div class="meta-item">
                            <i class="fas fa-users"></i> ${proj.members}
                        </div>
                         <div class="meta-item">
                            <i class="fas fa-user-tag"></i> ${proj.role}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i> ${proj.date}
                        </div>
                    </div>
                </div>
            </article>
        `;
    });
}
