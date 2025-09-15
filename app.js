// Portfolio Application JavaScript
// Modern Full Stack Developer Portfolio

// Application State
const portfolioData = {
    personalInfo: {
        name: "[Your Name]",
        title: "Full Stack Developer",
        tagline: "Crafting digital experiences with modern web technologies",
        email: "your.email@example.com",
        phone: "+1 (555) 123-4567",
        location: "Your City, Country",
        resume: "resume.pdf"
    },
    projects: [
        {
            id: 1,
            title: "Calculator",
            description: "A simple calculator web app for basic arithmetic operations.",
            image: "calculator.png",
            technologies: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://chunchuswargiary.github.io/Basic-Calculator/",
            githubUrl: "https://github.com/Chunchuswargiary/Basic-Calculator",
            category: "frontend"
        },
        {
            id: 2,
            title: "Recipebook1",
            description: "Recipe book application to manage and view recipes.",
            image: "Recipebook1.png",
            technologies: ["HTML", "CSS", "JavaScript"],
            liveUrl: " https://chunchuswargiary.github.io/Recipebook/",
            githubUrl: "https://github.com/Chunchuswargiary/Recipebook",
            category: "frontend"
        },
        {
            id: 3,
            title: "Student Teacher Booking",
            description: "System for booking appointments between students and teachers.",
            image: "student-teacher-booking.png",
            technologies: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://chunchuswargiary.github.io/student-teacher-booking-appointment-/",
            githubUrl: "https://github.com/Chunchuswargiary/student-teacher-booking-appointment-",
            category: "frontend"
        },
        {
            id: 4,
            title: "Catering Ordering System",
            description: "Application for managing catering orders and services.",
            image: "catering-ordering-system.png",
            technologies: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://chunchuswargiary.github.io/Catering-Ordering-system/",
            githubUrl: "https://github.com/Chunchuswargiary/Catering-Ordering-system",
            category: "frontend"
        }
    ],
    skills: {
        technical: [
            { name: "JavaScript", level: 95 },
            { name: "React", level: 90 },
            { name: "Node.js", level: 85 },
            { name: "Python", level: 80 },
            { name: "MongoDB", level: 85 },
            { name: "AWS", level: 75 }
        ]
    }
};

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');
const projectsGrid = document.getElementById('projectsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Utility Functions
function showToast(message, type = 'success', title = '') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navigation Functionality
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Smooth scroll to section
            smoothScrollTo(target);
            
            // Update active link
            updateActiveNavLink(link);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Scroll Management
function initializeScrollHandlers() {
    // Scroll to top button
    const handleScroll = debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide scroll to top button
        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        // Update navigation based on scroll position
        updateNavigationOnScroll();
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollTop = window.pageYOffset + 100; // Offset for navbar
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }
    });
}

// Projects Functionality
function initializeProjects() {
    loadProjects();
    initializeProjectFilters();
}

function loadProjects() {
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = portfolioData.projects.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image" style="background-image: url('${project.image}')"></div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveUrl}" target="_blank" class="project-link primary">
                        Live Demo
                    </a>
                    <a href="${project.githubUrl}" target="_blank" class="project-link secondary">
                        View Code
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function initializeProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Skills Progress Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const animateBar = (bar) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 100);
    };

    // Use Intersection Observer to animate when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => animateBar(bar), index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('.skills-progress');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Contact Form
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleContactFormSubmission();
    });
}

function handleContactFormSubmission() {
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Basic form validation
    if (!validateContactForm(data)) {
        return;
    }
    
    // Simulate form submission
    simulateFormSubmission(data);
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showToast(errors.join('. '), 'error', 'Validation Error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear form
        contactForm.reset();
        
        // Show success message
        showToast(
            'Thank you for your message! I\'ll get back to you as soon as possible.',
            'success',
            'Message Sent'
        );
        
        // Log the form data (in a real app, this would be sent to a server)
        console.log('Contact form submission:', data);
    }, 2000);
}

// Animation and Visual Effects
function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .stat-card, .skill-category, .timeline-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Arrow keys for project navigation
        if (e.target.classList.contains('filter-btn')) {
            const buttons = Array.from(filterBtns);
            const currentIndex = buttons.indexOf(e.target);
            let newIndex;
            
            if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
                newIndex = currentIndex + 1;
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                newIndex = currentIndex - 1;
            }
            
            if (newIndex !== undefined) {
                e.preventDefault();
                buttons[newIndex].focus();
                buttons[newIndex].click();
            }
        }
    });
}

// Performance Optimization
function initializePerformanceOptimizations() {
    // Lazy loading for project images
    const images = document.querySelectorAll('.project-image[style*="background-image"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                // Image is already loaded via CSS, but we can add loading animation here
                image.style.opacity = '1';
                imageObserver.unobserve(image);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
}

// Theme Detection and Handling
function handleTheme() {
    // Detect system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleThemeChange(e) {
        // You can add theme-specific logic here if needed
        console.log('Theme changed to:', e.matches ? 'dark' : 'light');
    }
    
    mediaQuery.addListener(handleThemeChange);
    handleThemeChange(mediaQuery); // Initial check
}

// Analytics and Tracking (Placeholder)
function initializeAnalytics() {
    // Track page views, clicks, form submissions, etc.
    // This would integrate with Google Analytics, Mixpanel, etc.
    
    // Example: Track project clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-link')) {
            const projectTitle = e.target.closest('.project-card').querySelector('.project-title').textContent;
            const linkType = e.target.classList.contains('primary') ? 'live-demo' : 'source-code';
            
            console.log('Project link clicked:', {
                project: projectTitle,
                type: linkType,
                timestamp: new Date().toISOString()
            });
        }
        
        // Track filter usage
        if (e.target.classList.contains('filter-btn')) {
            const filter = e.target.getAttribute('data-filter');
            console.log('Project filter used:', filter);
        }
    });
}

// Error Handling
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        // In production, you might want to send errors to a logging service
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// Application Initialization
function initializeApplication() {
    console.log('Initializing Portfolio Application...');
    
    try {
        // Core functionality
        initializeNavigation();
        initializeScrollHandlers();
        initializeProjects();
        initializeContactForm();
        
        // Enhancements
        animateProgressBars();
        initializeAnimations();
        initializeKeyboardNavigation();
        initializePerformanceOptimizations();
        
        // Additional features
        handleTheme();
        initializeAnalytics();
        
        console.log('Portfolio Application initialized successfully!');
        
        // Show welcome message
        setTimeout(() => {
            showToast('Welcome to my portfolio! Feel free to explore my work.', 'info');
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showToast('There was an error loading the application. Please refresh the page.', 'error');
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        portfolioData,
        validateContactForm,
        isValidEmail,
        showToast,
        debounce
    };
}

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below to register a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// Additional Utility Functions
const utils = {
    // Format phone numbers
    formatPhoneNumber: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },
    
    // Copy to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            showToast('Failed to copy to clipboard', 'error');
        }
    },
    
    // Download resume
    downloadResume: () => {
        const link = document.createElement('a');
        link.href = portfolioData.personalInfo.resume;
        link.download = `${portfolioData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Resume download started!', 'info');
    }
};

// Make utils available globally
window.portfolioUtils = utils;