import React from "react";
import "./map.css"

const TrafficIndicator: React.FC = () => {
    return (
        <div className="">
            <div className="flex items-center bg-white rounded-lg p-2 w-auto h-10 mt-8">
                <span className="text-sm font-medium text-gray-700">Traffico in tempo reale</span>
                <div className="ml-3 flex items-center">
                    <span className="text-xs font-medium text-green-500">Veloce</span>
                    <div className="mx-1 h-2 w-8 bg-green-400 rounded"></div>
                    <div className="mx-1 h-2 w-8 bg-yellow-400 rounded"></div>
                    <div className="mx-1 h-2 w-8 bg-orange-500 rounded"></div>
                    <div className="mx-1 h-2 w-8 bg-red-600 rounded"></div>
                    <span className="text-xs font-medium text-red-600">Lento</span>
                </div>
            </div>
        </div>

    );
};

export default TrafficIndicator;
