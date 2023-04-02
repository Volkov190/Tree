import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    height: 100vh;
  }

  #root {
    height: 100%;
  }

  /* Tooltip */

  .rc-tooltip-inner {
    min-height: 0px !important;
    font-size: 1rem
  }

  /* ReactFlow */

  .react-flow__pane {
    cursor: default !important;
  }
`;

export default GlobalStyle;
