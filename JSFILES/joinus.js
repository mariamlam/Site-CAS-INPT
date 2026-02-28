document.addEventListener('DOMContentLoaded', () => {
    const joinForm = document.querySelector('form');

    joinForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the page from refreshing

        // 1. Basic Validation Check
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const dept = this.querySelector('select').value;

        if (dept === "Choose your department") {
            alert("Please select your department before submitting.");
            return;
        }

        // 2. Visual Feedback (Button Animation)
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Processing...`;

        // 3. Simulate "Sending" to a server
        setTimeout(() => {
            // Replace form with a success message
            const cardBody = document.querySelector('.card');
            cardBody.innerHTML = `
                <div class="text-center py-5 animate-success">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                    <h2 class="fw-bold mt-4">Welcome to the Family, ${name.split('')[0]}!</h2>
                    <p class="text-muted">Your application has been received. We will contact you at <strong>${email}</strong> very soon.</p>
                    <a href="index.html" class="btn btn-primary rounded-pill px-4 mt-3">Return Home</a>
                </div>
            `;
        }, 2000);
    });
});