// ==================================================
// JISANBD6666
// FINAL SCRIPT
// Firebase + Auth + Wallet Requests + Games
// Virtual points only
// ==================================================

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


// ==================================================
// HELPERS
// ==================================================

function message(text) {
    alert(text);
}


function get(id) {
    return document.getElementById(id);
}


// ==================================================
// LOGIN
// ==================================================

const loginForm = get("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            get("loginEmail")?.value.trim();

        const password =
            get("loginPassword")?.value;

        if (!email || !password) {
            message("❌ Email এবং Password দিন।");
            return;
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            message("✅ Login successful!");

            window.location.replace("index.html");

        } catch (error) {

            console.error(error);

            message(
                "❌ Login failed: " +
                (error.code || "Unknown error")
            );
        }

    });

}


// ==================================================
// REGISTER
// ==================================================

const registerForm = get("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            get("registerName")?.value.trim();

        const email =
            get("registerEmail")?.value.trim();

        const mobile =
            get("registerMobile")?.value.trim();

        const password =
            get("registerPassword")?.value;

        if (!name || !email || !mobile || !password) {

            message(
                "❌ সব তথ্য পূরণ করুন।"
            );

            return;
        }

        if (password.length < 6) {

            message(
                "❌ Password কমপক্ষে ৬ অক্ষরের হতে হবে।"
            );

            return;
        }

        try {

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user =
                credential.user;


            await addDoc(
                collection(db, "users"),
                {
                    uid: user.uid,
                    name: name,
                    email: email,
                    mobile: mobile,
                    createdAt: serverTimestamp()
                }
            );


            message(
                "✅ Account successfully created!"
            );


            window.location.replace(
                "login.html"
            );


        } catch (error) {

            console.error(error);

            message(
                "❌ Registration failed: " +
                (error.code || "Unknown error")
            );

        }

    });

}


// ==================================================
// AUTH STATE
// ==================================================

onAuthStateChanged(
    auth,
    (user) => {

        const emailElement =
            get("userEmail");

        if (emailElement) {

            if (user) {

                emailElement.textContent =
                    user.email;

            } else {

                emailElement.textContent =
                    "Not logged in";

            }

        }

    }
);


// ==================================================
// LOGOUT
// ==================================================

const logoutButton =
    get("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                message(
                    "✅ Logout successful!"
                );

                window.location.replace(
                    "login.html"
                );

            } catch (error) {

                console.error(error);

                message(
                    "❌ Logout failed."
                );

            }

        }
    );

}


// ==================================================
// DEPOSIT REQUEST
// ==================================================

const depositForm =
    get("depositForm");

if (depositForm) {

    depositForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const amount =
                Number(
                    get("depositAmount")?.value
                );

            const trxId =
                get("transactionId")
                ?.value.trim();


            if (!amount || !trxId) {

                message(
                    "❌ Amount এবং Transaction ID দিন।"
                );

                return;
            }


            if (amount < 300) {

                message(
                    "❌ Minimum deposit 300 TK."
                );

                return;
            }


            const user =
                auth.currentUser;


            if (!user) {

                message(
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
                        userId: user.uid,
                        email: user.email,
                        amount: amount,
                        trxId: trxId,
                        status: "pending",
                        createdAt:
                            serverTimestamp()
                    }
                );


                message(
                    "✅ Deposit request submitted!"
                );


                depositForm.reset();


            } catch (error) {

                console.error(error);

                message(
                    "❌ Deposit request failed."
                );

            }

        }
    );

}


// ==================================================
// WITHDRAW REQUEST
// ==================================================

const withdrawButton =
    document.querySelector(
        "#withdraw button"
    );

if (withdrawButton) {

    withdrawButton.addEventListener(
        "click",
        async () => {

            const number =
                get("withdrawNumber")
                ?.value.trim();

            const amount =
                Number(
                    get("withdrawAmount")?.value
                );


            if (!number || !amount) {

                message(
                    "❌ Number এবং Amount দিন।"
                );

                return;
            }


            if (amount < 500) {

                message(
                    "❌ Minimum withdraw 500 TK."
                );

                return;
            }


            const user =
                auth.currentUser;


            if (!user) {

                message(
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
                        "withdrawals"
                    ),
                    {
                        userId: user.uid,
                        email: user.email,
                        number: number,
                        amount: amount,
                        status: "pending",
                        createdAt:
                            serverTimestamp()
                    }
                );


                message(
                    "✅ Withdraw request submitted!"
                );


                get("withdrawNumber").value = "";

                get("withdrawAmount").value = "";


            } catch (error) {

                console.error(error);

                message(
                    "❌ Withdraw request failed."
                );

            }

        }
    );

}


// ==================================================
// AVIATOR
// Virtual points only
// ==================================================

let aviatorBalance = 1000;

let aviatorRunning = false;

let aviatorMultiplier = 1;

let aviatorBetAmount = 0;

let aviatorCrashPoint = 0;

let aviatorTimer = null;


const aviatorStart =
    get("aviatorStart");

const aviatorCashout =
    get("aviatorCashout");

const multiplier =
    get("multiplier");

const aviatorStatus =
    get("aviatorStatus");

const virtualBalance =
    get("virtualBalance");

const aviatorBet =
    get("aviatorBet");

const plane =
    document.querySelector(".plane");


function updateAviatorBalance() {

    if (virtualBalance) {

        virtualBalance.textContent =
            Math.floor(aviatorBalance);

    }

}


function stopAviator() {

    aviatorRunning = false;

    if (aviatorTimer) {

        clearInterval(
            aviatorTimer
        );

        aviatorTimer = null;

    }

    if (aviatorStart) {

        aviatorStart.disabled = false;

    }

    if (aviatorCashout) {

        aviatorCashout.disabled = true;

    }

    if (plane) {

        plane.classList.remove(
            "flying"
        );

    }

}


function crashAviator() {

    if (!aviatorRunning) {
        return;
    }

    if (multiplier) {

        multiplier.textContent =
            aviatorMultiplier.toFixed(2)
            + "x";

    }

    if (aviatorStatus) {

        aviatorStatus.textContent =
            "💥 CRASHED at " +
            aviatorMultiplier.toFixed(2) +
            "x";

    }

    stopAviator();

}


if (aviatorStart) {

    aviatorStart.addEventListener(
        "click",
        () => {

            if (aviatorRunning) {
                return;
            }


            const bet =
                Number(
                    aviatorBet?.value
                );


            if (!bet || bet <= 0) {

                message(
                    "Enter a valid virtual bet."
                );

                return;
            }


            if (bet > aviatorBalance) {

                message(
                    "❌ Not enough virtual points."
                );

                return;
            }


            aviatorBetAmount = bet;

            aviatorBalance -= bet;

            updateAviatorBalance();


            aviatorMultiplier = 1;

            aviatorCrashPoint =
                1.30 +
                Math.random() * 5.70;

            aviatorRunning = true;


            if (multiplier) {

                multiplier.textContent =
                    "1.00x";

            }


            if (aviatorStatus) {

                aviatorStatus.textContent =
                    "✈️ Plane is flying...";

            }


            aviatorStart.disabled = true;

            aviatorCashout.disabled = false;


            if (plane) {

                plane.classList.remove(
                    "flying"
                );

                void plane.offsetWidth;

                plane.classList.add(
                    "flying"
                );

            }


            aviatorTimer =
                setInterval(
                    () => {

                        aviatorMultiplier +=
                            0.025 +
                            aviatorMultiplier *
                            0.012;


                        if (multiplier) {

                            multiplier.textContent =
                                aviatorMultiplier
                                .toFixed(2) +
                                "x";

                        }


                        if (
                            aviatorMultiplier >=
                            aviatorCrashPoint
                        ) {

                            crashAviator();

                        }

                    },
                    100
                );

        }
    );

}


if (aviatorCashout) {

    aviatorCashout.addEventListener(
        "click",
        () => {

            if (!aviatorRunning) {
                return;
            }


            const winnings =
                aviatorBetAmount *
                aviatorMultiplier;


            aviatorBalance += winnings;

            updateAviatorBalance();


            if (aviatorStatus) {

                aviatorStatus.textContent =
                    "🎉 CASHED OUT at " +
                    aviatorMultiplier.toFixed(2) +
                    "x";

            }


            stopAviator();

        }
    );

}


updateAviatorBalance();


// ==================================================
// SIMPLE PLAYABLE GAMES
// Virtual points only
// ==================================================

function playSlot() {

    const a =
        Math.floor(
            Math.random() * 9
        ) + 1;

    const b =
        Math.floor(
            Math.random() * 9
        ) + 1;

    const c =
        Math.floor(
            Math.random() * 9
        ) + 1;


    if (a === b && b === c) {

        message(
            `🎰 ${a} | ${b} | ${c}\n\nJACKPOT!`
        );

    } else if (
        a === b ||
        b === c ||
        a === c
    ) {

        message(
            `🎰 ${a} | ${b} | ${c}\n\nNice match!`
        );

    } else {

        message(
            `🎰 ${a} | ${b} | ${c}\n\nTry again!`
        );

    }

}


function playLuckySpin() {

    const prizes = [
        "⭐ 10 Points",
        "⭐ 25 Points",
        "⭐ 50 Points",
        "⭐ 100 Points",
        "🍀 Lucky!",
        "🎉 Bonus!"
    ];


    const result =
        prizes[
            Math.floor(
                Math.random() *
                prizes.length
            )
        ];


    message(
        "🎡 Lucky Spin\n\n" +
        result
    );

}


function playMines() {

    const safe =
        Math.floor(
            Math.random() * 80
        ) + 20;


    message(
        "💎 Mines\n\n" +
        "You found a safe tile!\n" +
        "Virtual score: " +
        safe
    );

}


function playBlackjack() {

    const player =
        Math.floor(
            Math.random() * 11
        ) + 11;

    const dealer =
        Math.floor(
            Math.random() * 11
        ) + 11;


    if (player > dealer) {

        message(
            "🃏 Blackjack\n\n" +
            "You: " + player +
            "\nDealer: " + dealer +
            "\n\nYou win!"
        );

    } else if (player === dealer) {

        message(
            "🃏 Blackjack\n\n" +
            "You: " + player +
            "\nDealer: " + dealer +
            "\n\nDraw!"
        );

    } else {

        message(
            "🃏 Blackjack\n\n" +
            "You: " + player +
            "\nDealer: " + dealer +
            "\n\nDealer wins!"
        );

    }

}


function playDice() {

    const dice =
        Math.floor(
            Math.random() * 6
        ) + 1;


    message(
        "🎲 Dice Roll\n\n" +
        "You rolled: " +
        dice
    );

}


function playLucky7() {

    const number =
        Math.floor(
            Math.random() * 13
        ) + 1;


    if (number === 7) {

        message(
            "7️⃣ Lucky 7!\n\n" +
            "You got 7! 🎉"
        );

    } else {

        message(
            "7️⃣ Number: " +
            number +
            "\n\nTry again!"
        );

    }

}


function playRocket() {

    const height =
        (
            1 +
            Math.random() * 9
        ).toFixed(2);


    message(
        "🚀 Rocket reached\n\n" +
        height +
        "x"
    );

}


function playCoinFlip() {

    const result =
        Math.random() < 0.5
            ? "HEADS 🟡"
            : "TAILS ⚪";


    message(
        "🪙 Coin Flip\n\n" +
        result
    );

}


function playColorGame() {

    const colors = [
        "RED 🔴",
        "BLUE 🔵",
        "GREEN 🟢",
        "YELLOW 🟡"
    ];


    const result =
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];


    message(
        "🎯 Color Result\n\n" +
        result
    );

}


// ==================================================
// GLOBAL FUNCTIONS
// ==================================================
//
// index.html-এর onclick থেকে functionগুলো
// ব্যবহার করার জন্য window-তে রাখা হয়েছে.
//

window.playSlot =
    playSlot;

window.playLuckySpin =
    playLuckySpin;

window.playMines =
    playMines;

window.playBlackjack =
    playBlackjack;

window.playDice =
    playDice;

window.playLucky7 =
    playLucky7;

window.playRocket =
    playRocket;

window.playCoinFlip =
    playCoinFlip;

window.playColorGame =
    playColorGame;


// ==================================================
// READY
// ==================================================

console.log(
    "🔥 JISANBD6666 loaded successfully."
);
