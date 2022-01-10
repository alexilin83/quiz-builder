import React from "react";

const Spinner = () => {
    return (
        <svg fill="none" className="w-full h-full stroke-current stroke-2 animate-spin" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)">
                <circle cx="18" cy="18" r="18" className="opacity-20" />
                <path d="M36 18c0-9.94-8.06-18-18-18" />
            </g>
        </svg>
    );
};

export default Spinner;
