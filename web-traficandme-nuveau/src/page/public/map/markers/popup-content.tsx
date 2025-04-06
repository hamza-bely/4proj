import React from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

interface PopupContentProps {
    type: string;
    user: string;
    creteDate: string;
    like: number;
    dislike: number;
    onLike: () => void;
    onDislike: () => void;
}

const PopupContent: React.FC<PopupContentProps> = ({ type, user, creteDate, like, dislike, onLike, onDislike }) => {
    return (
        <div className="p-4  text-gray-800 ">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Signal Details</h2>

            <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg">{type}</h3>
            </div>
            <fieldset className="border-t border-b border-gray-200 py-2">
                <div className="divide-y divide-gray-200">
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">Créé Par :</label>
                        <p className="text-gray-700 text-sm">{user}</p>
                    </div>
                    <div className="relative flex flex-col gap-2 pb-2">
                        <label className="font-medium text-gray-900">Créé le :</label>
                        <p className="text-gray-700 text-sm">{creteDate}</p>
                    </div>
                    <div className="relative flex justify-between items-center pt-2">
                        <span className="font-medium text-gray-900">Votes :</span>
                        <div className="flex space-x-4">
                            <button
                                onClick={onLike}
                                className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-green-600 transition">
                                <AiFillLike/> <span>{like}</span>
                            </button>
                            <button
                                onClick={onDislike}
                                className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600 transition">
                                <AiFillDislike/> <span>{dislike}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    );
};

export default PopupContent;
