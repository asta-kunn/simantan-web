import React from "react";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/solid";


const Breadcrumb = ({listMenu}) => {
  const lastIndex = listMenu.length - 1;
  return (
    <div className="flex items-center mb-0 overflow-x-auto whitespace-nowrap p-1 rounded-lg">
      <nav>
        <ol className="list-reset flex items-center">
          <li key={1}>
            <HomeIcon className="w-4 h-4 mr-2" />
          </li>
          {listMenu.map((menu,index) => {
            return(
              <li className="flex items-center" key={menu.url}>
                <a
                  href={`${menu.url}`}
                  className="text-xs sm:text-sm md:text-base font-semibold transition-colors duration-300"
                >
                  {menu.name}
                </a>
                {lastIndex == index ? "" : <ChevronRightIcon className="w-4 h-4 mx-2" />} 
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
