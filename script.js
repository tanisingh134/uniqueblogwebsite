document.addEventListener('DOMContentLoaded', () => {
    const articles = document.querySelectorAll('article');

    // 1. Navigation smooth scrolling with category reset
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            // Reset category filter to show all posts
            articles.forEach(article => {
                article.style.display = 'block';
            });
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. Persist and load dark mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
    }
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Light Mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = 'Dark Mode';
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // 3. Comment Section with animation
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        const postId = form.getAttribute('data-post-id');
        const commentsList = document.getElementById(`comments-${postId}`);
        
        // Load comments from localStorage
        const storedComments = JSON.parse(localStorage.getItem(`comments-${postId}`)) || [];
        storedComments.forEach(comment => {
            const newComment = document.createElement('li');
            newComment.innerHTML = `<strong>${comment.name}</strong>: ${comment.message}`;
            commentsList.appendChild(newComment);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = form.querySelector('input');
            const messageInput = form.querySelector('textarea');
            const name = nameInput.value;
            const message = messageInput.value;
            if (name && message) {
                const newComment = document.createElement('li');
                newComment.innerHTML = `<strong>${name}</strong>: ${message}`;
                newComment.style.opacity = '0';
                commentsList.appendChild(newComment);
                
                // Animation for new comment
                setTimeout(() => {
                    newComment.style.transition = 'opacity 0.5s ease';
                    newComment.style.opacity = '1';
                }, 10);
                
                // Save to localStorage
                const updatedComments = [...storedComments, { name, message }];
                localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
                
                nameInput.value = '';
                messageInput.value = '';
            } else {
                alert('Please enter your name and message.');
            }
        });
    });

    // 4. "Read More" functionality
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const postContent = button.closest('.post-content');
            const fullContent = postContent.querySelector('.full-content');
            if (fullContent.classList.contains('open')) {
                fullContent.classList.remove('open');
                button.textContent = 'Read More';
            } else {
                fullContent.classList.add('open');
                button.textContent = 'Read Less';
            }
        });
    });

    // 5. Search Bar functionality
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        articles.forEach(article => {
            const title = article.querySelector('h2').textContent.toLowerCase();
            const content = article.querySelector('.post-content').textContent.toLowerCase();
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });

    // 6. "Back to Top" button and reading progress
    const backToTopBtn = document.getElementById("back-to-top");
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
        // Update reading progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('reading-progress').style.width = scrolled + '%';
    };
    backToTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    // 7. Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        const postId = button.getAttribute('data-post-id');
        const likesSpan = document.querySelector(`.likes[data-post-id="${postId}"]`);
        
        let likes = parseInt(localStorage.getItem(`likes-${postId}`)) || 0;
        likesSpan.textContent = `Likes: ${likes}`;
        
        button.addEventListener('click', () => {
            likes++;
            likesSpan.textContent = `Likes: ${likes}`;
            localStorage.setItem(`likes-${postId}`, likes);
            button.classList.add('liked');
            setTimeout(() => button.classList.remove('liked'), 300);
        });
    });

    // 8. Social sharing
    const shareButtons = document.querySelectorAll('.social-share a');
    shareButtons.forEach(button => {
        const title = encodeURIComponent(button.getAttribute('data-title'));
        const url = encodeURIComponent(window.location.href + '#' + button.closest('article').id);
        
        if (button.classList.contains('share-twitter')) {
            button.href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        } else if (button.classList.contains('share-facebook')) {
            button.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (button.classList.contains('share-linkedin')) {
            button.href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        }
        button.target = '_blank';
    });

    // 9. Newsletter signup
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        if (email) {
            alert(`Thank you for subscribing with ${email}!`);
            newsletterForm.reset();
        } else {
            alert('Please enter a valid email.');
        }
    });

    // 10. Category filtering
    const categoryLinks = document.querySelectorAll('.categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            articles.forEach(article => {
                if (category === 'all' || article.getAttribute('data-category') === category) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });

    // 11. Moving crystals background
    const container = document.getElementById('crystals-background');
    const crystalCount = 10;
    for (let i = 0; i < crystalCount; i++) {
        const crystal = document.createElement('div');
        crystal.className = 'crystal';
        crystal.style.left = `${Math.random() * 100}vw`;
        crystal.style.top = `${Math.random() * 100}vh`;
        crystal.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(crystal);
    }
});