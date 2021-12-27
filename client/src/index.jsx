import React from 'react';
import ReactDOM from 'react-dom';
import QuestionsAnswers from './components/Questions & Answers/QuestionsAnswersModule.jsx';
import ProductInfo from './components/Overview/ProductInfo.jsx';
import Card from './components/Related Items & Comparison/card.jsx';
import ReviewList from './components/Ratings & Reviews/reviewList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <>
      <h1>Hello world!</h1>
      <ProductInfo />
      <QuestionsAnswers />
      <Card />
      <ReviewList />
      </>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
