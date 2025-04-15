'use client'

import {useTranslation} from "react-i18next";
import Incentives from "../../../components/incentives/incentives.tsx";
import ContentSection from "../../../components/content-section/content-section.tsx";
import Stats from "../../../components/stats/stats.tsx";
import Footer from "../../../components/footer/footer.tsx";

export default function Header() {
    const { t } = useTranslation();  // useTranslation hook to get the translation function

    return (
        <div className="bg-white">
            <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20">
                <div
                    className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-15">
                    <div className="px-6 lg:px-0 lg:pt-4">
                        <div className="mx-auto max-w-2xl">
                            <div className="max-w-lg">
                                <div style={{display: "flex", alignItems: "center"}} className="d-flex">
                                    <img className="h-20" src="images/logo/logo_2.png" alt="Traficandme"/>
                                    <p style={{fontSize: "40px",fontWeight: "bold",color: "#ACDE50"}}>TRAFIC</p>
                                    <p style={{fontSize: "40px",fontWeight: "bold",color: "#5DB3FF"}}>AND</p>
                                    <p style={{fontSize: "40px",fontWeight: "bold",color: "#FFBC2E"}}>ME</p>
                                </div>
                                <div className="mt-24 sm:mt-32 lg:mt-20">
                                    <a href="#" className="inline-flex space-x-6">
                                        <span
                                            className="button-global rounded-full bg-indigo-600/10 px-3 py-1 text-sm/6 font-semibold text-white  ring-1 ring-indigo-600/10 ring-inset">Nouveauté</span>
                                        <span
                                            className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600">
                                          <span className="text-color-global">Version 1.0 disponible !</span>
                                          <svg className="size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                               data-slot="icon">
                                            <path fillRule="evenodd"
                                                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                                  clipRule="evenodd"/>
                                          </svg>
                                        </span>
                                    </a>
                                </div>
                                <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">{t('home.title-mobile')}</h1> {/* Replaced translation code */}
                                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">{t('home.description-mobile')}</p> {/* Replaced translation code */}
                                <div className="mt-10 flex items-center gap-x-6">
                                    <a href="#"
                                       className="button-global rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Télécharger
                                        l'App</a>
                                    <a href="#" className="text-sm/6 font-semibold text-gray-900">En savoir plus <span
                                        aria-hidden="true">→</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
                        <div
                            className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white ring-1 shadow-xl shadow-indigo-600/10 ring-indigo-50 md:-mr-20 lg:-mr-36"
                            aria-hidden="true"></div>
                        <div className="shadow-lg md:rounded-3xl">
                            <div
                                className="button-global [clip-path:inset(0)] md:[clip-path:inset(0_round_var(--radius-3xl))]">
                                <div
                                    className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-white ring-inset md:ml-20 lg:ml-36"
                                    aria-hidden="true"></div>
                                <div className="relative px-6 pt-8 sm:pt-16 md:pr-0 md:pl-16">
                                    <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                                        <div className="h-140  w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                                            {/* Image or content goes here */}
                                        </div>
                                    </div>
                                    <div
                                        className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset md:rounded-3xl"
                                        aria-hidden="true"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32"></div>
            </div>
            <Incentives/>
            <ContentSection/>
            <Stats/>
            <Footer/>
        </div>
    );
}
