document.addEventListener("DOMContentLoaded", () => {
    initializePage();
});

/* =========================================================
   BACKGROUNDS
========================================================= */

function applyBackgrounds() {
    const backgrounds = {
        ".hero": "./assests/images/hero.jpg",
        ".news": "./assests/images/news-bg.jpg",
        ".grid": "./assests/images/grid-bg.jpg",
        ".cta": "./assests/images/cta-bg.jpg",
        ".register": "./assests/images/register-bg.jpg",
        "footer": "./assests/images/footer-bg.jpg"
    };

    Object.entries(backgrounds).forEach(([selector, image]) => {
        document.querySelectorAll(selector).forEach(element => {
            element.style.backgroundImage = `url("${image}")`;
        });
    });
}

/* =========================================================
   PASSWORD
========================================================= */

function initializePassword() {
    const passwordInput = document.querySelector("#parol");
    const toggle = document.querySelector("#togglePassword");

    if (!passwordInput || !toggle) return;

    if (toggle.dataset.ready === "true") return;

    toggle.dataset.ready = "true";

    toggle.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        toggle.textContent = isPassword ? "🙈" : "👁";

        toggle.setAttribute(
            "aria-label",
            isPassword
                ? "Parolni yashirish"
                : "Parolni ko‘rsatish"
        );
    });
}

/* =========================================================
   NOTIFICATION
========================================================= */

function createNotification() {
    let notification = document.querySelector("#notification");

    if (notification) return notification;

    notification = document.createElement("div");

    notification.id = "notification";

    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.zIndex = "99999";
    notification.style.padding = "15px 20px";
    notification.style.borderRadius = "10px";
    notification.style.color = "#fff";
    notification.style.fontWeight = "600";
    notification.style.display = "none";
    notification.style.maxWidth = "350px";
    notification.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.25)";

    document.body.appendChild(notification);

    return notification;
}

function showNotification(message, type = "success") {
    const notification = createNotification();

    notification.textContent = message;

    notification.style.display = "block";

    if (type === "success") {
        notification.style.background = "#16a34a";
    } else {
        notification.style.background = "#dc2626";
    }

    setTimeout(() => {
        notification.style.display = "none";
    }, 4000);
}

/* =========================================================
   REGISTER FORM
========================================================= */

function initializeTelegramForm() {
    const form = document.querySelector("#registerForm");

    if (!form) return;

    if (form.dataset.telegramReady === "true") return;

    form.dataset.telegramReady = "true";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton =
            form.querySelector('button[type="submit"]');

        try {
            /* ---------------------------------------------
               INPUTLAR
            --------------------------------------------- */

            const ism =
                form.querySelector('[name="ism"]')?.value.trim() || "";

            const sana =
                form.querySelector('[name="sana"]')?.value || "";

            const email =
                form.querySelector('[name="email"]')?.value.trim() || "";

            const parol =
                form.querySelector('[name="parol"]')?.value || "";

            const tel =
                form.querySelector('[name="tel"]')?.value.trim() || "";

            const jamoa =
                form.querySelector('[name="jamoa"]')?.value.trim() || "";

            const davlat =
                form.querySelector('[name="davlat"]')?.value.trim() || "";

            const liga =
                form.querySelector('[name="liga"]')?.value.trim() || "";

            const pozitsiya =
                form.querySelector('[name="pozitsiya"]')?.value.trim() || "";

            const futbolchi =
                form.querySelector('[name="futbolchi"]')?.value.trim() || "";

            const info =
                form.querySelector('[name="info"]')?.value.trim() || "";

            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!ism) {
                showNotification(
                    "Ism familiyangizni kiriting.",
                    "error"
                );
                return;
            }

            if (!parol) {
                showNotification(
                    "Parol kiriting.",
                    "error"
                );
                return;
            }

            if (!tel) {
                showNotification(
                    "Telefon raqamingizni kiriting.",
                    "error"
                );
                return;
            }

            // +998901234567
            const phonePattern = /^\+998[0-9]{9}$/;

            if (!phonePattern.test(tel)) {
                showNotification(
                    "Telefon raqami +998901234567 ko‘rinishida bo‘lishi kerak.",
                    "error"
                );
                return;
            }

            if (!info) {
                showNotification(
                    "Qo‘shimcha ma'lumot maydonini to‘ldiring.",
                    "error"
                );
                return;
            }

            /* ---------------------------------------------
               BUTTON
            --------------------------------------------- */

            if (submitButton) {
                submitButton.disabled = true;

                submitButton.dataset.originalText =
                    submitButton.textContent;

                submitButton.textContent =
                    "Yuborilmoqda...";
            }

            /* ---------------------------------------------
               DATA
            --------------------------------------------- */

            const data = {
                ism,
                sana,
                email,
                parol,
                tel,
                jamoa,
                davlat,
                liga,
                pozitsiya,
                futbolchi,
                info
            };

            /* ---------------------------------------------
               SERVERGA YUBORISH
            --------------------------------------------- */

            const response = await fetch("/register", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });

            /* ---------------------------------------------
               RESPONSE
            --------------------------------------------- */

            const responseText =
                await response.text();

            let result = {};

            try {
                result = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch (jsonError) {
                console.error(
                    "Server JSON qaytarmadi:",
                    responseText
                );

                throw new Error(
                    "Serverdan noto‘g‘ri javob keldi."
                );
            }

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Ro‘yxatdan o‘tishda xatolik yuz berdi."
                );
            }

            /* ---------------------------------------------
               SUCCESS
            --------------------------------------------- */

            showNotification(
                result.message ||
                "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!",
                "success"
            );

            form.reset();

            const modalToggle =
                document.querySelector("#registerModalToggle");

            if (modalToggle) {
                modalToggle.checked = false;
            }

        } catch (error) {
            console.error(
                "Register error:",
                error
            );

            showNotification(
                error.message ||
                "Server bilan bog‘lanishda xatolik yuz berdi.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                submitButton.textContent =
                    submitButton.dataset.originalText ||
                    "Tasdiqlash";
            }
        }
    });
}

/* =========================================================
   NEWS
========================================================= */

function initializeNews() {
    const newsItems =
        document.querySelectorAll(".news-card");

    newsItems.forEach((item, index) => {
        item.style.animationDelay =
            `${index * 0.1}s`;
    });
}

/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {
    const links =
        document.querySelectorAll(
            'a[data-page], a[href$=".html"]'
        );

    links.forEach(link => {

        if (link.dataset.navigationReady === "true") {
            return;
        }

        link.dataset.navigationReady = "true";

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (!href) return;

            if (
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("#") ||
                link.target === "_blank"
            ) {
                return;
            }

            if (!href.endsWith(".html")) {
                return;
            }

            event.preventDefault();

            loadPage(href);
        });
    });
}

/* =========================================================
   LOAD PAGE
========================================================= */

async function loadPage(url) {
    try {
        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Sahifani yuklab bo‘lmadi."
            );
        }

        const html =
            await response.text();

        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                html,
                "text/html"
            );

        const newMain =
            doc.querySelector("main");

        const currentMain =
            document.querySelector("main");

        if (newMain && currentMain) {
            currentMain.innerHTML =
                newMain.innerHTML;
        }

        const newTitle =
            doc.querySelector("title");

        if (newTitle) {
            document.title =
                newTitle.textContent;
        }

        window.history.pushState(
            {},
            "",
            url
        );

        initializePage();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(
            "Page load error:",
            error
        );

        window.location.href = url;
    }
}

/* =========================================================
   INITIALIZE
========================================================= */

function initializePage() {
    applyBackgrounds();
    initializePassword();
    initializeTelegramForm();
    initializeNews();
    initializeNavigation();
}

/* =========================================================
   BACK BUTTON
========================================================= */

window.addEventListener("popstate", () => {
    window.location.reload();
});