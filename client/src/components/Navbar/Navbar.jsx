import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "HOME", link: "/#" },
  { id: 2, name: "CARS", link: "/cars" },
  { id: 3, name: "ABOUT", link: "/#about" },
  { id: 4, name: "BOOKING", link: "/#booking" },
  { id: 5, name: "MY DOCUMENTS", link: "/documents" },
];

const Navbar = ({ theme, setTheme }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, [location]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.reload(); 
  };

  return (
    <div className="relative z-10 shadow-md w-full dark:bg-black dark:text-white duration-300">
      <div className="container py-2 md:py-0">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-3xl font-bold font-serif">Car Rental</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {Navlinks.map(({ id, name, link }) => (
                <li key={id} className="py-4">
                  <a
                    href={link}
                    className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Theme Toggle */}
            {theme === "dark" ? (
              <BiSolidSun
                onClick={() => setTheme("light")}
                className="text-2xl cursor-pointer"
              />
            ) : (
              <BiSolidMoon
                onClick={() => setTheme("dark")}
                className="text-2xl cursor-pointer"
              />
            )}

            {/* Login or Logout Button */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile View */}
          <div className="flex items-center gap-4 md:hidden">
            {theme === "dark" ? (
              <BiSolidSun
                onClick={() => setTheme("light")}
                className="text-2xl"
              />
            ) : (
              <BiSolidMoon
                onClick={() => setTheme("dark")}
                className="text-2xl"
              />
            )}
            {showMenu ? (
              <HiMenuAlt1
                onClick={toggleMenu}
                className="cursor-pointer transition-all"
                size={30}
              />
            ) : (
              <HiMenuAlt3
                onClick={toggleMenu}
                className="cursor-pointer transition-all"
                size={30}
              />
            )}
          </div>
        </div>
      </div>

      <ResponsiveMenu showMenu={showMenu} />
    </div>
  );
};

export default Navbar;
