import {useState} from "react";
import {interfaceLanguages} from "../header/header.tsx";
import i18n from "../../assets/i18/i18n.tsx";

export default function Languages  ({ languages }: { languages: interfaceLanguages[]} )  {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (language : interfaceLanguages) => {
        setSelectedLanguage(language);
        i18n.changeLanguage(language.name);
        setIsOpen(false);
    }


    return (
        <div className="relative">
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="grid w-full cursor-pointer grid-cols-1 bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 focus:ring-2 focus:ring-white sm:text-sm"
                >
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            <img src={selectedLanguage.img} alt="User Image" className="size-5 shrink-0" />
            <span className="block truncate">{selectedLanguage.name}</span>
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
                    <ul className="absolute z-1000 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {languages.map((language : interfaceLanguages) => (
                            <li
                                key={language.name}
                                onClick={() => selectLanguage(language)}
                                className="cursor-pointer py-2 px-3 flex items-center hover:bg-indigo-600 hover:text-white"
                            >
                                <img src={language.img} alt="User Image" className="size-5 shrink-0" />
                                <span className="ml-3 block truncate">{language.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
            )
};