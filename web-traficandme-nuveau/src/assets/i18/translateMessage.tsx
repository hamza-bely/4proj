import axios from "axios";
import i18n from "i18next";

export const translateMessage = async (message: string): Promise<string> => {
    const currentLang = i18n.language ;
    if (currentLang === "en") return message;

    try {
        const response = await axios.post("http://89.168.25.138:5000/translate", {
            q: message,
            source: "en",
            target: currentLang,
            format: "text",
        }, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data.translatedText;
    } catch (e) {
        console.error("Translation failed:", e);
        return message;
    }
};
