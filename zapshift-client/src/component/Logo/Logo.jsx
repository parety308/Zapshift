import React from "react";
import logo from "../../assets/logo.png";

const Logo = () => {
  return (
    <div className="flex gap-2 items-end">
      <img src={logo} alt="ZapShift logo" className="w-10" />
      <h3 className="text-3xl font-bold -ms-3">ZapShift</h3>
    </div>
  );
};

export default Logo;
