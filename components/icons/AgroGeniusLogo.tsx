import React from 'react';

const AgroGeniusLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
        <defs>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#34D399', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#6EE7B7', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A7F3D0', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path
            d="M50,95C25.2,95,5,74.8,5,50S25.2,5,50,5s45,20.2,45,45S74.8,95,50,95z"
            fill="#065F46"
        />
        <path
            d="M60,25C50,30,40,45,40,58c0,15,10,20,15,20s15-5,15-20c0-12-5-20-10-25z"
            fill="url(#leafGradient)"
        />
        <path
            d="M30,55c10-5,25-15,35-15c15,0,20,10,20,15s-5,15-20,15c-10,0-20-5-35-15z"
            fill="url(#swooshGradient)"
            transform="rotate(-20 50 50)"
        />
    </svg>
);

export default AgroGeniusLogo;