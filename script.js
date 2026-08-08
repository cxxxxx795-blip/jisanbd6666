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


// ==========================================
// JISANBD6666 FIREBASE SYSTEM
// ==========================================

console.log("🔥 JISANBD6666 Firebase system loaded!");


// ==========================================
// REGISTER / CREATE ACCOUNT
// ==========================================

const registerForm = document.querySelector(".register form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");

        const name = inputs[0]?.value.trim();
        const email = inputs[1]?.value.trim();
        const mobile = inputs[2]?.value.trim();
        const password = inputs[3]?.value;

        // Check information
        if (!name || !email || !mobile || !password) {

            alert("❌ সব তথ্য পূরণ করুন।");
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


            // Success
            alert("✅ Account successfully created!");


            // Clear form
            registerForm.reset();


            // Go to login page
            window.location.href = "login.html";


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            if (error.code === "auth/email-already-in-use") {

                alert(
                    "❌ এই Email দিয়ে আগে থেকেই Account আছে।"
                );

            }

            else if (error.code === "auth/invalid-email") {

                alert(
                    "❌ সঠিক Email Address দিন।"
                );

            }

            else if (error.code === "auth/weak-password") {

                alert(
                    "❌ Password কমপক্ষে 6 characters হতে হবে।"
                );

            }

            else {

                alert(
                    "❌ Registration failed: " +
                    error.message
                );

            }

        }

    });

}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.querySelector(".login form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        const inputs =
            loginForm.querySelectorAll("input");


        const email =
            inputs[0]?.value.trim();


        const password =
            inputs[1]?.value;


        if (!email || !password) {

            alert(
                "❌ Email এবং Password দিন।"
            );

            return;

        }


        try {

            // Firebase login
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert(
                "✅ Login successful!"
            );


            loginForm.reset();


            // Go to main website
            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                alert(
                    "❌ Email অথবা Password ভুল।"
                );

            }

            else {

                alert(
                    "❌ Login failed: " +
                    error.message
                );

            }

        }

    });

}


// ==========================================
// DEPOSIT
// ==========================================

const depositForm =
    document.querySelector(".deposit form");


if (depositForm) {

    depositForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const amountInput =
                depositForm.querySelector(
                    'input[type="number"]'
                );


            const trxInput =
                depositForm.querySelector(
                    'input[type="text"]'
                );


            const amount =
                amountInput?.value;


            const trx =
                trxInput?.value.trim();


            if (!amount || !trx) {

                alert(
                    "❌ Deposit Amount এবং Transaction ID দিন।"
                );

                return;

            }


            // Current logged-in user
            const user =
                auth.currentUser;


            if (!user) {

                alert(
                    "❌ আগে Login করুন।"
                );

                window.location.href =
                    "login.html";

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

                        createdAt:
                            serverTimestamp()

                    }
                );


                alert(
                    "✅ Deposit Request Submitted!"
                );


                depositForm.reset();


            } catch (error) {

                console.error(
                    "Deposit error:",
                    error
                );


                alert(
                    "❌ Deposit submit করা যায়নি।"
                );

            }

        }
    );

}


// ==========================================
// WITHDRAW
// ==========================================

const withdrawForm =
    document.querySelector(".withdraw form");


if (withdrawForm) {

    withdrawForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const numberInput =
                withdrawForm.querySelector(
                    'input[type="text"]'
                );


            const amountInput =
                withdrawForm.querySelector(
                    'input[type="number"]'
                );


            const number =
                numberInput?.value.trim();


            const amount =
                amountInput?.value;


            if (!number || !amount) {

                alert(
                    "❌ bKash Number এবং Amount দিন।"
                );

                return;

            }


            // Current logged-in user
            const user =
                auth.currentUser;


            if (!user) {

                alert(
                    "❌ আগে Login করুন।"
                );

                window.location.href =
                    "login.html";

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

                        createdAt:
                            serverTimestamp()

                    }
                );


                alert(
                    "✅ Withdraw Request Submitted!"
                );


                withdrawForm.reset();


            } catch (error) {

                console.error(
                    "Withdraw error:",
                    error
                );


                alert(
                    "❌ Withdraw submit করা যায়নি।"
                );

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

window.logoutUser = async function () {

    try {

        await signOut(auth);


        alert(
            "✅ Logout successful!"
        );


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        alert(
            "❌ Logout failed."
        );

    }

};


// ==========================================
// GAME BUTTONS
// ==========================================

const playButtons =
    document.querySelectorAll(
        ".game-card button"
    );


playButtons.forEach(
    function (btn) {

        btn.addEventListener(
            "click",
            function () {

                alert(
                    "🎮 Game Coming Soon..."
                );

            }
        );

    }
);


// ==========================================
// REGISTER PAGE → LOGIN PAGE
// ==========================================

const loginLinks =
    document.querySelectorAll(
        'a[href="login.html"]'
    );


loginLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                window.location.href =
                    "login.html";

            }
        );

    }
);


// ==========================================
// LOGIN PAGE → HOME PAGE
// ==========================================

const homeLinks =
    document.querySelectorAll(
        'a[href="index.html"]'
    );


homeLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                window.location.href =
                    "index.html";

            }
        );

    }
);


// ==========================================
// FINISHED
// ==========================================

console.log(
    "✅ All JISANBD6666 functions loaded!"
);
