document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    
});

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('loggedIn'); // Clear login flag
    location.reload(); // Reload the page to reset everything
});

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const verifyForm = document.getElementById('verify-form');
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('code');

    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-container');

    let userEmail = '';

    //send code to email
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        userEmail = emailInput.value.trim();

        try {
            const response = await fetch('http://localhost:3000/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });

            const data = await response.json();

            if (data.success) {
                alert(`Code sent to ${userEmail}`);
                loginForm.style.display = 'none';
                verifyForm.style.display = 'flex';
            } else {
                alert('Failed to send code. Try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Server error. Is your backend running?');
        }
    });

    //verify
    verifyForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const enteredCode = codeInput.value.trim();

        try {
            const response = await fetch('http://localhost:3000/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, code: enteredCode })
            });

            const data = await response.json();

            if (data.success) {
                //success
                localStorage.setItem('loggedIn', 'true');
                loginScreen.style.display = 'none';
                mainApp.style.display = 'flex';
            } else {
                alert('Invalid code. Try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Verification failed.');
        }
    });

    //already logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'flex';
    }
});
