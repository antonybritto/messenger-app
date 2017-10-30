import React from 'react';
import InfiniteScroll from '../../components/infiniteScroll';
import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import LeftNavigation from './LeftNavigation';
import MessageCard from './MessageCard';
import { apiCaller } from '../../utils/apiCaller';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.PAGE_SIZE = 10;
    this.API_URL = 'https://message-list.appspot.com/messages';
    this.state = {
      hasMore: true,
      showDrawer: false,
      pageToken: undefined,
      messages: [],
      status: 'LOADING',
    };
  }

  componentDidMount() {
    this.fetchMessages();
  }

  onDeleteMessage() {
    this.forceUpdate();
  }

  onToggleDrawer(val) {
    this.setState({
      showDrawer: val,
    });
  }

  fetchMessages() {
    const { pageToken } = this.state;
    let url = `${this.API_URL}?limit=${this.PAGE_SIZE}`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    apiCaller.get(url)
      .then(function(response) { 
        return response.json();
      })
      .then((response) => {
        this._updateModel(response);
      }).catch(() => {
        this.setState({
          status: 'LOADING',
        });
      });
  }

  _updateModel(response) {
    let { messages } = this.state;
    messages = messages.concat(response.messages);
    this.setState({
      pageToken: response.pageToken,
      messages,
      status: 'SUCCESS',
      hasMore: response.messages.length >= 10,
    });
  }

  render() {
    const { hasMore, showDrawer, status, messages } = this.state;
    return [
      <AppBar
        key="app-bar"
        title="Messages"
        onToggleDrawer={this.onToggleDrawer.bind(this, true)}
      />,
      <main
        key="main"
        role="main"
        className="app-content"
      >
        <InfiniteScroll
          loadMore={this.fetchMessages.bind(this)}
          threshold={400}
          hasMore={hasMore}
          isLoading={status === 'LOADING'}
        >
          {messages.map((message) =>
            <MessageCard
              message={message}
              key={message.id}
              onDeleteMessage={this.onDeleteMessage.bind(this)}
            />
          )}
        </InfiniteScroll>
      </main>,
      <Drawer
        key="drawer"
        show={showDrawer}
        onToggleDrawer={this.onToggleDrawer.bind(this)}
      >
        <LeftNavigation />
      </Drawer>
    ];
  }
}

export default HomePage;
