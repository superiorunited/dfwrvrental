document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Get form elements
    const bookingForm = document.querySelector('form[name="booking"]');
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    const rvType = document.getElementById('rv-type');
    const totalDaysElement = document.getElementById('total-days');
    const dailyRateElement = document.getElementById('daily-rate');
    const totalPriceElement = document.getElementById('total-price');
    const totalDaysHidden = document.getElementById('total-days-hidden');
    const dailyRateHidden = document.getElementById('daily-rate-hidden');
    const totalPriceHidden = document.getElementById('total-price-hidden');

    // Set minimum date to today
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    pickupDate.min = todayString;
    returnDate.min = todayString;

    // Get base price from RV type
    function getBasePrice(rvType) {
        const prices = {
            'towable': 130,
            'large-towable': 175,
            'midsize': 195,
            'sprinter': 285
        };
        return prices[rvType] || 130;
    }

    // Calculate pricing based on duration and RV type
    function calculatePrice(days, selectedRvType) {
        const baseRate = getBasePrice(selectedRvType);
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
        if (pickupDate.value && returnDate.value && rvType.value) {
            const start = new Date(pickupDate.value);
            const end = new Date(returnDate.value);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                const pricing = calculatePrice(diffDays, rvType.value);
                
                // Update visible elements
                totalDaysElement.textContent = diffDays;
                dailyRateElement.textContent = `$${pricing.dailyRate.toFixed(2)}`;
                totalPriceElement.textContent = `$${pricing.totalPrice.toFixed(2)}`;

                // Update hidden fields
                totalDaysHidden.value = diffDays;
                dailyRateHidden.value = pricing.dailyRate.toFixed(2);
                totalPriceHidden.value = pricing.totalPrice.toFixed(2);
            }
        }
    }

    // Event listeners
    pickupDate.addEventListener('change', function() {
        // Set minimum return date to pickup date
        returnDate.min = this.value;
        if (returnDate.value && returnDate.value < this.value) {
            returnDate.value = this.value;
        }
        updatePriceSummary();
    });

    returnDate.addEventListener('change', updatePriceSummary);
    rvType.addEventListener('change', updatePriceSummary);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
});
