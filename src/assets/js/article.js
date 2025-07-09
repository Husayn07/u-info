import { articlesData } from './articlesData.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const articlesGrid = document.getElementById('articles-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    const pageBtnsContainer = document.querySelector('.page-numbers');

    // Pagination variables
    let currentPage = 1;
    const articlesPerPage = 6;
    let totalPages = Math.ceil(articlesData.length / articlesPerPage);
    let filteredArticles = [...articlesData];

    // Initialize the page
    function init() {
        generatePageButtons();
        renderArticles();
        updatePagination();
    }

    // Generate article cards
    function generateArticleCard(article) {
        const categoryClass = article.category.toLowerCase();
        const categoryName = categoryClass.charAt(0).toUpperCase() + categoryClass.slice(1);
        
        return `
            <article class="article-card" data-category="${categoryClass}" data-date="${article.date}">
                <div class="article-image">
                    <img src="${article.imageUrl}" alt="${article.title}">
                    <span class="category-badge ${categoryClass}">${categoryName}</span>
                </div>
                <div class="article-content">
                    <h2><a href="article.html?id=${article.id}">${article.title}</a></h2>
                    <p class="excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <img src="${article.author.avatar}" alt="${article.author.name}" class="author-avatar">
                        <div class="meta-details">
                            <span class="author">${article.author.name}</span>
                            <span class="date">${formatDate(article.date)}</span>
                            <span class="reading-time">${article.readingTime}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // Format date to "Month Day, Year"
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Render articles based on current filter and sort
    function renderArticles() {
        // Clear existing articles
        articlesGrid.innerHTML = '';
        
        // Calculate pagination range
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToShow = filteredArticles.slice(startIndex, endIndex);
        
        // Generate and append article cards
        articlesToShow.forEach(article => {
            articlesGrid.innerHTML += generateArticleCard(article);
        });
    }

    // Generate pagination buttons
    function generatePageButtons() {
        pageBtnsContainer.innerHTML = '';
        
        // Always show first page
        pageBtnsContainer.innerHTML += `
            <button class="page-btn ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>
        `;
        
        // Show ellipsis if needed
        if (currentPage > 3) {
            pageBtnsContainer.innerHTML += `<span class="ellipsis">...</span>`;
        }
        
        // Show current page and neighbors
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pageBtnsContainer.innerHTML += `
                <button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>
            `;
        }
        
        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            pageBtnsContainer.innerHTML += `<span class="ellipsis">...</span>`;
        }
        
        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pageBtnsContainer.innerHTML += `
                <button class="page-btn ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>
            `;
        }
        
        // Add event listeners to page buttons
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderArticles();
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // Update pagination controls
    function updatePagination() {
        // Update active page button
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.page) === currentPage) {
                btn.classList.add('active');
            }
        });
        
        // Enable/disable prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Filter articles by category
    function filterArticles(category) {
        if (category === 'all') {
            filteredArticles = [...articlesData];
        } else {
            filteredArticles = articlesData.filter(article => article.category === category);
        }
        
        // Reset to first page when filtering
        currentPage = 1;
        totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        renderArticles();
        generatePageButtons();
        updatePagination();
    }

    // Sort articles
    function sortArticles(sortBy) {
        filteredArticles.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'popular':
                    return b.views - a.views;
                case 'comments':
                    return b.comments - a.comments;
                default:
                    return 0;
            }
        });
        
        renderArticles();
    }

    // Event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter articles
            filterArticles(button.dataset.category);
        });
    });
    
    sortSelect.addEventListener('change', () => {
        sortArticles(sortSelect.value);
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderArticles();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderArticles();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Initialize the page
    init();
});