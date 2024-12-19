document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Get form elements
    const bookingForm = document.getElementById('rv-booking-form');
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    const totalDaysElement = document.getElementById('total-days');
    const dailyRateElement = document.getElementById('daily-rate');
    const totalPriceElement = document.getElementById('total-price');

    // Set minimum date to today
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    pickupDate.min = todayString;
    returnDate.min = todayString;

    // Calculate pricing based on duration
    function calculatePrice(days) {
        const baseRate = 130;
        let dailyRate;

        if (days >= 7) {
            // 20% discount for 7+ days
            dailyRate = baseRate * 0.8;
        } else if (days >= 3) {
            // 10% discount for 3-5 days
            dailyRate = baseRate * 0.9;
        } else {
            dailyRate = baseRate;
        }

        return {
            dailyRate: dailyRate,
            totalPrice: dailyRate * days
        };
    }

    // Update price summary
    function updatePriceSummary() {
        if (pickupDate.value && returnDate.value) {
            const start = new Date(pickupDate.value);
            const end = new Date(returnDate.value);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                const pricing = calculatePrice(diffDays);
                
                totalDaysElement.textContent = diffDays;
                dailyRateElement.textContent = `$${pricing.dailyRate.toFixed(2)}`;
                totalPriceElement.textContent = `$${pricing.totalPrice.toFixed(2)}`;
            }
        }
    }

    // Event listeners
    pickupDate.addEventListener('change', function() {
        // Set minimum return date to pickup date
        returnDate.min = this.value;
        updatePriceSummary();
    });

    returnDate.addEventListener('change', updatePriceSummary);

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to a server
        alert('Thank you for your booking request! We will contact you shortly to confirm your reservation.');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu functionality
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    console.log('Menu button:', menuBtn);
    console.log('Mobile menu:', mobileMenu);

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu button clicked');
            mobileMenu.classList.toggle('active');
            console.log('Menu active:', mobileMenu.classList.contains('active'));
        });

        // Close menu when clicking a link
        const menuLinks = document.querySelectorAll('.mobile-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-nav') && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    } else {
        console.log('Menu elements not found');
    }
});
