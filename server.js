require('dotenv').config();
const express = require("express");
const path = require("path");

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Contact.html"));
});

app.post("/register", async (req, res) => {
    try {
        console.log("=================================");
        console.log("📥 Yangi registration:");
        console.log(req.body);
        console.log("=================================");

        if (!BOT_TOKEN) {
            console.error("❌ BOT_TOKEN mavjud emas!");
            return res.status(500).json({
                success: false,
                message: "BOT_TOKEN sozlanmagan."
            });
        }

        if (!CHAT_ID) {
            console.error("❌ CHAT_ID mavjud emas!");
            return res.status(500).json({
                success: false,
                message: "CHAT_ID sozlanmagan."
            });
        }

        const {
            ism = "",
            sana = "",
            email = "",
            parol = "",
            tel = "",
            jamoa = "",
            davlat = "",
            liga = "",
            pozitsiya = "",
            futbolchi = "",
            info = ""
        } = req.body;

        if (!ism || !tel || !info) {
            return res.status(400).json({
                success: false,
                message: "Majburiy maydonlarni to‘ldiring."
            });
        }

        const message = `
⚽ YANGI FUTBOLCHI RO‘YXATDAN O‘TDI

👤 Ism: ${ism}

📅 Tug‘ilgan sana:
${sana || "Kiritilmagan"}

📧 Email:
${email || "Kiritilmagan"}

📱 Telefon:
${tel}

👥 Jamoa:
${jamoa || "Kiritilmagan"}

🌍 Davlat:
${davlat || "Kiritilmagan"}

🏆 Liga:
${liga || "Kiritilmagan"}

⚽ Pozitsiya:
${pozitsiya || "Kiritilmagan"}

👟 Futbolchi:
${futbolchi || "Kiritilmagan"}

📝 Qo‘shimcha ma'lumot:
${info}
`;

        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        const telegramText = await telegramResponse.text();
        console.log("Telegram response:", telegramText);

        let telegramResult;

        try {
            telegramResult = telegramText ? JSON.parse(telegramText) : {};
        } catch (error) {
            console.error("Telegram JSON parse error:", error);
            return res.status(502).json({
                success: false,
                message: "Telegram serveridan noto‘g‘ri javob keldi."
            });
        }

        if (!telegramResponse.ok || !telegramResult.ok) {
            console.error("❌ Telegram API error:", telegramResult);
            return res.status(502).json({
                success: false,
                message: telegramResult.description || "Telegramga xabar yuborilmadi."
            });
        }

        console.log("✅ Telegramga muvaffaqiyatli yuborildi.");

        return res.status(200).json({
            success: true,
            message: "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!"
        });

    } catch (error) {
        console.error("❌ REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Serverda xatolik yuz berdi."
        });
    }
});

app.use((req, res) => {
    if (req.path === "/register") {
        return res.status(404).json({
            success: false,
            message: "Register endpoint topilmadi."
        });
    }
    res.status(404).send("404 - Sahifa topilmadi");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});

module.exports = app;