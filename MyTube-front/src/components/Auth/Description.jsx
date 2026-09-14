import react from "react";
import "./Description.css";

export default function Description({ title, text }) {
  return (
    <section className="center-background">
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
