import "./PollPost.css";
import { useState, useEffect } from "react";
import PostsLine from "./SubPosts/PostsLine";

export default function PollPost({ poll }) {
  const [text, setText] = useState([""]);

  useEffect(() => {
    const textWrite = text.some((item) => item);
    if (textWrite) {
      poll(text);
    } else {
      poll(false);
    }
  }, [text]);

  return (
    <div className="poll-container">
      {text.map((item, i) => (
        <PostsLine key={i} keyNum={i} textArray={item} setText={setText} />
      ))}
      <button
        onClick={() => {
          if (text.length >= 6) return;
          setText((prev) => [...prev, ""]);
        }}
      >
        Adicionar outra opção
      </button>
    </div>
  );
}
