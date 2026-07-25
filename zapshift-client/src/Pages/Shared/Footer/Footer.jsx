import React from "react";
import Logo from "../../../component/Logo/Logo";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-primary text-primary-content p-10 rounded-lg mt-10">
      <aside>
        <Logo />
        <p className="font-bold">
          ZapShift Logistics Ltd.
          <br />
          Providing reliable parcel delivery since 2024
        </p>
        <p>Copyright &copy; {new Date().getFullYear()} - All rights reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
