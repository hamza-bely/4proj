'use client'
import Stats from "../../../components/stats/stats.tsx";
import { useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation();

    return (
        <div className="bg-white">
            <main className="isolate">
                <section className="py-24 relative">
                    <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                        <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                            <div
                                className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                                <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                                    <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                        {t('about.title')}
                                    </h2>
                                    <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                        {t('about.description')}
                                    </p>
                                </div>
                            </div>
                            <img className="lg:mx-0 mx-auto h-full rounded-3xl object-cover"
                                 src="images/home/navigation.jpg" alt={t('about.imageAlt')}/>
                        </div>
                    </div>
                </section>
                <Stats/>
                <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
                    <img
                        alt={t('about.bannerAlt')}
                        src="images/home/holidays.jpg"
                        className="aspect-5/2 w-full object-cover xl:rounded-3xl"
                    />
                </div>
            </main>
        </div>
    )
}
