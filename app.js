document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const codeContainer = document.getElementById('code-container');
    const verifyButton = document.getElementById('verify-button');
    const authCodeInput = document.getElementById('auth-code');
    const loginContainer = document.getElementById('login-container');
    const mainApp = document.getElementById('main-app');

    let generatedCode = null;

    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value;
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Code sent to ${email}: ${generatedCode}`);
        alert(`Pretend we sent this code: ${generatedCode}`);
        codeContainer.style.display = 'block';
    });

    
    verifyButton.addEventListener('click', function () {
        const userCode = authCodeInput.value;
        if (userCode === generatedCode) {
            alert('Login successful!');
            loginContainer.style.display = 'none';
            mainApp.style.display = 'flex'; 
        } else {
            alert('Invalid code. Try again.');
        }
    });
});
