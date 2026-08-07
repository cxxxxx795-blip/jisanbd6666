// ===============================
// JISANBD6666 Gaming Website
// script.js
// ===============================

// Welcome Message
window.addEventListener("load", function () {
    alert("🎮 Welcome to JISANBD6666");
});

// Deposit Form
const depositForm = document.querySelector(".deposit form");

if (depositForm) {
    depositForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const amount = depositForm.querySelector('input[type="number"]').value;
        const trx = depositForm.querySelector('input[type="text"]').value;

        if (amount === "" || trx === "") {
            alert("Please enter Deposit Amount and Transaction ID.");
            return;
        }

        localStorage.setItem("depositAmount", amount);
        localStorage.setItem("depositTrx", trx);

        alert("✅ Deposit Request Submitted Successfully!");

        depositForm.reset();
    });
}

// Withdraw Form
const withdrawForm = document.querySelector(".withdraw form");

if (withdrawForm) {
    withdrawForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const number = withdrawForm.querySelector('input[type="text"]').value;
        const amount = withdrawForm.querySelector('input[type="number"]').value;

        if (number === "" || amount === "") {
            alert("Please enter bKash Number and Amount.");
            return;
        }

        localStorage.setItem("withdrawNumber", number);
        localStorage.setItem("withdrawAmount", amount);

        alert("✅ Withdraw Request Submitted Successfully!");

        withdrawForm.reset();
    });
}

// Login Form
const loginForm = document.querySelector(".login form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("✅ Login Successful (Demo)");
    });
}

// Register Form
const registerForm = document.querySelector(".register form");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("✅ Registration Successful (Demo)");
    });
}

// Play Buttons
const playButtons = document.querySelectorAll(".game-card button");

playButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        alert("🎮 Game Coming Soon...");
    });
});

// Console Message
console.log("JISANBD6666 Loaded Successfully");
