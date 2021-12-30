import React from 'react';
import axios from 'axios';
import Thumbnail from './Thumbnail.jsx';

class StyleSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styles: [],
      loaded: false
    }

    this.getStyles = this.getStyles.bind(this);
  }

  componentDidMount() {
    // update styles state
    this.getStyles();
  }

  getStyles = async() => {
    try {
      var resp = await axios.get('http://localhost:3000/styles');
      this.setState({
        styles: resp.data,
        loaded: true
      })
    } catch (err) {
      console.log('There was an error in your catch block');
    }
  }

  render() {
    console.log(this.state.styles.results);
    return (
      <div className='style-selector'>
        <h2>Placeholder for Style Selector</h2>
        {this.state.loaded ? this.state.styles.results.map((style) => {
          return <Thumbnail />
        }) : null};
      </div>
    );
  }

}

export default StyleSelector;