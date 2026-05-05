const API = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const joinForm = document.querySelector('form');

    joinForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name       = this.querySelector('input[type="text"]').value.trim();
        const email      = this.querySelector('input[type="email"]').value.trim();
        const dept       = this.querySelector('select').value;
        const motivation = this.querySelector('textarea').value.trim();

        if (dept === 'Choose your department') {
            alert('Please select your department before submitting.');
            return;
        }

        const submitBtn     = this.querySelector('button[type="submit"]');
        submitBtn.disabled  = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Processing...`;

        try {
            const res  = await fetch(`${API}/join`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, department: dept, motivation }),
            });
            const json = await res.json();

            if (json.success) {
                document.querySelector('.card').innerHTML = `
                    <div class="text-center py-5 animate-success">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                        <h2 class="fw-bold mt-4">Welcome to the Family, ${name.split(' ')[0]}!</h2>
                        <p class="text-muted">Your application has been received. We will contact you at <strong>${email}</strong> very soon.</p>
                        <a href="index.html" class="btn btn-primary rounded-pill px-4 mt-3">Return Home</a>
                    </div>
                `;
            } else {
                // Show the specific error (e.g. duplicate email, validation)
                const msg = json.message || json.errors?.[0]?.msg || 'Something went wrong.';
                alert(msg);
                submitBtn.disabled  = false;
                submitBtn.innerHTML = 'Submit Application';
            }
        } catch (err) {
            alert('Server error — is the backend running?');
            submitBtn.disabled  = false;
            submitBtn.innerHTML = 'Submit Application';
        }
    });
});