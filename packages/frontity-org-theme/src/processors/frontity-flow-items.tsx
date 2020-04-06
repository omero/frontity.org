import { Node, Processor } from "@frontity/html2react/types";
import { connect, css, styled } from "frontity";
import { Connect } from "frontity/types";
import React from "react";

import FrontityOrg from "../../types";
import { addAlpha } from "../utils";

const Dot = styled.div<{ active: boolean; color: string }>`
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background: ${({ active, color }) =>
    active ? color : addAlpha(color, 0.12)};
  margin: 6px;
`;

const Dots: React.FC<Connect<FrontityOrg>> = connect(({ state }) => (
  <span
    css={css`
      position: absolute;
      bottom: 20px;
      width: 100%;
      display: flex;
      justify-content: center;

      @media screen and (min-width: 701px) {
        display: none;
      }
    `}
  >
    {Array.from({ length: 4 }, (_, i) => (
      <Dot
        key={i}
        active={state.theme.tabNumber === i + 1}
        color={state.theme.colors.primary}
      />
    ))}
  </span>
));

export const flowItems: Processor<React.HTMLProps<HTMLElement>, FrontityOrg> = {
  name: "flow-items",
  test: ({ node }) =>
    node.type === "element" &&
    node.props?.className?.split(" ").includes("frontity-flow-all-items"),
  processor: ({ node }) => {
    if (node.type !== "element") return node;

    node.props.css = css`
      ${node.props.css};

      /* This is so that w can position the "dots" absolutely on mobile */
      position: relative;

      & > .wp-block-group__inner-container {
        @media screen and (max-width: 700px) {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 100%;
          grid-gap: 0.5rem;

          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          scroll-padding: 0.5rem;
          -webkit-overflow-scrolling: touch;

          padding: 0.5rem;
        }
      }
    `;

    const dots: Node<React.HTMLProps<HTMLElement>> = {
      type: "element",
      component: Dots,
      props: {},
    };

    node.children = [...node.children, dots];

    return node;
  },
};
