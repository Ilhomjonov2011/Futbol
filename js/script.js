document.addEventListener("DOMContentLoaded", () => {
    initializePage();
});

/* =========================================================
   ESKI JS
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

function initializeMobileMenu() {
    const toggle = document.querySelector("#menuToggle");
    if (!toggle) return;
    if (toggle.dataset.menuReady === "true") return;
    toggle.dataset.menuReady = "true";

    const closeMenu = () => {
        toggle.checked = false;
    };

    document.querySelectorAll(".mobile-menu-link").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && toggle.checked) {
            closeMenu();
        }
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

            showNotification(
                result.message || "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!",
                "success"
            );

            form.reset();

            const modalToggle = document.querySelector("#registerModalToggle");
            if (modalToggle) {
                modalToggle.checked = false;
            }
        } catch (error) {
            console.error("Register error:", error);
            showNotification(
                error.message || "Server bilan bog‘lanishda xatolik yuz berdi.",
                "error"
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    submitButton.dataset.originalText || "Tasdiqlash";
            }
        }
    });
}

const MEDIA_BASE = "./assests/medias/";
const media = (file) => encodeURI(MEDIA_BASE + file);

const KIND_LABELS = {
    info: "Futbolchi haqida",
    goals: "Gollari"
};

function makeVideos(slug, fallback) {
    return [
        {
            kind: "info",
            title: "Hayoti va karyerasi",
            quality: "4K",
            src: media(`4k/${slug}-info-4K.mp4`),
            fallback
        },
        {
            kind: "goals",
            title: "Eng yaxshi gollari",
            quality: "8K",
            src: media(`8k/${slug}-goals-8K.mp4`),
            fallback
        }
    ];
}

const PLAYERS = {
    ronaldo: {
        match: "ronaldo",
        name: "Cristiano Ronaldo",
        flag: "🇵🇹",
        text: "Portugaliyalik hujumchi. Tezligi, zarba kuchi va bosh bilan gol urishdagi mahorati uni futbol tarixining eng samarali to‘purarlaridan biriga aylantirgan.",
        facts: [
            ["Tug‘ilgan yili", "1985"],
            ["Davlat", "Portugaliya"],
            ["Pozitsiya", "Hujumchi"],
            ["Asosiy yutuq", "5 ta Oltin to‘p, Yevro-2016"]
        ],
        videos: makeVideos("Ronaldo", media("CR7.mp4"))
    },
    messi: {
        match: "messi",
        name: "Lionel Messi",
        flag: "🇦🇷",
        text: "Argentinalik hujumchi. Yaqin dribling, aniq uzatma va sovuqqonlik bilan mashhur. 2022-yilda Argentina bilan Jahon chempioni bo‘lgan.",
        facts: [
            ["Tug‘ilgan yili", "1987"],
            ["Davlat", "Argentina"],
            ["Pozitsiya", "Hujumchi"],
            ["Asosiy yutuq", "8 ta Oltin to‘p, Jahon chempionati 2022"]
        ],
        videos: makeVideos("Messi", media("Messi.mp4"))
    },
    pele: {
        match: "pele",
        name: "Pele (Edson Arantes)",
        flag: "🇧🇷",
        text: "Braziliyalik afsonaviy hujumchi. 1958-yilda 17 yoshida Jahon chempioni bo‘lib, musobaqa tarixidagi eng yosh g‘olib bo‘lgan.",
        facts: [
            ["Yillari", "1940 – 2022"],
            ["Davlat", "Braziliya"],
            ["Pozitsiya", "Hujumchi"],
            ["Asosiy yutuq", "3 ta Jahon chempionati (1958, 1962, 1970)"]
        ],
        videos: makeVideos("Pele", null)
    },
    neymar: {
        match: "neymar",
        name: "Neymar Jr.",
        flag: "🇧🇷",
        text: "Braziliyalik hujumchi. Chaqqon dribling, kutilmagan hiylalar va ijodiy o‘yin uslubi bilan muxlislar sevimlisiga aylangan.",
        facts: [
            ["Tug‘ilgan yili", "1992"],
            ["Davlat", "Braziliya"],
            ["Pozitsiya", "Hujumchi"],
            ["Asosiy yutuq", "Olimpiada oltin medali (2016)"]
        ],
        videos: makeVideos("Neymar", media("Neymar Jr.mp4"))
    },
    maradona: {
        match: "maradona",
        name: "Diego Maradona",
        flag: "🇦🇷",
        text: "Argentinalik yarim himoyachi va hujumchi. 1986-yilgi Jahon chempionatida jamoani g‘alabaga yetaklab, Angliyaga qarshi “Asr goli” bilan tarixga kirgan.",
        facts: [
            ["Yillari", "1960 – 2020"],
            ["Davlat", "Argentina"],
            ["Pozitsiya", "Hujumchi va yarim himoyachi"],
            ["Asosiy yutuq", "Jahon chempionati 1986"]
        ],
        videos: makeVideos("Maradona", null)
    },
    debruyne: {
        match: "bruyne",
        name: "Kevin De Bruyne",
        flag: "🇧🇪",
        text: "Belgiyalik yarim himoyachi. Aniq uzatmalari, o‘yinni o‘qish qobiliyati va uzoqdan zarbalari bilan mashhur.",
        facts: [
            ["Tug‘ilgan yili", "1991"],
            ["Davlat", "Belgiya"],
            ["Pozitsiya", "Yarim himoyachi"],
            ["Asosiy yutuq", "Chempionlar ligasi (2023)"]
        ],
        videos: makeVideos("DeBruyne", media("Kevin.mp4"))
    },
    mbappe: {
        match: "mbapp",
        name: "Kylian Mbappé",
        flag: "🇫🇷",
        text: "Fransiyalik hujumchi. Portlovchi tezligi va aniq zarbalari bilan ajralib turadi. 2018-yilda Jahon chempioni bo‘lgan, 2022-yilgi finalda hat-trik urgan.",
        facts: [
            ["Tug‘ilgan yili", "1998"],
            ["Davlat", "Fransiya"],
            ["Pozitsiya", "Hujumchi"],
            ["Asosiy yutuq", "Jahon chempionati 2018"]
        ],
        videos: makeVideos("Mbappe", media("Kylian Mbappé.mp4"))
    },
    haaland: {
        match: "haaland",
        name: "Erling Haaland",
        flag: "🇳🇴",
        text: "Norvegiyalik hujumchi. Kuch, tezlik va aniq zarbalar uyg‘unligi bilan mashhur. 2022–23 mavsumida Premyer-ligada 36 gol urib, mavsum rekordini yangilagan.",
        facts: [
            ["Tug‘ilgan yili", "2000"],
            ["Davlat", "Norvegiya"],
            ["Pozitsiya", "Hujumchi"],
            ["Asosiy yutuq", "Uch karra g‘alaba (2022–23)"]
        ],
        videos: makeVideos("Haaland", media("Haaland.mp4"))
    }
};

const playerModalState = {
    key: null,
    index: 0,
    usingFallback: false,
    lastFocus: null
};

function createPlayerModal() {
    let modal = document.querySelector("#playerModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "playerModal";
    modal.className = "pm";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "pmTitle");

    modal.innerHTML = `
    <div class="pm-backdrop" data-pm-close></div>
    <div class="pm-dialog">
        <div class="pm-bar">
            <span class="pm-flag" id="pmFlag" aria-hidden="true"></span>
            <h3 class="pm-title" id="pmTitle"></h3>
            <button type="button" class="pm-close" data-pm-close aria-label="Oynani yopish">✕</button>
        </div>
        <div class="pm-body">
            <div class="pm-media">
                <div class="pm-stage">
                    <video class="pm-video" controls playsinline preload="metadata"></video>
                    <span class="pm-badge" hidden></span>
                    <div class="pm-error">
                        <p class="pm-error-title">Video hozircha mavjud emas</p>
                        <p class="pm-error-text">Bu futbolchining videosi tez orada qo‘shiladi. Boshqa videoni tanlab ko‘ring.</p>
                    </div>
                </div>
                <div class="pm-playlist"></div>
            </div>
            <div class="pm-info">
                <p class="pm-text"></p>
                <dl class="pm-facts"></dl>
            </div>
        </div>
    </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-pm-close]")) {
            closePlayerModal();
            return;
        }

        const track = event.target.closest(".pm-track");
        if (track) {
            selectPlayerVideo(Number(track.dataset.index), false);
        }
    });

    modal.querySelector(".pm-video").addEventListener("error", handlePlayerVideoError);

    return modal;
}

function renderPlayerPlaylist(player) {
    const modal = document.querySelector("#playerModal");
    const playlist = modal.querySelector(".pm-playlist");
    playlist.innerHTML = "";

    player.videos.forEach((video, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "pm-track";
        button.dataset.index = String(index);

        button.innerHTML = `
        <span class="pm-track-icon" aria-hidden="true">▶</span>
        <span class="pm-track-text">
            <span class="pm-track-title">${video.title}</span>
            <span class="pm-track-kind">${KIND_LABELS[video.kind] || ""}</span>
        </span>
        <span class="pm-chip" data-q="${video.quality}">${video.quality}</span>
        `;

        playlist.appendChild(button);
    });
}

function selectPlayerVideo(index, useFallback = false) {
    const player = PLAYERS[playerModalState.key];
    if (!player) return;

    const item = player.videos[index];
    if (!item) return;

    const modal = document.querySelector("#playerModal");
    const video = modal.querySelector(".pm-video");
    const badge = modal.querySelector(".pm-badge");
    const error = modal.querySelector(".pm-error");

    playerModalState.index = index;
    playerModalState.usingFallback = useFallback;

    const src = useFallback ? item.fallback : item.src;
    const quality = useFallback ? "std" : item.quality;

    error.classList.remove("is-visible");
    badge.hidden = false;
    badge.dataset.q = quality;
    badge.textContent = quality === "std" ? "Standart" : `${quality} UHD`;

    if (!src) {
        handlePlayerVideoError();
        return;
    }

    video.src = src;
    video.load();

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => { });
    }

    modal.querySelectorAll(".pm-track").forEach((track) => {
        const active = Number(track.dataset.index) === index;
        track.classList.toggle("is-active", active);

        if (active) {
            track.setAttribute("aria-current", "true");
        } else {
            track.removeAttribute("aria-current");
        }
    });
}

function handlePlayerVideoError() {
    const modal = document.querySelector("#playerModal");
    if (!modal) return;

    const player = PLAYERS[playerModalState.key];
    const item = player && player.videos[playerModalState.index];
    if (!item) return;

    if (!playerModalState.usingFallback && item.fallback) {
        selectPlayerVideo(playerModalState.index, true);
        return;
    }

    console.warn("Video topilmadi:", item.src);
    modal.querySelector(".pm-badge").hidden = true;
    modal.querySelector(".pm-error").classList.add("is-visible");
}

function openPlayerModal(key, trigger) {
    const player = PLAYERS[key];
    if (!player) return;

    const modal = createPlayerModal();

    playerModalState.key = key;
    playerModalState.lastFocus = trigger || document.activeElement;

    modal.querySelector("#pmFlag").textContent = player.flag;
    modal.querySelector("#pmTitle").textContent = player.name;
    modal.querySelector(".pm-text").textContent = player.text;

    modal.querySelector(".pm-facts").innerHTML = player.facts
        .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
        .join("");

    renderPlayerPlaylist(player);

    modal.querySelector(".pm-info").scrollTop = 0;
    modal.querySelector(".pm-media").scrollTop = 0;
    modal.querySelector(".pm-body").scrollTop = 0;

    modal.classList.add("is-open");
    document.body.classList.add("pm-open");

    selectPlayerVideo(0, false);

    modal.querySelector(".pm-close").focus({ preventScroll: true });
    document.addEventListener("keydown", handlePlayerModalKeys);
}

function closePlayerModal() {
    const modal = document.querySelector("#playerModal");
    if (!modal || !modal.classList.contains("is-open")) return;

    const video = modal.querySelector(".pm-video");
    video.pause();
    video.removeAttribute("src");
    video.load();

    modal.classList.remove("is-open");
    document.body.classList.remove("pm-open");
    document.removeEventListener("keydown", handlePlayerModalKeys);

    const lastFocus = playerModalState.lastFocus;
    if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus({ preventScroll: true });
    }
}

function handlePlayerModalKeys(event) {
    const modal = document.querySelector("#playerModal");
    if (!modal || !modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
        if (document.fullscreenElement) return;
        closePlayerModal();
        return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
        modal.querySelectorAll("button:not([disabled]), video[controls]")
    ).filter((el) => el.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function findPlayerKey(button) {
    const title = button
        .closest(".grid-list-item")
        ?.querySelector(".grid-list-title")
        ?.textContent.toLowerCase() || "";

    return Object.keys(PLAYERS).find((key) =>
        title.includes(PLAYERS[key].match)
    ) || null;
}

function initializePlayerModal() {
    if (document.body.dataset.playerModalReady === "true") return;
    document.body.dataset.playerModalReady = "true";

    document.addEventListener("click", (event) => {
        const button = event.target.closest(".grid-button");
        if (!button) return;

        const key = button.dataset.player || findPlayerKey(button);
        if (!key || !PLAYERS[key]) return;

        event.preventDefault();
        openPlayerModal(key, button);
    });
}

/* =========================================================
   YANGI JS: NEWS FILTER
   ---------------------------------------------------------
   Tugmalar (Barchasi, Bugungi xabarlar, So'nggi yangiliklar,
   Eng ko'p ko'rilgan) va "Ko'proq" select'i orqali yangiliklar
   filtrlanadi.

   Kategoriyalarni 2 usulda berish mumkin:
   1) HTML'da:  <li class="news-grid-item" data-category="today transfer">
   2) HTML'ga tegmasdan: pastdagi NEWS_DEFAULT_CATEGORIES (indeks bo'yicha)
   ========================================================= */

// Tugma / option matnidan -> filter kaliti
const NEWS_FILTER_MAP = {
    "barchasi": "all",
    "bugungi xabarlar": "today",
    "so'nggi yangiliklar": "latest",
    "eng ko'p ko'rilgan": "popular",
    "transferlar": "transfer",
    "intervyu": "interview",
    "tahlil": "analysis",
    "sharhlar": "review",
    "statistika": "stats"
};

// HTML'da data-category bo'lmasa, shu ro'yxat ishlatiladi (1-yangilik = 0-indeks)
const NEWS_DEFAULT_CATEGORIES = [
    ["latest", "transfer"],            // Elliot Anderson
    ["today", "analysis"],             // Morgan Rogers
    ["popular", "stats"],              // Sandro Tonali
    ["latest", "popular", "review"]    // Bruno Guimaraes
];

function normalizeNewsText(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[’‘`ʻʼ]/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function getNewsFilterKey(text) {
    return NEWS_FILTER_MAP[normalizeNewsText(text)] || "all";
}

function getNewsItemCategories(item, index) {
    const attr = item.dataset.category;
    if (attr) {
        return attr.split(/[\s,]+/).map((c) => c.trim().toLowerCase()).filter(Boolean);
    }
    return NEWS_DEFAULT_CATEGORIES[index] || [];
}

function initializeNewsFilter() {
    const grid = document.querySelector("#news");
    const bar = document.querySelector(".news-category");
    if (!grid || !bar) return;
    if (bar.dataset.filterReady === "true") return;
    bar.dataset.filterReady = "true";

    const buttons = Array.from(bar.querySelectorAll(".news-category-item"));
    const select = bar.querySelector(".register-select");
    const items = Array.from(grid.querySelectorAll(".news-grid-item"));

    // Har bir yangilikka kategoriya biriktiramiz
    const itemData = items.map((el, index) => ({
        el,
        categories: getNewsItemCategories(el, index)
    }));

    // Filter kalitlarini tugma/option'larga yozib qo'yamiz
    buttons.forEach((btn) => {
        btn.dataset.filter = btn.dataset.filter || getNewsFilterKey(btn.textContent);
    });

    if (select) {
        Array.from(select.options).forEach((opt) => {
            if (opt.disabled) return;
            opt.value = getNewsFilterKey(opt.textContent);
        });
    }

    // "Hech narsa topilmadi" xabari
    let emptyMessage = grid.querySelector(".news-empty");
    if (!emptyMessage) {
        emptyMessage = document.createElement("li");
        emptyMessage.className = "news-empty";
        emptyMessage.textContent = "Bu bo‘limda hozircha yangilik yo‘q.";
        emptyMessage.style.display = "none";
        emptyMessage.style.gridColumn = "1 / -1";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "30px 10px";
        emptyMessage.style.color = "#8fa598";
        emptyMessage.style.listStyle = "none";
        grid.appendChild(emptyMessage);
    }

    function applyNewsFilter(filter) {
        let visibleCount = 0;

        itemData.forEach(({ el, categories }) => {
            const show = filter === "all" || categories.includes(filter);
            el.style.display = show ? "" : "none";
            if (show) visibleCount++;
        });

        emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
    }

    function setActiveButton(activeBtn) {
        buttons.forEach((btn) => {
            const isActive = btn === activeBtn;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });
    }

    // Tugmalar
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setActiveButton(btn);
            if (select) select.selectedIndex = 0; // "Ko'proq" ga qaytaramiz
            applyNewsFilter(btn.dataset.filter);
        });
    });

    // Sichqonchali qurilmalarda (hover bor) kursor kelganda ham filter ishlaydi
    if (window.matchMedia("(hover: hover)").matches) {
        buttons.forEach((btn) => {
            btn.addEventListener("mouseenter", () => btn.click());
        });
    }

    // Select ("Ko'proq")
    if (select) {
        select.addEventListener("change", () => {
            setActiveButton(null);
            applyNewsFilter(select.value);
        });
    }

    // Boshlang'ich holat: "Barchasi"
    const defaultBtn = bar.querySelector(".category-all") || buttons[0];
    if (defaultBtn) setActiveButton(defaultBtn);
    applyNewsFilter("all");
}

/* =========================================================
   INIT
   ========================================================= */

function initializePage() {
    applyBackgrounds();
    initializeMobileMenu();
    initializePassword();
    initializeTelegramForm();
    initializePlayerModal();
    initializeNewsFilter(); // yangi
}