import Image from "next/image";
import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 240, className = "" }) => {
  return (
    <Image
      src="https://res.cloudinary.com/dyiso4ohk/image/upload/v1767713239/FormiqLogo-removebg-preview_f5izkr_d07829.png"
      alt="Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
};

export default Logo;