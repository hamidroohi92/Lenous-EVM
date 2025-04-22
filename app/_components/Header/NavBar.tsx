"use client";

import Image from "next/image";
import Link from "next/link";
import RightNav from "./RightNav";
import { usePathname } from "next/navigation";
import { useState } from "react";
import FaucetModal from "../faucet/faucetModal";

const menuData = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/trade",
    name: "Trade",
  },
  {
    href: "/swap",
    name: "Swap",
  },
  {
    href: "/pool",
    name: "Pool",
  },
];

const NavBar = () => {
  const [showFaucetModal, setShowFaucetModal] = useState<boolean>(false);
  const handleOpenFaucetModal = () => {
    setShowFaucetModal(true);
  };

  const pathName = usePathname();
  return (
    <div className="container flex justify-between items-center py-3">
      <div className="headerLeft flex items-center">
        <Image
          src="/images/Platform_Logo.svg"
          width="110"
          height="42"
          alt="lenous"
        />
        <div className="mainMenu ml-8">
          <ul className="flex  text-neutral-light">
            {menuData.map((item) => (
              <li
                key={item.href + item.name}
                className={
                  "p-4 flex items-center " +
                  (pathName === item.href ? "text-primary" : "text-white")
                }
              >
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
            <li className="p-4 text-white">
              <button
                onClick={handleOpenFaucetModal}
                className="bg-primary text-white py-1 px-3 rounded-2xl"
              >
                Faucet
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="headerRight ">
        <RightNav />
      </div>
      <FaucetModal
        visible={showFaucetModal}
        handleClose={() => {
          setShowFaucetModal(false);
        }}
      />
    </div>
  );
};
export default NavBar;
