import { Fragment } from "react";

// Wraps each word in a masked span so it can slide up into view.
// Animated globally by the [data-split] rule in App.jsx.
export default function SplitText({ text, as: Tag = "span", className = "" }) {
  const words = text.split(" ");
  return (
    <Tag className={className} data-split aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="w__i">{w}</span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
