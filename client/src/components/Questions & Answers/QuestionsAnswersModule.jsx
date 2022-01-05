import React, { useRef, useState, useEffect } from 'react';
import QuestionsList from './QuestionsList.jsx';
import AddQuestion from './AddQuestion.jsx';
import Modal from './AddQuestionModal.jsx';
import AddAnswer from './AddAnswer.jsx';
import AnswerModal from './AddAnswerModal.jsx';
import Search from './Search.jsx';
import example from'./example_data.js';
import key from '../../../../config.js';
import axios from 'axios';

// class QuestionsAnswers extends React.Component {
//   constructor(props) {
//     super(props);
//   }


//   const modal = useRef(null);

//   render() {
//     return (
//       <>
//       <h5>QUESTIONS & ANSWERS</h5>
//       <button onClick={() => modal.current.open()}></button>
//       <QuestionsList productQA={example.results}/>
//       <Modal ref={modal}>
//         Hello World
//       </Modal>
//       </>
//     )
//   }

// }

const QuestionsAnswers = function(props) {
  const question_modal = useRef(null);
  const answer_modal = useRef(null);

  const [productId, setProductId] = useState('');
  const [searched, setSearched] = useState('');
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [currQuestion, setCurrQuestion] = useState('');
  const [questionId, setCurrQuestionId] = useState('');

  const [count, setCount] = useState(2);
  const [message, setMessage] = useState('Load more answers');
  const [showAll, setShowAll] = useState('Show All Answers')



  const show = (message) => {
    if (message === 'Load more answers') {
      setCount(4);
      setMessage('Show Less');
    } else {
      setCount(2);
      setMessage('Load more answers');
    }
  }

  const showAllAnswers = (showAll, max) => {
    if (showAll === 'Show All Answers') {
      setCount(max)
      setShowAll('Show Less')
    } else if (showAll === 'Show Less') {
      setCount(4)
      setShowAll('Show All Answers')
    }
  }




  const onQuestionSubmit = (event, {id}) => {
    event.preventDefault(event);
    axios.post('http://localhost:3000/qa/questions', {
        body: event.target.question.value,
        name: event.target.username.value,
        email: event.target.email.value,
        product_id: id
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const onAnswerSubmit = (event, {id}) => {
    event.preventDefault(event);
    axios.post('http://localhost:3000/qa/questions', {
      question_id: questionId,
      body: event.target.answer.value,
      name: event.target.username.value,
      email: event.target.email.value
    })
  }

  const openQuestionModal = () => question_modal.current.open();

  const openAnswerModal = () => answer_modal.current.open();

  const onAddAnswerClick = (question_body, id) => {
    setCurrQuestion(question_body);
    setCurrQuestionId(id);
  }

  const questionHelpfulnessClicked = (id, question_helpfulness) => {

  }


  const onSearchChange = (event) => {
    // will have to filter through the questions based on what was just typed after 3 characters.
    // https://dev.to/shubhamtiwari909/real-time-searching-in-reactjs-3mfm
    // prolly will have to setState of the newly filtered questions
    setSearched(event.target.value);
    var filteredQuestions = questions.filter((question) => {
      if (searched.length < 2) {
        return question;
      } else if (question.question_body.toLowerCase().includes(searched.toLowerCase())) {
        return question;
      }
    })
    setQuestions(filteredQuestions);
  }


  useEffect(() => {
    const getQuestions = async() => {
      try {
        var questions = await axios.post('http://localhost:3000/qa/questions', {
          id: props.product.id
        });
        setQuestions(questions.data.results);
        setLoading(true);
      } catch(err) {
        console.error('Error retrieving questions', err);
      }
  }
  if (props.product) {
    getQuestions();
  }
}, [props.product])


  // const getQuestions = function(callback) {
  //   axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=${productId}`, {
  //     headers: {
  //       'Authorization': key.TOKEN,
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then((results) => {
  //     console.log(results);
  //     callback(results);
  //     // setQuestions()
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   })
  // }


  return (
          <>
          <h5>QUESTIONS & ANSWERS</h5>
          <Search handleChange={onSearchChange}/>
          <button className="btn-answer-modal" onClick={() => answer_modal.current.open()}>Add Answer</button>
          {loading ? <QuestionsList showAllAnswers={showAllAnswers} showAllMsg={showAll} show={show} message={message} setMessage={setMessage} count={count} setCount={setCount} handleHelpfulnessClick={questionHelpfulnessClicked} addAnswer={onAddAnswerClick} openAnswerModal={openAnswerModal} openModal={openQuestionModal} productQA={example.results} questions={questions}/> : null }
          <Modal ref={question_modal}>
            <AddQuestion onSubmit={onQuestionSubmit} product={props.product}/>
          </Modal>
          <AnswerModal ref={answer_modal}>
            <AddAnswer onSubmit={onAnswerSubmit} currQuestion={currQuestion} product={props.product}/>
          </AnswerModal>
          <button onClick={() => question_modal.current.open()}>Add Question</button>
          </>
        )
}

export default QuestionsAnswers;