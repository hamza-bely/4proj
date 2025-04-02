import React from "react";

interface PopupContentProps {
    type: string;
    user: string;
    creteDate: string;
}

const PopupContent: React.FC<PopupContentProps> = ({ type, user, creteDate }) => {
    return (
        <div className="p-2 text-gray-800 w-35 ">
            <div className="flex items-center space-x-3">
                <h3 className="font-semibold">Type :{type}</h3>
            </div>
            <fieldset className="border-t border-b border-gray-200">
                <legend className="sr-only">Notifications</legend>
                <div className="divide-y divide-gray-200">
                    <div className="relative flex gap-3 pt-3.5 pb-4">
                        <div className="min-w-0 flex-1 text-sm/6">
                            <label htmlFor="comments" className="font-medium text-gray-900">
                                Cree Par :
                            </label>
                            <p id="comments-description" className="text-gray-500">
                                {user}
                            </p>
                        </div>
                    </div>
                    <div className="relative flex gap-3 pt-3.5 pb-4">
                        <div className="min-w-0 flex-1 text-sm/6">
                            <label htmlFor="offers" className="font-medium text-gray-900">
                                Cree le
                            </label>
                            <p id="offers-description" className="text-gray-500">
                                {creteDate}
                            </p>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    );
};

export default PopupContent;
