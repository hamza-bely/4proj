import React from 'react';

interface AddressCellProps {
    address?: string;
    fallback: string;
}

export const AddressCell: React.FC<AddressCellProps> = ({ address, fallback }) => {
    const displayText = address || fallback;
    const truncated =
        displayText.length > 25 ? displayText.slice(0, 25) + '...' : displayText;

    return (
        <div className="relative group max-w-xs cursor-pointer text-blue-600 underline">
            <div className="truncate">{truncated}</div>
            <div className="absolute z-10 hidden group-hover:block bg-white text-black text-sm p-2 rounded shadow-lg border max-w-sm w-max break-words whitespace-normal top-full left-0 mt-1">
                {displayText}
            </div>
        </div>
    );
};
