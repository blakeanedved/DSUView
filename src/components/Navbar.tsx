import React, { useContext } from "react";
import { MdBrightnessHigh, MdBrightnessMedium } from "react-icons/md";
import themes, { Theme } from "../themes";

export interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
  // const { darkMode, toggleDarkMode } = useContext(DarkMode);

  // return (
  //   <div className="navbar">
  //     <div className="right">
  //       <button onClick={() => toggleDarkMode()}>
  //         {darkMode ? <MdBrightnessHigh /> : <MdBrightnessMedium />}
  //       </button>
  //     </div>
  //   </div>
  // );

  const { theme, toggleTheme } = useContext(Theme);

  return (
    <div className="navbar">
      <div className="right">
        <button onClick={() => toggleTheme()}>
          {theme === themes.dark ? (
            <MdBrightnessHigh />
          ) : (
            <MdBrightnessMedium />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
