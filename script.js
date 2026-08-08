// ===============================
// IMPORT FIREBASE
// ===============================

import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";


// ===============================
// CREATE ACCOUNT
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const mobile = document.getElementById("registerMobile").value.trim();
        const password = document.getElementById("registerPassword").value;

        if (!name || !email || !mobile || !password) {
            alert("⚠️ সব তথ্য পূরণ করুন।");
            return;
        }

        if (password.length < 6) {
            alert("⚠️ Password কমপক্ষে 6 অক্ষরের হতে হবে।");
            return;
        }

        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;


            // Save user information in Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                email: email,
                mobile: mobile,
                createdAt: serverTimestamp()
            });


            alert("✅ Account successfully created!");

            // Registration শেষে Login page
            window.location.href = "login.html";


        } catch (error) {

            console.error(error);

            if (error.code === "auth/email-already-in-use") {

                alert("❌ এই Email দিয়ে আগে থেকেই Account আছে।");

            } else if (error.code === "auth/invalid-email") {

                alert("❌ Email ঠিক নয়।");

            } else if (error.code === "auth/weak-password") {

                alert("❌ Password খুব দুর্বল।");

            } else {

                alert("❌ Registration failed: " + error.message);

            }

        }

    });

}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {

            alert("⚠️ Email এবং Password দিন।");
            return;

        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert("✅ Login successful!");

            // Login সফল হলে Home page
            window.location.href = "index.html";


        } catch (error) {

            console.error(error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {

                alert("❌ Email অথবা Password ভুল।");

            } else {

                alert("❌ Login failed: " + error.message);

            }

        }

    });

}


// ===============================
// LOGOUT
// ===============================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        try {

            await signOut(auth);

            alert("✅ Logout successful!");

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert("❌ Logout failed.");

        }

    });

}


// ===============================
// CHECK LOGIN STATUS
// ===============================

onAuthStateChanged(auth, function (user) {

    const currentPage =
        window.location.pathname.split("/").pop();


    // Home page হলে login ছাড়া ঢুকতে দেবে না
    if (
        currentPage === "index.html" &&
        !user
    ) {

        window.location.href = "login.html";

        return;
    }


    // Login page-এ already login করা থাকলে
    // Home page-এ পাঠাবে
    if (
        currentPage === "login.html" &&
        user
    ) {

        window.location.href = "index.html";

        return;
    }


    // User logged in
    if (user) {

        const userEmail =
            document.getElementById("userEmail");

        if (userEmail) {
            userEmail.textContent = user.email;
        }

    }

});


// ===============================
// DEPOSIT
// ===============================

const depositForm =
    document.getElementById("depositForm");

if (depositForm) {

    depositForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const user = auth.currentUser;

        if (!user) {

            alert("⚠️ আগে Login করুন।");

            window.location.href = "login.html";

            return;
        }


        const amount =
            document.getElementById("depositAmount").value.trim();

        const trx =
            document.getElementById("transactionId").value.trim();


        if (!amount || !trx) {

            alert("⚠️ Amount এবং Transaction ID দিন।");

            return;
        }


        try {

            await addDoc(collection(db, "deposits"), {

                userId: user.uid,

                email: user.email,

                amount: Number(amount),

                transactionId: trx,

                status: "Pending",

                createdAt: serverTimestamp()

            });


            alert("✅ Deposit request submitted!");

            depositForm.reset();

        } catch (error) {

            console.error(error);

            alert("❌ Deposit failed: " + error.message);

        }

    });

}
