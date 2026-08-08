import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";


/* =====================================
   REGISTER
===================================== */

const registerForm = document.querySelector(".register form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const inputs =
            registerForm.querySelectorAll("input");

        const name =
            inputs[0].value.trim();

        const email =
            inputs[1].value.trim();

        const mobile =
            inputs[2].value.trim();

        const password =
            inputs[3].value;


        if (!name || !email || !mobile || !password) {

            alert("সব তথ্য পূরণ করুন।");

            return;
        }


        if (password.length < 6) {

            alert(
                "Password কমপক্ষে 6 characters হতে হবে।"
            );

            return;
        }


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            await setDoc(
                doc(db, "users", user.uid),
                {

                    uid: user.uid,

                    name: name,

                    email: email,

                    mobile: mobile,

                    balance: 0,

                    createdAt: serverTimestamp()

                }
            );


            registerForm.reset();


            alert(
                "✅ Account successfully created!"
            );


            /* Register সফল হলে Login-এ যাবে */

            const loginSection =
                document.querySelector("#login");

            if (loginSection) {

                setTimeout(function () {

                    loginSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }, 300);

            }


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                alert(
                    "❌ এই Email দিয়ে আগে থেকেই account আছে।"
                );

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                alert(
                    "❌ Valid Email Address দিন।"
                );

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

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


/* =====================================
   LOGIN
===================================== */

const loginForm =
    document.querySelector(".login form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const inputs =
                loginForm.querySelectorAll(
                    "input"
                );


            const email =
                inputs[0].value.trim();


            const password =
                inputs[1].value;


            if (!email || !password) {

                alert(
                    "Email এবং Password দিন।"
                );

                return;
            }


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                alert(
                    "✅ Login successful!"
                );


                loginForm.reset();


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                alert(
                    "❌ Login failed: Email অথবা Password ভুল।"
                );

            }

        }
    );

}


/* =====================================
   DEPOSIT
===================================== */

const depositForm =
    document.querySelector(".deposit form");


if (depositForm) {

    depositForm.addEventListener(
        "submit",
        async function (e) {

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


            if (Number(amount) < 300) {

                alert(
                    "❌ Minimum Deposit 300 TK."
                );

                return;
            }


            const user =
                auth.currentUser;


            if (!user) {

                alert(
                    "❌ আগে Login করুন।"
                );

                return;
            }


            try {

                await addDoc(
                    collection(
                        db,
                        "deposits"
                    ),
                    {

                        userId: user.uid,

                        email: user.email,

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
                    "DEPOSIT ERROR:",
                    error
                );


                alert(
                    "❌ Deposit submit করা যায়নি: " +
                    error.message
                );

            }

        }
    );

}


/* =====================================
   WITHDRAW
===================================== */

const withdrawForm =
    document.querySelector(
        ".withdraw form"
    );


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


            if (Number(amount) < 500) {

                alert(
                    "❌ Minimum Withdraw 500 TK."
                );

                return;
            }


            const user =
                auth.currentUser;


            if (!user) {

                alert(
                    "❌ আগে Login করুন।"
                );

                return;
            }


            try {

                await addDoc(
                    collection(
                        db,
                        "withdrawals"
                    ),
                    {

                        userId: user.uid,

                        email: user.email,

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
                    "WITHDRAW ERROR:",
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


/* =====================================
   LOGOUT
===================================== */

window.logoutUser =
    async function () {

        try {

            await signOut(auth);

            alert(
                "✅ Logout successful!"
            );

        } catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

            alert(
                "❌ Logout failed."
            );

        }

    };


/* =====================================
   GAME BUTTONS
===================================== */

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


/* =====================================
   SYSTEM READY
===================================== */

console.log(
    "🔥 JISANBD6666 Firebase system loaded successfully!"
);
