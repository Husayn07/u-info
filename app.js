// Initialize Supabase client
const supabaseUrl = 'https://lfdcezmiiqnmfajlrcum.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZGNlem1paXFubWZhamxyY3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjI5NDAsImV4cCI6MjA2Nzc5ODk0MH0.Mjn8qWWxonCwjE3pWNLElSADXZ4I3iyCdFv9l2KTSRY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const postsContainer = document.getElementById('posts-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');

async function fetchPosts() {
    try {
        loadingElement.classList.remove('d-none');
        postsContainer.innerHTML = '';
        errorElement.classList.add('d-none');
        
        // Use the globally available supabase client
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (posts && posts.length > 0) {
            renderPosts(posts);
        } else {
            postsContainer.innerHTML = '<p class="text-center">No posts found.</p>';
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        errorElement.textContent = `Error loading posts: ${error.message}`;
        errorElement.classList.remove('d-none');
    } finally {
        loadingElement.classList.add('d-none');
    }
}

// Render posts to the page
function renderPosts(posts) {
    postsContainer.innerHTML = posts.map(post => `
        <div class="col-md-4">
            <div class="card post-card">
                ${post.image_url ? `
                    <img src="${post.image_url}" class="card-img-top" alt="${post.title}">
                ` : ''}
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content.substring(0, 100)}...</p>
                    <small class="text-muted">Posted on ${new Date(post.created_at).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', fetchPosts);