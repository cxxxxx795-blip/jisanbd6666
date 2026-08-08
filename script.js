// ==================================================
// JISANBD6666
// Firebase + Login + Register + Deposit + Logout
// ==================================================

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


// ==================================================
// HELPER
// ==================================================

function showMessage(message) {
    alert(message);
}


// ==================================================
// LOGIN
// ==================================================

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const emailInput =
            document.querySelector("#loginEmail");

        const passwordInput =
            document.querySelector("#loginPassword");

        if (!emailInput || !passwordInput) {
            return;
        }

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (!email || !password) {

            showMessage(
                "❌ Email এবং Password দিন।"
            );

            return;
        }


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            showMessage(
                "✅ Login successful!"
            );


            /*
             * Login successful হওয়ার পরে
             * main website-এ যাবে।
             */

            window.location.replace(
                "index.html"
            );


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            let message =
                "❌ Login failed.";

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "❌ Email অথবা Password ভুল।";

            } else if (
                error.code ===
                "auth/user-not-found"
            ) {

                message =
                    "❌ এই Email দিয়ে কোনো account নেই।";

            } else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message =
                    "❌ Password ভুল।";

            }


            showMessage(message);

        }

    });

}



// ==================================================
// REGISTER
// ==================================================

const registerForm =
    document.querySelector("#registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nameInput =
                document.querySelector(
                    "#registerName"
                );


            const emailInput =
                document.querySelector(
                    "#registerEmail"
                );


            const mobileInput =
                document.querySelector(
                    "#registerMobile"
                );


            const passwordInput =
                document.querySelector(
                    "#registerPassword"
                );


            if (
                !nameInput ||
                !emailInput ||
                !mobileInput ||
                !passwordInput
            ) {

                return;

            }


            const name =
                nameInput.value.trim();


            const email =
                emailInput.value.trim();


            const mobile =
                mobileInput.value.trim();


            const password =
                passwordInput.value;


            if (
                !name ||
                !email ||
                !mobile ||
                !password
            ) {

                showMessage(
                    "❌ সব তথ্য পূরণ করুন।"
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "❌ Password কমপক্ষে ৬ অক্ষরের হতে হবে।"
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


                /*
                 * Firestore-এ profile save
                 */

                await addDoc(
                    collection(
                        db,
                        "users"
                    ),
                    {

                        uid: user.uid,

                        name: name,

                        email: email,

                        mobile: mobile,

                        balance: 0,

                        createdAt:
                            serverTimestamp()

                    }
                );


                showMessage(
                    "✅ Account successfully created!"
                );


                /*
                 * Register হওয়ার পরে
                 * Login page-এ যাবে।
                 */

                window.location.replace(
                    "login.html"
                );


            } catch (error) {

                console.error(
                    "Register Error:",
                    error
                );


                let message =
                    "❌ Registration failed.";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "❌ এই Email দিয়ে আগে থেকেই account আছে।";

                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "❌ সঠিক Email দিন।";

                } else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "❌ Password আরও শক্ত করুন।";

                }


                showMessage(message);

            }

        }
    );

}



// ==================================================
// SHOW LOGGED-IN USER EMAIL
// ==================================================

const userEmailElement =
    document.querySelector("#userEmail");


if (userEmailElement) {

    const currentUser =
        auth.currentUser;


    if (currentUser) {

        userEmailElement.textContent =
            currentUser.email;

    } else {

        /*
         * Firebase authentication state
         * load হওয়ার জন্য listener ব্যবহার।
         */

        auth.onAuthStateChanged(
            function (user) {

                if (user) {

                    userEmailElement.textContent =
                        user.email;

                } else {

                    /*
                     * Login না থাকলে
                     * login page-এ পাঠানো।
                     */

                    window.location.replace(
                        "login.html"
                    );

                }

            }
        );

    }

}



// ==================================================
// LOGOUT
// ==================================================

const logoutButton =
    document.querySelector("#logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);


                showMessage(
                    "✅ Logout successful!"
                );


                window.location.replace(
                    "login.html"
                );


            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                showMessage(
                    "❌ Logout failed."
                );

            }

        }
    );

}



// ==================================================
// DEPOSIT
// ==================================================

const depositForm =
    document.querySelector("#depositForm");


if (depositForm) {

    depositForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const amountInput =
                document.querySelector(
                    "#depositAmount"
                );


            const trxInput =
                document.querySelector(
                    "#transactionId"
                );


            if (
                !amountInput ||
                !trxInput
            ) {

                return;

            }


            const amount =
                Number(
                    amountInput.value
                );


            const trxId =
                trxInput.value.trim();


            if (
                !amount ||
                !trxId
            ) {

                showMessage(
                    "❌ Deposit Amount এবং Transaction ID দিন।"
                );

                return;

            }


            if (amount < 300) {

                showMessage(
                    "❌ Minimum deposit 300 TK."
                );

                return;

            }


            const user =
                auth.currentUser;


            if (!user) {

                showMessage(
                    "❌ আগে Login করুন।"
                );

                window.location.replace(
                    "login.html"
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

                        userId:
                            user.uid,

                        email:
                            user.email,

                        amount:
                            amount,

                        trxId:
                            trxId,

                        status:
                            "pending",

                        createdAt:
                            serverTimestamp()

                    }
                );


                showMessage(
                    "✅ Deposit Request Submitted!"
                );


                depositForm.reset();


            } catch (error) {

                console.error(
                    "Deposit Error:",
                    error
                );


                showMessage(
                    "❌ Deposit submit করা যায়নি।"
                );

            }

        }
    );

}



// ==================================================
// WITHDRAW
// ==================================================

const withdrawButton =
    document.querySelector(
        "#withdraw button"
    );


if (withdrawButton) {

    withdrawButton.addEventListener(
        "click",
        async function () {


            const numberInput =
                document.querySelector(
                    "#withdrawNumber"
                );


            const amountInput =
                document.querySelector(
                    "#withdrawAmount"
                );


            if (
                !numberInput ||
                !amountInput
            ) {

                return;

            }


            const number =
                numberInput.value.trim();


            const amount =
                Number(
                    amountInput.value
                );


            if (
                !number ||
                !amount
            ) {

                showMessage(
                    "❌ bKash Number এবং Amount দিন।"
                );

                return;

            }


            if (amount < 500) {

                showMessage(
                    "❌ Minimum withdraw 500 TK."
                );

                return;

            }


            const user =
                auth.currentUser;


            if (!user) {

                showMessage(
                    "❌ আগে Login করুন।"
                );

                window.location.replace(
                    "login.html"
                );

                return;

            }


            /*
             * এখানে শুধু request record
             * হিসেবে Firestore-এ save হচ্ছে।
             */

            try {

                await addDoc(
                    collection(
                        db,
                        "withdrawals"
                    ),
                    {

                        userId:
                            user.uid,

                        email:
                            user.email,

                        number:
                            number,

                        amount:
                            amount,

                        status:
                            "pending",

                        createdAt:
                            serverTimestamp()

                    }
                );


                showMessage(
                    "✅ Withdraw Request Submitted!"
                );


                numberInput.value = "";

                amountInput.value = "";


            } catch (error) {

                console.error(
                    "Withdraw Error:",
                    error
                );


                showMessage(
                    "❌ Withdraw request submit করা যায়নি।"
                );

            }

        }
    );

}



// ==================================================
// PAGE LOAD
// ==================================================

console.log(
    "🔥 JISANBD6666 Firebase system loaded successfully!"
);
