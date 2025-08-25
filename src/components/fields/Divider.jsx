import React, { memo } from "react";

export const Divider = memo(
  ({
    style = "solid",
    labelAlignment = "center",
    label = "",
    className = "",
    dividerStyle = {},
  }) => {
    const borderStyle = style === "dash" ? "dashed" : "solid";
    const line = (
      <div
        style={{
          flex: 1,
          borderTop: `1px ${borderStyle} #D2DEEB`,
          ...dividerStyle,
        }}
      />
    );
    const labelElement = label ? (
      <span
        className={className}
        style={{
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          verticalAlign: "middle",
        }}
      >
        {label}
      </span>
    ) : null;

    let content;
    if (!label) {
      content = line;
    } else if (labelAlignment === "left") {
      content = (
        <>
          {labelElement}
          {line}
        </>
      );
    } else if (labelAlignment === "right") {
      content = (
        <>
          {line}
          {labelElement}
        </>
      );
    } else {
      content = (
        <>
          {line}
          {labelElement}
          {line}
        </>
      );
    }

    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          width: "90%",
          gap: label ? 2 : 0,
        }}
      >
        {content}
      </div>
    );
  }
);

export default Divider;
