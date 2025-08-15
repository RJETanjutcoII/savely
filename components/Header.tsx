// components/Header.tsx (Server Component)
import React from "react";
import logo from "../public/logo.png";
import { CiSearch } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// ✅ Explicitly define the props type
interface HeaderProps {
  userEmail?: string | null;
  username?: string | null;
}

export default function Header({ userEmail = null, username = null}: HeaderProps) {
  const welcome = username || userEmail;

  return (
    <nav className="bg-white border-b border-white border-0.1 shadow-md sticky top-0 z-9999999 fixed top-0 w-full">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 justify-center md:items-stretch md:justify-start">
            <Link className="flex flex-shrink-0 mr-4" href="/">
              <Image className="h-13 w-auto" src={logo} alt="Savely" />
              <span className="text-4xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-indigo-900 to-violet-700 p-2">
                Savely
              </span>
            </Link>

            <div className="md:ml-auto">
              <div className="flex space-x-2 items-center">
                <div className="flex items-center">
                  <CiSearch className="-mr-9" />
                  <input className="h-15 pl-10 pr-5 rounded-3xl" placeholder="Search" style={{ WebkitOverflowScrolling: "touch", }}/>
                </div>

                

                {welcome ? (
                  <>
                  <Link href="/shopping-cart"><FaShoppingCart className="items-center h-15 mr-6" /></Link>
                  <Link className="font-bold" href="/account">Welcome, {welcome}</Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-black hover:bg-blue-400 hover:text-white rounded-xl mt-2 px-10 py-2 border-1 border-solid border-black font-bold h-10"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      className="text-white bg-linear-to-t from-fuchsia-600 to-blue-700 rounded-xl mt-2 px-10 py-2 hover:text-black font-bold h-10"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
