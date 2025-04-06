import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface MobileHeaderProps {
    navigationLinks: { name: string; href: string }[];
}

export default function MobileHeader({ navigationLinks }: MobileHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="lg:hidden">
            <button type="button" onClick={toggleMobileMenu}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                <Bars3Icon className="size-6"/>
            </button>


            {mobileMenuOpen && (
                <div className="fixed inset-0 z-10">
                    <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu}></div>
                    <div className="fixed inset-y-0 left-0 w-full overflow-y-auto bg-white px-6 py-6">
                        <div className="flex items-center justify-between">
                            <button type="button" onClick={toggleMobileMenu}
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700">
                                <XMarkIcon className="size-6"/>
                            </button>
                        </div>
                        <div className="mt-6 space-y-2">
                            {navigationLinks.map((item) => (
                                <Link key={item.name} to={item.href}
                                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
