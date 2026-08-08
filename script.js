import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";


// ========================================
// JISANBD6666 - FULL FIREBASE SCRIPT
// ========================================


// ========================================
// REGISTER / CREATE ACCOUNT
// ========================================

const registerForm = document.querySelector(".register form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");

        const name = inputs[0]?.value.trim();
        const email = inputs[1]?.value.trim();
        const mobile = inputs[2]?.value.trim();
        const password = inputs[3]?.value;

        if (!name || !email || !mobile || !password) {

            alert("❌ সব তথ্য পূরণ করুন।");
            return;

        }

        if (password.length < 6) {

            alert("❌ Password কমপক্ষে 6 characters হতে হবে।");
            return;

        }

        try {

            // Firebase account create
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            // Firestore user profile
            await addDoc(
                collection(db, "users"),
                {

                    uid: user.uid,

                    name: name,

                    email: email,

                    mobile: mobile,

                    balance: 0,

                    createdAt: serverTimestamp()

                }
            );

            alert("✅ Account successfully created!");

            registerForm.reset();

            // Registration এর পর Login page
            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration Error:", error);

            if (error.code === "auth/email-already-in-use") {

                alert("❌ এই Email দিয়ে আগে থেকেই account আছে।");

            } else if (error.code === "auth/invalid-email") {

                alert("❌ সঠিক Email address দিন।");

            } else if (error.code === "auth/weak-password") {

                alert("❌ Password আরও শক্ত করুন।");

            } else {

                alert(
                    "❌ Registration failed: " +
                    error.message
                );

            }

        }

    });

}


// ========================================
// LOGIN
// ========================================

const loginForm = document.querySelector(".login form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const inputs = loginForm.querySelectorAll("input");

        const email = inputs[0]?.value.trim();
        const password = inputs[1]?.value;

        if (!email || !password) {

            alert("❌ Email এবং Password দিন।");
            return;

        }

        try {

            // Firebase Login
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("✅ Login successful!");

            loginForm.reset();

            // Login successful → Main website
            window.location.href = "index.html";

        } catch (error) {

            console.error("Login Error:", error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {

                alert(
                    "❌ Email অথবা Password ভুল।"
                );

            } else if (error.code === "auth/invalid-email") {

                alert("❌ সঠিক Email address দিন।");

            } else {

                alert(
                    "❌ Login failed: " +
                    error.message
                );

            }

        }

    });

}


// ========================================
// DEPOSIT
// ========================================

const depositForm = document.querySelector(".deposit form");

if (depositForm) {

    depositForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const amountInput =
            depositForm.querySelector('input[type="number"]');

        const textInputs =
            depositForm.querySelectorAll('input[type="text"]');

        const amount =
            amountInput ? amountInput.value : "";

        const trx =
            textInputs.length > 0
                ? textInputs[0].value.trim()
                : "";

        if (!amount || !trx) {

            alert(
                "❌ Deposit Amount এবং Transaction ID দিন।"
            );

            return;

        }

        const user = auth.currentUser;

        if (!user) {

            alert("❌ আগে Login করুন।");

            window.location.href = "login.html";

            return;

        }

        try {

            await addDoc(
                collection(db, "deposits"),
                {

                    userId: user.uid,

                    email: user.email,

                    amount: Number(amount),

                    trxId: trx,

                    status: "pending",

                    createdAt: serverTimestamp()

                }
            );

            alert(
                "✅ Deposit Request Submitted!"
            );

            depositForm.reset();

        } catch (error) {

            console.error("Deposit Error:", error);

            alert(
                "❌ Deposit submit করা যায়নি: " +
                error.message
            );

        }

    });

}


// ========================================
// WITHDRAW
// ========================================

const withdrawForm =
    document.querySelector(".withdraw form");

if (withdrawForm) {

    withdrawForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const inputs =
                withdrawForm.querySelectorAll("input");

            let number = "";
            let amount = "";

            inputs.forEach(function (input) {

                if (input.type === "number") {

                    amount = input.value;

                } else if (input.type === "text") {

                    number = input.value.trim();

                }

            });

            if (!number || !amount) {

                alert(
                    "❌ bKash Number এবং Amount দিন।"
                );

                return;

            }

            const user = auth.currentUser;

            if (!user) {

                alert("❌ আগে Login করুন।");

                window.location.href = "login.html";

                return;

            }

            try {

                await addDoc(
                    collection(db, "withdrawals"),
                    {

                        userId: user.uid,

                        email: user.email,

                        number: number,

                        amount: Number(amount),

                        status: "pending",

                        createdAt: serverTimestamp()

                    }
                );

                alert(
                    "✅ Withdraw Request Submitted!"
                );

                withdrawForm.reset();

            } catch (error) {

                console.error(
                    "Withdraw Error:",
                    error
                );

                alert(
                    "❌ Withdraw submit করা যায়নি: " +
                    error.message
                );

            }

        }
    );

}


// ========================================
// LOGOUT
// ========================================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        alert("✅ Logout successful!");

        window.location.href = "login.html";

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

        alert(
            "❌ Logout failed: " +
            error.message
        );

    }

};


// ========================================
// GAME BUTTONS
// ========================================

const playButtons =
    document.querySelectorAll(".game-card button");

playButtons.forEach(function (btn) {

    btn.addEventListener(
        "click",
        function () {

            alert(
                "🎮 Game Coming Soon..."
            );

        }
    );

});


// ========================================
// PAGE LOAD
// ========================================

console.log(
    "🔥 JISANBD6666 Firebase system loaded successfully!"
);
