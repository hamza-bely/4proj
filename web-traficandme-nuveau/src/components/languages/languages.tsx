import { useState } from "react";
import i18n from "../../assets/i18/i18n.tsx";

const languageOptions = [
    {
        name: "en",
        label: "English",
        svg: (
            <svg viewBox="0 0 60 30" className="size-5" xmlns="http://www.w3.org/2000/svg">
                <clipPath id="s">
                    <path d="M0,0 v30 h60 v-30 z" />
                </clipPath>
                <clipPath id="t">
                    <path d="M30,15 h30 v15 h-30 z M0,0 h30 v15 h-30 z" />
                </clipPath>
                <g clipPath="url(#s)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                </g>
            </svg>
        )
    },
    {
        name: "fr",
        label: "Français",
        svg: (
            <svg viewBox="0 0 640 480" className="size-5" xmlns="http://www.w3.org/2000/svg">
                <g fillRule="evenodd">
                    <path fill="#fff" d="M0 0h640v480H0z"/>
                    <path fill="#00267f" d="M0 0h213.3v480H0z"/>
                    <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
                </g>
            </svg>
        )
    },

];

export default function Languages() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[1]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectLanguage = (language: any) => {
        setSelectedLanguage(language);
        i18n.changeLanguage(language.name);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="grid w-full cursor-pointer grid-cols-1 bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 focus:ring-2 focus:ring-white sm:text-sm"
                >
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        {selectedLanguage.svg}
                        <span className="block truncate">{selectedLanguage.label}</span>
                    </span>
                    <svg
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {languageOptions.map((language) => (
                            <li
                                key={language.name}
                                onClick={() => selectLanguage(language)}
                                className="cursor-pointer py-2 px-3 flex items-center hover:bg-indigo-600 hover:text-white"
                            >
                                {language.svg}
                                <span className="ml-3 block truncate">{language.label}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
