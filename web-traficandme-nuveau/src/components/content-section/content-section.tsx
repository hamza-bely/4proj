'use client'

import { useTranslation } from 'react-i18next';

export default function ContentSection() {
    const { t } = useTranslation();

    return (
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">


            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                    {t('content-section.values_title')}
                </h2>
                <p className="mt-6 text-lg/8 text-gray-600">
                    {t('content-section.description')}
                </p>
            </div>


            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <div>
                    <dt className="font-semibold text-gray-900">{t('content-section.be_world_class')}</dt>
                    <dd className="mt-1 text-gray-600">{t('content-section.be_world_class_desc')}</dd>
                </div>
                <div>
                    <dt className="font-semibold text-gray-900">{t('content-section.share_knowlege')}</dt>
                    <dd className="mt-1 text-gray-600">{t('content-section.share_knowlege_desc')}</dd>
                </div>
                <div>
                    <dt className="font-semibold text-gray-900">{t('content-section.always_learning')}</dt>
                    <dd className="mt-1 text-gray-600">{t('content-section.always_learning_desc')}</dd>
                </div>

            </dl>
            <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
                <img
                    alt={t('about.bannerAlt')}
                    src="images/home/holidays.jpg"
                    className="aspect-5/2 w-full object-cover xl:rounded-3xl"
                />
            </div>
        </div>
    );
}
