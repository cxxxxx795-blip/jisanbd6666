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


// ===============================
// JISANBD6666 Firebase System
// ===============================


// ===============================
// REGISTER
// ===============================

const registerForm = document.querySelector(".register form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");

        // তোমার বর্তমান form:
        // Full Name
        // Username
        // Mobile Number
        // Password

        const name = inputs[0].value.trim();
        const username = inputs[1].value.trim();
        const mobile = inputs[2].value.trim();
        const password = inputs[3].value;

        if (!name || !username || !mobile || !password) {
            alert("সব তথ্য পূরণ করুন।");
            return;
        }

        // Firebase Email/Password Authentication-এর জন্য
        // username + একটি demo email তৈরি করছি
        const email = username + "@jisanbd6666.com";

        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            // Firestore-এ user profile
            await addDoc(collection(db, "users"), {

                uid: user.uid,

                name: name,

                username: username,

                mobile: mobile,

                email: email,

                balance: 0,

                createdAt: serverTimestamp()

            });

            alert("✅ Account successfully created!");

            registerForm.reset();

        } catch (error) {

            console.error(error);

            alert("❌ Registration failed: " + error.message);

        }

    });

}


// ===============================
// LOGIN
// ===============================

const loginForm = document.querySelector(".login form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const inputs = loginForm.querySelectorAll("input");

        const username = inputs[0].value.trim();
        const password = inputs[1].value;

        if (!username || !password) {

            alert("Username এবং Password দিন।");

            return;
        }

        const email = username + "@jisanbd6666.com";

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("✅ Login successful!");

            loginForm.reset();

        } catch (error) {

            console.error(error);

            alert("❌ Login failed: Username অথবা Password ভুল।");

        }

    });

}


// ===============================
// DEPOSIT
// ===============================

const depositForm = document.querySelector(".deposit form");

if (depositForm) {

    depositForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const amount =
            depositForm.querySelector(
                'input[type="number"]'
            ).value;

        const trx =
            depositForm.querySelector(
                'input[type="text"]'
            ).value.trim();

        if (!amount || !trx) {

            alert(
                "Deposit Amount এবং Transaction ID দিন।"
            );

            return;
        }

        const user = auth.currentUser;

        if (!user) {

            alert("❌ আগে Login করুন।");

            return;
        }

        try {

            await addDoc(
                collection(db, "deposits"),
                {

                    userId: user.uid,

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

            console.error(error);

            alert(
                "❌ Deposit submit করা যায়নি।"
            );

        }

    });

}


// ===============================
// WITHDRAW
// ===============================

const withdrawForm =
    document.querySelector(".withdraw form");

if (withdrawForm) {

    withdrawForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const number =
                withdrawForm.querySelector(
                    'input[type="text"]'
                ).value.trim();

            const amount =
                withdrawForm.querySelector(
                    'input[type="number"]'
                ).value;

            if (!number || !amount) {

                alert(
                    "bKash Number এবং Amount দিন।"
                );

                return;
            }

            const user = auth.currentUser;

            if (!user) {

                alert("❌ আগে Login করুন।");

                return;
            }

            try {

                await addDoc(
                    collection(db, "withdrawals"),
                    {

                        userId: user.uid,

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

                console.error(error);

                alert(
                    "❌ Withdraw submit করা যায়নি।"
                );

            }

        }
    );

}


// ===============================
// LOGOUT FUNCTION
// ===============================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        alert("✅ Logout successful!");

    } catch (error) {

        console.error(error);

        alert("Logout failed.");

    }

};


// ===============================
// GAME BUTTONS
// ===============================

const playButtons =
    document.querySelectorAll(
        ".game-card button"
    );

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


// ===============================
// PAGE LOAD
// ===============================

console.log(
    "🔥 JISANBD6666 Firebase system loaded!"
);
