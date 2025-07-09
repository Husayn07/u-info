document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const postForm = document.getElementById('postForm');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const postsList = document.getElementById('postsList');
    const resetBtn = document.getElementById('resetBtn');
    
    // Initialize blogPosts array
    let blogPosts = [];
    
    // Load existing posts from data.js
    function loadPosts() {
        // In a real app, this would fetch from your data.js file or API
        // For demo purposes, we'll use localStorage
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            blogPosts = JSON.parse(savedPosts);
            renderPostsList();
        }
    }
    
    // Generate a new ID
    function generateNewId() {
        if (blogPosts.length === 0) return 1;
        const maxId = Math.max(...blogPosts.map(post => post.id));
        return maxId + 1;
    }
    
    // Render posts list
    function renderPostsList() {
        postsList.innerHTML = '';
        
        if (blogPosts.length === 0) {
            postsList.innerHTML = '<p>No posts available.</p>';
            return;
        }
        
        blogPosts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div>
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        ${post.category} • ${new Date(post.date).toLocaleDateString()} • ID: ${post.id}
                    </div>
                </div>
                <div class="post-actions">
                    <button class="edit-btn" data-id="${post.id}">Edit</button>
                    <button class="delete-btn" data-id="${post.id}">Delete</button>
                </div>
            `;
            postsList.appendChild(postItem);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                editPost(postId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                deletePost(postId);
            });
        });
    }
    
    // Edit post
    function editPost(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) return;
        
        // Fill the form with post data
        document.getElementById('postId').value = post.id;
        document.getElementById('title').value = post.title;
        document.getElementById('excerpt').value = post.excerpt;
        document.getElementById('category').value = post.category;
        document.getElementById('imageUrl').value = post.imageUrl;
        document.getElementById('authorName').value = post.author.name;
        document.getElementById('authorAvatar').value = post.author.avatar;
        document.getElementById('authorBio').value = post.author.bio;
        document.getElementById('date').value = post.date;
        document.getElementById('content').value = post.content;
        
        // Update button text
        document.getElementById('saveBtn').textContent = 'Update Post';
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Delete post
    function deletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            blogPosts = blogPosts.filter(p => p.id !== postId);
            savePosts();
            renderPostsList();
            resetForm();
        }
    }
    
    // Save posts to localStorage
    function savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        updateJsonOutput();
    }
    
    // Update JSON output
    function updateJsonOutput() {
        jsonOutput.textContent = `const blogPosts = ${JSON.stringify(blogPosts, null, 2)};\n\nexport default blogPosts;`;
    }
    
    // Reset form
    function resetForm() {
        postForm.reset();
        document.getElementById('postId').value = '';
        document.getElementById('saveBtn').textContent = 'Save Post';
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    }
    
    // Form submission
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const postId = document.getElementById('postId').value;
        const isEdit = !!postId;
        
        const postData = {
            id: isEdit ? parseInt(postId) : generateNewId(),
            title: document.getElementById('title').value.trim(),
            excerpt: document.getElementById('excerpt').value.trim(),
            category: document.getElementById('category').value,
            imageUrl: document.getElementById('imageUrl').value.trim(),
            author: {
                name: document.getElementById('authorName').value.trim(),
                avatar: document.getElementById('authorAvatar').value.trim(),
                bio: document.getElementById('authorBio').value.trim()
            },
            date: document.getElementById('date').value,
            content: document.getElementById('content').value.trim(),
            views: 0,
            comments: 0
        };
        
        if (isEdit) {
            // Update existing post
            const index = blogPosts.findIndex(p => p.id === postData.id);
            if (index !== -1) {
                blogPosts[index] = postData;
            }
        } else {
            // Add new post
            blogPosts.push(postData);
        }
        
        savePosts();
        renderPostsList();
        resetForm();
    });
    
    // Copy JSON to clipboard
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(jsonOutput.textContent)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });
    
    // Download data.js file
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([jsonOutput.textContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Reset form button
    resetBtn.addEventListener('click', resetForm);
    
    // Initialize
    loadPosts();
    resetForm();
    updateJsonOutput();
});