const API = 'http://localhost:3000/api';

$(document).ready(function () {

    // ── Smooth scroll nav links ───────────────────────────────────────────
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.hash !== '') {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Section reveal on scroll ──────────────────────────────────────────
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('section-visible');
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // ── Contact form → backend ────────────────────────────────────────────
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn         = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            const data = {
                name:    contactForm.querySelector('input[placeholder="Your name"]').value.trim(),
                subject: contactForm.querySelector('input[placeholder="Request help, Join..."]').value.trim(),
                message: contactForm.querySelector('textarea').value.trim(),
            };

            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
            btn.disabled  = true;

            try {
                const res  = await fetch(`${API}/contact`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(data),
                });
                const json = await res.json();

                if (json.success) {
                    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Sent Successfully!';
                    btn.classList.replace('btn-primary', 'btn-success');
                    contactForm.reset();
                } else {
                    const msg = json.errors?.[0]?.msg || json.message || 'Please fill all fields correctly.';
                    btn.innerHTML = `⚠️ ${msg}`;
                    btn.classList.replace('btn-primary', 'btn-warning');
                }
            } catch (err) {
                btn.innerHTML = '❌ Server error — try again';
                btn.classList.replace('btn-primary', 'btn-danger');
            }

            setTimeout(() => {
                btn.innerHTML  = originalHTML;
                btn.className  = 'btn btn-primary w-100 py-3 rounded-pill fw-bold';
                btn.disabled   = false;
            }, 3000);
        });
    }

    // ── Navbar scroll behaviour + back-to-top visibility ─────────────────
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }

        if ($(this).scrollTop() > 300) {
            $('#backToTop').css({ opacity: 1, visibility: 'visible' });
        } else {
            $('#backToTop').css({ opacity: 0, visibility: 'hidden' });
        }
    });

    $('#backToTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // ── Live badge ────────────────────────────────────────────────────────
    $('.container h1').append('<span class="live-badge ms-3">● LIVE</span>');

    // ── Hero "Learn More" toggle ──────────────────────────────────────────
    $('#toggleHeroBtn').click(function () {
        $('#extraHeroContent').slideToggle(400);
    });

    // ── Add activity → backend ────────────────────────────────────────────
    $('#addActivityBtn').off('click').on('click', async function () {
        const title = prompt('Activity title:');
        if (!title) return;

        const description = prompt('Short description:');
        if (!description) return;

        try {
            const res  = await fetch(`${API}/activities`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ title, description }),
            });
            const json = await res.json();

            if (json.success) {
                const newCard = `
                    <div class="col-md-4" data-activity-id="${json.data.id}">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body p-4">
                                <i class="bi ${json.data.icon} ${json.data.color} fs-1"></i>
                                <h5 class="fw-bold mt-3">${json.data.title}</h5>
                                <p class="small text-muted">${json.data.description}</p>
                                <button class="btn btn-primary btn-sm change-bg">Change Background</button>
                            </div>
                        </div>
                    </div>
                `;
                $('#initiatives .row').append(newCard);
                $('html, body').animate({
                    scrollTop: $('#initiatives .row .col-md-4:last-child').offset().top - 100
                }, 600);
                updateActivityCount();
            } else {
                alert('Could not save activity.');
            }
        } catch (err) {
            alert('Server error — is the backend running?');
        }
    });

    // ── Delete member card ────────────────────────────────────────────────
    $('.delete-btn').click(function () {
        $(this).closest('.col-6.col-md-3').fadeOut(300, function () {
            $(this).remove();
        });
    });

    // ── Nav link colour ───────────────────────────────────────────────────
    $('.nav-link').css('color', 'black');

    // ── "New" badge on Nursing Home Visit ────────────────────────────────
    $('.card h5:contains("Nursing Home Visit")')
        .append(' <span class="badge bg-success ms-2">New</span>');

    // ── Member card single click / double click ───────────────────────────
    let clickTimer;

    $('.member-card').click(function (e) {
        if ($(e.target).hasClass('delete-btn')) return;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            let memberName = $(this).find('h5').text();
            alert('You clicked on ' + memberName + '!');
        }, 250);
    });

    $('.member-card').dblclick(function (e) {
        clearTimeout(clickTimer);
        $(this).toggleClass('card-enlarged');
    });

    // ── Member card active highlight ──────────────────────────────────────
    $('.member-card').click(function () {
        $('.member-card').removeClass('member-active');
        $(this).addClass('member-active');
    });

    // ── LinkedIn tooltips ─────────────────────────────────────────────────
    $('.social-links a').each(function () {
        if ($(this).find('i').hasClass('bi-linkedin')) {
            $(this).attr('title', 'LinkedIn Profile');
        }
    });
    $('[title]').tooltip();

    // ── Random bg colour on any keydown ──────────────────────────────────
    $('body').css('transition', 'background-color 0.3s ease');
    $(document).keydown(function () {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        $('body').css('background-color', randomColor);
    });

    // ── Announcement banner ───────────────────────────────────────────────
    setTimeout(() => { $('#announcement-banner').css('top', '0'); },    1000);
    setTimeout(() => { $('#announcement-banner').css('top', '-50px'); }, 6000);
    $('#announcement-banner').click(function () { $(this).css('top', '-50px'); });

    // ── Hero text animation ───────────────────────────────────────────────
    setTimeout(() => { $('.hero-text').addClass('show'); },  500);
    setTimeout(() => { $('.hero-lead').addClass('show'); }, 1000);

    // ── Card bounce on hover ──────────────────────────────────────────────
    $('.card').hover(
        function () { $(this).stop().animate({ marginTop: '-10px' }, 150).animate({ marginTop: '0px' }, 150); },
        function () { $(this).stop().animate({ marginTop: '0px' }, 150); }
    );

    // ── Scroll progress bar ───────────────────────────────────────────────
    $(window).on('scroll', function () {
        const scrollTop     = $(window).scrollTop();
        const docHeight     = $(document).height();
        const winHeight     = $(window).height();
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        $('#scrollProgress').css('width', scrollPercent + '%');
    });

    // ── First / last activity highlight ──────────────────────────────────
    $('#initiatives .card').first().addClass('first-activity');
    $('#initiatives .card').last().addClass('last-activity');

    // ── Card click: change-bg button or rename title ──────────────────────
    $('#initiatives .card').click(function (e) {
        if ($(e.target).hasClass('change-bg')) {
            $(e.target).closest('.card-body').css('background-color', '#61de9c');
        }
    });

    // ── Activity count (loaded from backend, falls back to DOM count) ─────
    async function updateActivityCount() {
        try {
            const res  = await fetch(`${API}/activities`);
            const json = await res.json();
            $('#activity-count').text(json.data.length);
        } catch {
            $('#activity-count').text($('#initiatives .card').length);
        }
    }
    updateActivityCount();

    // ── Card entrance animations (eq 1 & 2) ──────────────────────────────
    $('#initiatives .card').eq(1)
        .hide()
        .css('background-color', '#fff3cd')
        .fadeIn(800);

    $('#initiatives .card').eq(2)
        .hide()
        .css({ 'background-color': '#ffe5d9', 'border': '2px solid #ff6b6b', 'color': '#842029', 'border-radius': '10px' })
        .fadeIn(800)
        .animate({ marginTop: '20px' }, 400)
        .animate({ marginTop: '0px' }, 400);

    $('#initiatives .card').css({ 'box-shadow': '0 4px 8px rgba(0,0,0,0.1)', 'transition': 'all 0.3s ease', 'border-radius': '8px' });

    
    const hero   = $('#home');
    const images = ['../assests/hero4cp.png', '../assests/girls cp.jpeg', '../assests/hero3.png'];
    let current  = 0;

    function changeHeroBackground() {
        hero.fadeOut(500, function () {
            hero.css('background-image', `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[current]}")`);
            hero.fadeIn(500);
        });
        current = (current + 1) % images.length;
    }
    setInterval(changeHeroBackground, 5000);

    // ── Hero parallax ─────────────────────────────────────────────────────
    $(window).scroll(function () {
        hero.css('background-position', 'center ' + ($(window).scrollTop() * 0.5) + 'px');
    });

    // ── Typewriter effect ─────────────────────────────────────────────────
    const text  = 'قلب ينبض بالعطاء';
    let index   = 0;
    const titleEl = $('.hero-text');
    titleEl.html('<i class="bi bi-heart-pulse-fill text-danger"></i><br>');

    function typeEffect() {
        if (index < text.length) {
            titleEl.append(text.charAt(index));
            index++;
            setTimeout(typeEffect, 100);
        }
    }
    typeEffect();

    
    setTimeout(function () { $('#welcomeModal').modal('show'); }, 10000);

 

    
    $('#darkModeBtn').click(function () {
        $('body').toggleClass('dark-mode');
    });

});



