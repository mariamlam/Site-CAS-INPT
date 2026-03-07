$(document).ready(function() {

   
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if(target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    
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

    
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Sent Successfully!';
                btn.classList.replace('btn-primary', 'btn-success');
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('btn-success', 'btn-primary');
                    btn.disabled = false;
                }, 3000);

            }, 1500);
        });
    }

    
    $(window).on('scroll', function() {
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

   
    $('.container h1').append('<span class="live-badge ms-3">● LIVE</span>');

    $('#toggleHeroBtn').click(function () {
        $('#extraHeroContent').slideToggle(400);
    });

    
    $('#addActivityBtn').click(function () {
        const title = prompt('Activity title:');
        if (!title) return;

        const description = prompt('Short description:');
        if (!description) return;

        const newCard = `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <i class="bi bi-star-fill text-warning fs-1"></i>
                        <h5 class="fw-bold mt-3">${title}</h5>
                        <p class="small text-muted">${description}</p>
                    </div>
                </div>
            </div>
        `;

        $('#initiatives .row').append(newCard);

        $('html, body').animate({
            scrollTop: $('#initiatives .row .col-md-4:last-child').offset().top - 100
        }, 600);
    });

   
    $('.delete-btn').click(function() {
        $(this).closest('.col-6.col-md-3').fadeOut(300, function() {
            $(this).remove();
        });
    });

   
    $('.nav-link').css('color', 'black');

  
    $('.card h5:contains("Nursing Home Visit")')
        .append(' <span class="badge bg-success ms-2">New</span>');

    
    let clickTimer;

    $('.member-card').click(function(e) {
        if ($(e.target).hasClass('delete-btn')) return;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            let memberName = $(this).find('h5').text();
            alert('You clicked on ' + memberName + '!');
        }, 250);
    });

    $('.member-card').dblclick(function(e) {
        clearTimeout(clickTimer);
        $(this).toggleClass('card-enlarged');
    });

    
    $('.social-links a').each(function() {
        if ($(this).find('i').hasClass('bi-linkedin')) {
            $(this).attr('title', 'LinkedIn Profile');
        }
    });
    $('[title]').tooltip();


    $('body').css('transition', 'background-color 0.3s ease');

   $(document).keydown(function(e) {
    
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('body').css('background-color', randomColor);
});

setTimeout(() => {
        $('#announcement-banner').css('top', '0');
    }, 1000);
    setTimeout(() => {
        $('#announcement-banner').css('top', '-50px');
    }, 6000);
    $('#announcement-banner').click(function() {
        $(this).css('top', '-50px');
    });

   setTimeout(() => {
        $('.hero-text').addClass('show');
    }, 500); 

   
    setTimeout(() => {
        $('.hero-lead').addClass('show');
    }, 1000);

    $('.card').hover(
    function () {
        $(this).stop().animate(
            { marginTop: "-10px" }, 
            150
        ).animate(
            { marginTop: "0px" }, 
            150
        );
    },
    function () {
        $(this).stop().animate(
            { marginTop: "0px" }, 
            150
        );
    }
);

$(window).on("scroll", function(){

    let scrollTop = $(window).scrollTop();
    let docHeight = $(document).height();
    let winHeight = $(window).height();

    let scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

    $("#scrollProgress").css("width", scrollPercent + "%");

});

$('.member-card').click(function() {

    $('.member-card').removeClass('member-active');

    $(this).addClass('member-active');

});

$('#initiatives .card').first().addClass('first-activity');
$('#initiatives .card').last().addClass('last-activity');

$('#initiatives .card').click(function(e) {

    if ($(e.target).hasClass('change-bg')) {
        $(e.target).parent().css('background-color', '#61de9c');
    } else {
        $(this).find('h5').text('kheir');
    }

});

function updateActivityCount() {
    let count = $('#initiatives .card').length;  
    $('#activity-count').text(count);           
}
updateActivityCount();

$('#addActivityBtn').click(function() {
    updateActivityCount();
});

$('#initiatives .card').eq(1)    
    .hide()
    .css('background-color', '#fff3cd') 
    .fadeIn(800);    
    
$('#initiatives .card').eq(2)       
    .hide()                          
    .css({                           
        'background-color': '#ffe5d9',  
        'border': '2px solid #ff6b6b',  
        'color': '#842029',             
        'border-radius': '10px'         
    })
    .fadeIn(800)                      
    .animate({ marginTop: '20px' }, 400)  
    .animate({ marginTop: '0px' }, 400); 

$('#initiatives .card')
    .css({
        'box-shadow': '0 4px 8px rgba(0,0,0,0.1)',
        'transition': 'all 0.3s ease',
        'border-radius': '8px'
    });

const hero = $('#home'); 
const images = [
    "../assests/hero4cp.png",
    "../assests/girls cp.jpeg",
    "../assests/hero3.png"
];

let current = 0;

function changeHeroBackground() {
    hero.fadeOut(500, function() {
        hero.css('background-image', `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[current]}")`);
        hero.fadeIn(500);
    });

    current = (current + 1) % images.length; 
}

setInterval(changeHeroBackground, 5000);

$(window).scroll(function(){
    let scrollPosition = $(window).scrollTop();

    hero.css(
        'background-position',
        'center ' + (scrollPosition * 0.5) + 'px'
    );
});

 const text = "قلب ينبض بالعطاء";
    let index = 0;

    const title = $('.hero-text');
    title.html('<i class="bi bi-heart-pulse-fill text-danger"></i><br>');

    function typeEffect(){
        if(index < text.length){
            title.append(text.charAt(index));
            index++;
            setTimeout(typeEffect, 100);
        }
    }

    typeEffect();

 setTimeout(function(){
        $('#welcomeModal').modal('show');
    }, 10000)

let locked = false;

$(window).scroll(function(){

    if($(window).scrollTop() > 300 && !locked){

        $('#lock-overlay').fadeIn();
        $('body').css('overflow','hidden'); 
        locked = true;

    }

});

$('#unlock-btn').click(function(){

    $('#lock-overlay').fadeOut();
    $('body').css('overflow','auto'); 

});

$('#darkModeBtn').click(function(){
    $('body').toggleClass('dark-mode');
});



});




