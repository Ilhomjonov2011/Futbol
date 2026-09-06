document.addEventListener("DOMContentLoaded", () => {
    initializePage();
});

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

function initializePassword() {
    const passwordInput = document.querySelector("#password");
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
            isPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"
        );
    });
}

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
    notification.style.boxShadow = "0 5px 20px rgba(0,0,0,0.25)";

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

function initializeTelegramForm() {
    const form = document.querySelector("#registerForm");
    if (!form) return;
    if (form.dataset.telegramReady === "true") return;
    form.dataset.telegramReady = "true";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');

        try {
            const ism = form.querySelector('[name="ism"]')?.value.trim() || "";
            const sana = form.querySelector('[name="sana"]')?.value || "";
            const email = form.querySelector('[name="email"]')?.value.trim() || "";
            const parol = form.querySelector('[name="parol"]')?.value || "";
            const tel = form.querySelector('[name="tel"]')?.value.trim() || "";
            const jamoa = form.querySelector('[name="jamoa"]')?.value.trim() || "";
            const davlat = form.querySelector('[name="davlat"]')?.value.trim() || "";
            const liga = form.querySelector('[name="liga"]')?.value.trim() || "";
            const pozitsiya = form.querySelector('[name="pozitsiya"]')?.value.trim() || "";
            const futbolchi = form.querySelector('[name="futbolchi"]')?.value.trim() || "";
            const info = form.querySelector('[name="info"]')?.value.trim() || "";

            if (!ism) {
                showNotification("Ism familiyangizni kiriting.", "error");
                return;
            }

            if (!parol) {
                showNotification("Parol kiriting.", "error");
                return;
            }

            if (!tel) {
                showNotification("Telefon raqamingizni kiriting.", "error");
                return;
            }

            const phonePattern = /^\+998[0-9]{9}$/;
            if (!phonePattern.test(tel)) {
                showNotification("Telefon raqami +998901234567 ko‘rinishida bo‘lishi kerak.", "error");
                return;
            }

            if (!info) {
                showNotification("Qo‘shimcha ma'lumot maydonini to‘ldiring.", "error");
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.dataset.originalText = submitButton.textContent;
                submitButton.textContent = "Yuborilmoqda...";
            }

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

            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            let result = {};

            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch (jsonError) {
                console.error("Server JSON qaytarmadi:", responseText);
                throw new Error("Serverdan noto‘g‘ri javob keldi.");
            }

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi.");
            }

            showNotification(result.message || "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!", "success");
            form.reset();

            const modalToggle = document.querySelector("#registerModalToggle");
            if (modalToggle) {
                modalToggle.checked = false;
            }

        } catch (error) {
            console.error("Register error:", error);
            showNotification(error.message || "Server bilan bog‘lanishda xatolik yuz berdi.", "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset.originalText || "Tasdiqlash";
            }
        }
    });
}

function initializePage() {
    applyBackgrounds();
    initializePassword();
    initializeTelegramForm();
}