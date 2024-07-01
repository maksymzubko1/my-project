import React, { useState, useEffect, useCallback } from "react";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface ScrollTopProps {
  target: "body" | "main"
}

const ScrollToTop = ({target}: ScrollTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    const element = Array.from(document.getElementsByTagName(target))?.[0];
    element && element.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    const element = Array.from(document.getElementsByTagName(target))?.[0];

    const toggleVisibility = () => {
      if (element.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    element?.addEventListener("scroll", toggleVisibility);
    return () => element?.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      <button onClick={scrollToTop} aria-description={"scroll-to-top"}
              className={"rounded-full bg-slate-800 text-white fixed md:bottom-[40px] md:right-[40px]" +
                " w-[50px] h-[50px] items-center flex justify-center cursor-pointer z-[1000] [&>svg]:w-[20px] [&>svg]:h-[20px]" +
                ` bottom-[20px] right-[20px] ${isVisible ? "visible" : "hidden"} transition ease-in-out duration-150`}>
        <ArrowUpIcon />
      </button>
    </div>
  );
};

export default ScrollToTop;
