import React from 'react';

export default function ThemeToggle() {
    const toggleTheme = () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-void/10 hover:bg-fuschia/20 transition-all border border-stark/20 text-stark"
            title="Cambiar tema"
        >
            🌓
        </button>
    );
}