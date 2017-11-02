import React, { Component } from 'react';

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({
        isVisible: true,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.show !== this.props.show;
  }

  componentDidUpdate() {
    if (this.props.show) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'initial';
    }
  }

  render() {
    const { isVisible } = this.state;
    const { show } = this.props;
    const classNames = (show) ? 'drawer show' : (!show && isVisible) ? 'drawer hide' : 'drawer';
    return (
      <section className={classNames} aria-hidden={!show} tabIndex={(show) ? '0' : '-1'} >
        <div
          className="drawer-overlay"
          role="button"
          aria-label="Close Drawer"
          tabIndex="0"
          onClick={this.props.onToggleDrawer.bind(this, !this.props.show)}
        >
        </div>
        <div className="drawer-content">
          {this.props.children}
        </div>
      </section>
    );
  }
}

export default Drawer;
