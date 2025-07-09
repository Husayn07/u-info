const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.js');

// Helper function to read posts
function readPosts() {
    try {
        // This is a simplified approach - in production you'd want a more robust solution
        delete require.cache[require.resolve(DATA_FILE)];
        return require(DATA_FILE);
    } catch (err) {
        console.error('Error reading posts:', err);
        return [];
    }
}

// Helper function to write posts
function writePosts(posts) {
    const content = `const blogPosts = ${JSON.stringify(posts, null, 2)};\n\nexport default blogPosts;`;
    fs.writeFileSync(DATA_FILE, content);
}

// API Endpoints
app.get('/api/posts', (req, res) => {
    const posts = readPosts();
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const posts = readPosts();
    const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        ...req.body,
        date: req.body.date || new Date().toISOString().split('T')[0],
        views: 0,
        comments: 0
    };
    
    posts.push(newPost);
    writePosts(posts);
    res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const posts = readPosts();
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    posts[index] = { ...posts[index], ...req.body };
    writePosts(posts);
    res.json(posts[index]);
});

app.delete('/api/posts/:id', (req, res) => {
    const posts = readPosts();
    const filtered = posts.filter(p => p.id !== parseInt(req.params.id));
    
    if (filtered.length === posts.length) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    writePosts(filtered);
    res.status(204).end();
});

// Serve admin page
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});