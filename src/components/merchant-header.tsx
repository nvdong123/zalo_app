import React, { useState } from "react";

interface MerchantHeaderProps {
  title: string;
  logoUrl?: string;
}

const MerchantHeader: React.FC<MerchantHeaderProps> = ({ title, logoUrl }) => {
    const defaultStyles: React.CSSProperties = { backgroundColor: '#65BF68', color: '#FFFFFF' };
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <header className="flex items-center justify-between p-4 h-[150px]" style={{...defaultStyles}}>
        {/* Phần bên trái: logo và tiêu đề */}
            <div className="flex items-center">
                <img src={logoUrl} alt="Logo" className="h-10 w-10" />
                <h1 className="ml-2 text-white text-lg">{title}</h1>
            </div>
            
        
        </header>
    );
};

export default MerchantHeader;
