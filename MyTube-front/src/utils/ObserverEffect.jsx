import { useEffect, useRef } from "react";

export default function ObserverEffect({
  fetchInfo,
  fetchFunc,
  blockRef,
  cancelRef,
}) {
  const activeObserver = useRef(true);

  useEffect(() => {
    if (cancelRef || !blockRef.current) return;
    const observer = new IntersectionObserver((e) => {
      if (activeObserver.current) {
        activeObserver.current = false;
        return;
      }
      if (e[0].isIntersecting) {
        fetchFunc();
      }
    });

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, [fetchInfo, cancelRef]);
}
