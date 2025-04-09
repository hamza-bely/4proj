import { useState, useCallback } from 'react';

// Define available languages
export type Language = 'en' | 'fr';

// Translation cache to avoid repeated API calls
const translationCache: Record<string, Record<string, string>> = {
    en: {},
    fr: {}
};

export const useTranslation = () => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [isLoading, setIsLoading] = useState(false);

    // Function to translate text using external API
    const translate = useCallback(async (text: string, targetLang: Language = currentLanguage): Promise<string> => {
        // If text is empty, return it as is
        if (!text) return text;

        // If source and target languages are the same, return the original text
        const sourceLang = targetLang === 'en' ? 'fr' : 'en';

        // Check if translation is already in cache
        if (translationCache[targetLang][text]) {
            return translationCache[targetLang][text];
        }

        setIsLoading(true);

        try {
            // Using LibreTranslate API (free and open source)
            const response = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: 'text'
                }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();
            const translatedText = data.translatedText;

            // Save to cache
            translationCache[targetLang][text] = translatedText;

            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text on error
        } finally {
            setIsLoading(false);
        }
    }, [currentLanguage]);

    // Function to change the current language
    const changeLanguage = useCallback((lang: Language) => {
        setCurrentLanguage(lang);
    }, []);

    // Simplified t function that handles translation
    const t = useCallback(async (key: string): Promise<string> => {
        return translate(key);
    }, [translate]);

    // Synchronous version for simple cases (uses cache or returns the key)
    const tSync = useCallback((key: string): string => {
        return translationCache[currentLanguage][key] || key;
    }, [currentLanguage]);

    return {
        t,
        tSync,
        translate,
        changeLanguage,
        currentLanguage,
        isLoading
    };
};