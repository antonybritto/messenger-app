import React, { Component } from 'react';

class Loader extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="loader">Loading...</div>
    );
  }
}

export default Loader;
