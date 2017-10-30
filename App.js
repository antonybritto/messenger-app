import React from 'react';
import offlineHelper from './src/utils/offlineHelper';
import AppBar from './src/components/AppBar';
import Loader from './src/components/Loader';
import HomePage from './src/container/HomePage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
    });
    offlineHelper();
  }

  render() {
    // Loading basic APP shells
    if (!this.state.loaded) {
      return [
        <AppBar
          key="app-bar"
          title="Messages"
        />,
        <main key="main" className="app-content">
          <Loader />
        </main>
      ];
    }
    return <HomePage />;
  }
}

export default App;