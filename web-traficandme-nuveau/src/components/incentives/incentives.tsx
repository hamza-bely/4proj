'use client'

import { useTranslation } from 'react-i18next';

export default function Incentives() {
    const { t } = useTranslation();

    return (
        <div className="bg-white">
            <main className="isolate">
                <div className="bg-indigo-50">
                    <div className="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 px-4 lg:max-w-none lg:grid-cols-3">
                            {/* Real Time Updates */}
                            <div className="text-center sm:flex sm:text-left lg:block lg:text-center">
                                <div className="sm:shrink-0">
                                    <div className="flow-root">
                                        <img className="mx-auto h-24 w-28" src="https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-delivery-light.svg" alt="" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0">
                                    <h3 className="text-sm font-medium text-gray-900">{t('feature.real_time_updates.title')}</h3>
                                    <p className="mt-2 text-sm text-gray-500">{t('feature.real_time_updates.description')}</p>
                                </div>
                            </div>

                            {/* 24/7 Support */}
                            <div className="text-center sm:flex sm:text-left lg:block lg:text-center">
                                <div className="sm:shrink-0">
                                    <div className="flow-root">
                                        <img className="mx-auto h-24 w-28" src="https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-chat-light.svg" alt="" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0">
                                    <h3 className="text-sm font-medium text-gray-900">{t('feature.support_24_7.title')}</h3>
                                    <p className="mt-2 text-sm text-gray-500">{t('feature.support_24_7.description')}</p>
                                </div>
                            </div>

                            {/* Optimized Navigation */}
                            <div className="text-center sm:flex sm:text-left lg:block lg:text-center">
                                <div className="sm:shrink-0">
                                    <div className="flow-root">
                                        <img className="mx-auto h-24 w-28" src="https://tailwindui.com/plus-assets/img/ecommerce/icons/icon-fast-checkout-light.svg" alt="" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0">
                                    <h3 className="text-sm font-medium text-gray-900">{t('feature.optimized_navigation.title')}</h3>
                                    <p className="mt-2 text-sm text-gray-500">{t('feature.optimized_navigation.description')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
