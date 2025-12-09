document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            // Texture change for icon (bars -> times)
            const icon = mobileToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Contact Form Handling (using EmailJS)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // 1. Show Loading State
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // 2. Prepare Template Params (Must match your EmailJS Template variables)
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                category: document.getElementById('category').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_email: 'tranvietkhoa2004@gmail.com',
                time_stamp: new Date().toLocaleString()
            };

            // 3. Send Email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values from EmailJS dashboard
            emailjs.send('service_hzlnfdo', 'template_d7rytc8', templateParams)
                .then(function () {
                    alert('Message sent successfully!');
                    contactForm.reset();
                    submitBtn.innerText = 'Message Sent';
                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, function (error) {
                    alert('Failed to send message: ' + JSON.stringify(error));
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
