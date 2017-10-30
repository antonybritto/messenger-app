import React from 'react';

function AppBar(props) {
  return (
    <header id="app-bar" role="Heading">
      <button
        tabIndex="0"
        type="button"
        aria-label="Open Drawer"
        onClick={props.onToggleDrawer && props.onToggleDrawer.bind(this)}
      >
        <svg viewBox="0 0 24 24" className="header-icon">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      </button>
      <h1 className="heading">{props.title}</h1>
    </header>
  );
}

export default AppBar;
