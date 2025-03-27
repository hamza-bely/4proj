'use client';

import { useTranslation } from 'react-i18next';

export default function Stats() {
    const { t } = useTranslation();

    return (
        <div className="mx-auto mt-32 mb-25 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                    {t('stats.title')}
                </h2>
                <p className="mt-6 text-base/7 text-gray-600">
                    {t('stats.description')}
                </p>
            </div>

            <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">

                {/* Bloc 1 - Utilisateurs satisfaits */}
                <div
                    className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start"
                    style={{ backgroundColor: '#ACDE50' }}>
                    <p className="flex-none text-3xl font-bold tracking-tight text-white">
                        {t('stats.stats.users.value')}
                    </p>
                    <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                        <p className="text-lg font-semibold tracking-tight text-white">
                            {t('stats.stats.users.title')}
                        </p>
                        <p className="mt-2 text-base/7 text-white">
                            {t('stats.stats.users.description')}
                        </p>
                    </div>
                </div>

                {/* Bloc 2 - Alertes en temps réel */}
                <div
                    className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44"
                    style={{ backgroundColor: '#5DB3FF' }}>
                    <p className="flex-none text-3xl font-bold tracking-tight text-white">
                        {t('stats.stats.alerts.value')}
                    </p>
                    <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                        <p className="text-lg font-semibold tracking-tight text-white">
                            {t('stats.stats.alerts.title')}
                        </p>
                        <p className="mt-2 text-base/7 text-white">
                            {t('stats.stats.alerts.description')}
                        </p>
                    </div>
                </div>

                {/* Bloc 3 - Itinéraires optimisés */}
                <div
                    className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28"
                    style={{ backgroundColor: '#FFBC2E' }}>
                    <p className="flex-none text-3xl font-bold tracking-tight text-white">
                        {t('stats.stats.routes.value')}
                    </p>
                    <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                        <p className="text-lg font-semibold tracking-tight text-white">
                            {t('stats.stats.routes.title')}
                        </p>
                        <p className="mt-2 text-base/7 text-white">
                            {t('stats.stats.routes.description')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
