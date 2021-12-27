import React from 'react';
import ReactDOM from 'react-dom';
import ProductInfo from './Overview/ProductInfo.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <h1>Hello world!</h1>
      <ProductInfo />
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
