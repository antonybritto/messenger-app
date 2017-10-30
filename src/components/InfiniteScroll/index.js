import React, { Component } from 'react';
import throttle from '../../utils/throttle';
import Loader from '../Loader';

class InfiniteScroll extends Component {
  constructor(props) {
    super(props);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.checkPosition = this.checkPosition.bind(this);
    this.clientHeight = window.innerHeight || document.documentElement.clientHeight;
    this.throttledScrollHandler = throttle(this.scrollHandler, 300);
    this.page = 0;
    this.state = {
      isLoading: props.isLoading,
    };
  }

  componentDidMount() {
    this.waypoint = this.refs.waypoint;
    this.checkPosition();
    this.attachEventListener();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.hasMore) {
      this.detachEventListener();
    } else {
      this.setState({
        isLoading: nextProps.isLoading,
      });
      this.checkPosition();
    }
  }

  componentWillUnmount() {
    this.detachEventListener();
  }

  attachEventListener() {
    window.addEventListener('scroll', this.throttledScrollHandler);
  }

  detachEventListener() {
    window.removeEventListener('scroll', this.throttledScrollHandler);
  }

  checkPosition() {
    if (typeof this.props.loadMore === 'function' && this.props.hasMore && !this.state.isLoading) {
      if (this.waypoint.getBoundingClientRect().top - this.props.threshold < this.clientHeight) {
        this.setState({
          isLoading: true,
        }, () => {
          this.props.loadMore(this.page++);
        });
      }
    }
  }

  scrollHandler() {
    this.checkPosition();
  }

  render() {
    const showLoader = this.props.hasMore && this.state.isLoading;
    return (
      <section aria-live={(showLoader) ? 'polite' : 'off'}>
        <ol role="List">
          {this.props.children}
        </ol>
        <div ref="waypoint">
          {showLoader && <Loader />}
          {!this.props.hasMore && <p>Thats all we got.</p>}
        </div>
      </section>
    );
  }
}

export default InfiniteScroll;
