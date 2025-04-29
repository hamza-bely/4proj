'use client';
import { useTranslation } from "react-i18next";
import Incentives from "../../../components/incentives/incentives.tsx";
import ContentSection from "../../../components/content-section/content-section.tsx";
import Stats from "../../../components/stats/stats.tsx";
import Footer from "../../../components/footer/footer.tsx";
import {useEffect, useState} from "react";

export default function Home() {
    const { t } = useTranslation();
    const [bgColor, setBgColor] = useState('bg-[#ACDE50]');

    useEffect(() => {
        const colors = ['bg-[#ACDE50]', 'bg-[#5DB3FF]', 'bg-[#FFBC2E]'];
        let index = 0;

        const interval = setInterval(() => {
            index = (index + 1) % colors.length;
            setBgColor(colors[index]);
        }, 5000); // toutes les 5 secondes

        return () => clearInterval(interval); // clear au démontage
    }, []);
    return (
        <div className="bg-white">
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
                <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-20">

                    <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-2">
                            <img className="h-16 sm:h-20" src="images/logo/logo_2.png" alt="Traficandme" />
                            <p className="text-2xl sm:text-4xl font-bold text-[#ACDE50]">TRAFIC</p>
                            <p className="text-2xl sm:text-4xl font-bold text-[#5DB3FF]">AND</p>
                            <p className="text-2xl sm:text-4xl font-bold text-[#FFBC2E]">ME</p>
                        </div>

                        <div className="mt-10 sm:mt-16">
                            <a href="#" className="inline-flex items-center space-x-4">
                                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-600/10">
                                    {t('home.new')}
                                </span>
                                <span className="text-sm font-medium text-gray-600">
                                    <span className="text-color-global">{t('home.version')}</span>
                                </span>
                            </a>
                        </div>

                        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                            {t('home.title')}
                        </h1>

                        <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                            {t('home.description')}
                        </p>

                    </div>

                    <div className={`mt-8 p-5 rounded-xl lg:mt-0 flex justify-center relative transition-colors duration-1000 ${bgColor}`}>
                        <div className="relative max-w-md sm:max-w-lg md:max-w-2xl">
                            <div className="overflow-hidden rounded-3xl shadow-lg">
                                <video
                                    src="/video/v.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="h-150 object-cover"
                                />
                            </div>
                            <div
                                className="absolute inset-0 -z-10 bg-indigo-100 opacity-20 ring-1 ring-white ring-inset rounded-3xl"
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                </div>

                <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32"></div>
            </div>

            <Incentives />
            <ContentSection />
            <Stats />
            <Footer />
        </div>
    );
}
