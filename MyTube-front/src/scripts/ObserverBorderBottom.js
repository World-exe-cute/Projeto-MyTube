import { useState, useEffect } from "react";

export default function ObserverBorderBottom(options, active) {
  const [resize, setResize] = useState();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let e of entries) {
        setResize(e.contentRect.width);
      }
    });
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const optionsWidth = Array.from(options.current.childNodes[0].children);
    optionsWidth.forEach((e) => {
      if (e.className === "active") {
        document.documentElement.style.setProperty(
          "--option-border-width",
          e.offsetWidth,
        );
        document.documentElement.style.setProperty(
          "--option-border-left",
          e.offsetLeft,
        );
      }
    });
  }, [resize, active]);
}
