import { forwardRef, useRef } from "react";

export function NewRefs() {
  const refs = useRef({});

  const setRefs = (ref) => (el) => {
    refs.current[ref] = el;
  };

  return [refs, setRefs];
}

export const NewRefInput = forwardRef((props, ref) => {
  return <div ref={ref} {...props}></div>;
});
