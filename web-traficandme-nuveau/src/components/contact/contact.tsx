'use client'

import { useTranslation } from 'react-i18next';

export default function Contact() {
    const { t } = useTranslation();

    return (
        <div className="relative bg-white">
            <div className="absolute inset-0">
                <div className="absolute inset-y-0 left-0 w-1/2 "></div>
            </div>
            <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
                <div className="px-6 py-16 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
                    <div className="mx-auto max-w-lg">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('contact.get_in_touch')}</h2> {/* Translated title */}
                        <p className="mt-3 text-lg/6 text-gray-500">{t('contact.description')}</p> {/* Translated description */}
                        <dl className="mt-8 text-base text-gray-500">
                            <div>
                                <dt className="sr-only">{t('contact.postal_address')}</dt> {/* Translated label */}
                                <dd>
                                    <p>{t('contact.address_1')}</p> {/* Translated address */}
                                    <p>{t('contact.address_2')}</p> {/* Translated address */}
                                </dd>
                            </div>
                            <div className="mt-3">
                                <dt className="sr-only">{t('contact.email')}</dt> {/* Translated label */}
                                <dd className="flex">
                                    <svg className="size-6 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    <span className="ml-3">support@example.com</span> {/* Use the correct email translation if needed */}
                                </dd>
                            </div>
                        </dl>
                        <p className="mt-6 text-base text-gray-500">
                            {t('contact.career_inquiry')}
                            <a href="#" className="font-medium text-gray-700 underline">{t('contact.view_jobs')}</a>. {/* Translated links */}
                        </p>
                    </div>
                </div>
                <div className="bg-white px-6 py-16 lg:col-span-3 lg:px-8 lg:py-24 xl:pl-12">
                    <div className="mx-auto max-w-lg lg:max-w-none">
                        <form action="#" method="POST" className="grid grid-cols-1 gap-y-6">
                            <div>
                                <label htmlFor="full-name" className="sr-only">{t('contact.full_name')}</label> {/* Translated label */}
                                <input type="text" name="full-name" id="full-name" autoComplete="name" className="block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-500 shadow-xs focus:border-indigo-500 focus:ring-indigo-500" placeholder={t('contact.full_name')} />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">{t('contact.email')}</label> {/* Translated label */}
                                <input id="email" name="email" type="email" autoComplete="email" className="block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-500 shadow-xs focus:border-indigo-500 focus:ring-indigo-500" placeholder={t('contact.email')} />
                            </div>

                            <div>
                                <label htmlFor="message" className="sr-only">{t('contact.message')}</label> {/* Translated label */}
                                <textarea id="message" name="message" rows={4} className="block w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-500 shadow-xs focus:border-indigo-500 focus:ring-indigo-500" placeholder={t('contact.message')} />
                            </div>
                            <div>
                                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">{t('contact.submit')}</button> {/* Translated submit button */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
