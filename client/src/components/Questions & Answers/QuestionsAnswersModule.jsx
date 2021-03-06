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

  const [masterListQuestions, setMasterListQuestions] = useState('');
  const [page, setPage] = useState(2);
  const [questionCount, setQuestionCount] = useState(2);

  const [count, setCount] = useState(2);
  const [message, setMessage] = useState('Load more answers');
  const [showAll, setShowAll] = useState('Show All Answers');

  const [isThereMore, setIsThereMore] = useState(true);

  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [markedAnswers, setMarkedAnswers] = useState([]);


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
      setShowAll('Show Four Answers')
    } else if (showAll === 'Show Four Answers') {
      setCount(4)
      setShowAll('Show All Answers')
    }
  }

  const validateQuestionForm = () => {
    var isNotEmpty = function(field) {
      if(field) {
        var fieldData = field.value;
        if (fieldData.length === 0 || fieldData === '') {
          return false;
        } else {
          return true;
        }
      }
    }

    // var validEmail = function(email) {
    //   if (email.value.includes('@') && email.value.includes('@'))
    // }

    var question = document.getElementById('question_input');
    var username = document.getElementById('username_question');
    var email = document.getElementById('email_question');

    if (isNotEmpty(question) && isNotEmpty(username) && isNotEmpty(email)) {
      return true;
    } else {
      return false;
    }
  }

  const validateAnswerForm = () => {
    var isNotEmpty = function(field) {
      var fieldData = field.value;
      if (fieldData.length === 0 || fieldData === '') {
        return false;
      } else {
        return true;
      }
    }

    var answer = document.getElementById('answer');
    var username = document.getElementById('username_answer');
    var email = document.getElementById('email_answer');

    if (isNotEmpty(answer) && isNotEmpty(username) && isNotEmpty(email)) {
      return true;
    } else {
      return false;
    }
  }

  const onQuestionSubmit = (event, {id}) => {
    event.preventDefault(event);
    if (validateQuestionForm()) {
      axios.post('/qa/questions', {
          body: event.target.question_input.value,
          name: event.target.username_question.value,
          email: event.target.email_question.value,
          product_id: id
      })
      .then((response) => {
        () => question_modal.current.close();
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      alert('Question not submitted. You must fill in all input fields.');
    }

  }

  const onAnswerSubmit = (event, {id}) => {
    event.preventDefault(event);
    if(validateAnswerForm()) {
      axios.post('/qa/questions', {
        question_id: questionId,
        body: event.target.answer.value,
        name: event.target.username_answer.value,
        email: event.target.email_answer.value
      })
      .then((response) => {
        () => answer_modal.current.close();
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      alert('Answer not submitted. You must fill in all input fields.')
    }
  }

  const openQuestionModal = () => question_modal.current.open();

  const openAnswerModal = () => answer_modal.current.open();

  const onAddAnswerClick = (question_body, id) => {
    setCurrQuestion(question_body);
    setCurrQuestionId(id);
  }

  const questionHelpfulnessClicked = (id, question_helpfulness) => {
    if (!markedQuestions.includes(id)) {
      var update = [...markedQuestions, id];
      setMarkedQuestions(update);
      axios.put('/qa/questions', {
        question_helpfulness: question_helpfulness + 1
      }, {
        params: {
          question_id: id
        }
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }

  const answerHelpfulnessClicked = (id, answer_helpfulness) => {
    if(!markedAnswers.includes(id)) {
      var update = [...markedAnswers, id];
      setMarkedAnswers(update);
      axios.put('/qa/answers', {
        answer_helpfulness: answer_helpfulness + 1
      }, {
        params: {
          answer_id: id
        }
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }


  const onSearchChange = (event) => {
    // will have to filter through the questions based on what was just typed after 3 characters.
    // https://dev.to/shubhamtiwari909/real-time-searching-in-reactjs-3mfm
    // prolly will have to setState of the newly filtered questions


    setSearched(event.target.value);
    var filteredQuestions = questions.filter((question) => {
      // if (searched.length < 2) {
      //   return question;
      // }
        if (question.question_body.toLowerCase().includes(searched.toLowerCase())) {
        return question;
      }
    })
    if (searched.length < 2) {
      setQuestions(masterListQuestions);
    } else {
      setQuestions(filteredQuestions);
    }
  }


  useEffect(() => {
    const getQuestions = async() => {
      try {
        var questions = await axios.post('/qa/questions', {
          id: props.product.id
        });
        setQuestions(questions.data.results);
        setMasterListQuestions(questions.data.results);
        if (questions.length <= 2) {
          setIsThereMore(false);
        }
        setLoading(true);
      } catch(err) {
        console.error('Error retrieving questions', err);
      }
  }
  if (props.product) {
    getQuestions();
  }
}, [props.product])

  const getMoreQuestions = async() => {
    try {
      var moreQuestions = await axios.get('/qa/questions', {
        params: {
          product_id: props.product.id,
          page: page,
          count: 10,
        }
      });
      if (moreQuestions.data.length !== 0) {
        var newQuestions = [...questions, ...moreQuestions.data];
        setQuestions(newQuestions);
        setMasterListQuestions(newQuestions);
        setQuestionCount(questionCount + 2);
        setPage(page+1);
      } else {
        var qs = [...questions];
        setQuestions(qs);
        setMasterListQuestions(qs);
        setQuestionCount(qs.length);
        setIsThereMore(false);
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
          <div className="q-a-container">
          <h5>QUESTIONS & ANSWERS</h5>
          <Search handleChange={onSearchChange}/>
          {loading ? <QuestionsList markedAnswers={markedAnswers} markedQuestions={markedQuestions} question_count={questionCount} showAllAnswers={showAllAnswers} showAllMsg={showAll} show={show} message={message} setMessage={setMessage} count={count} setCount={setCount} answerHelpfulnessClicked={answerHelpfulnessClicked} handleHelpfulnessClick={questionHelpfulnessClicked} addAnswer={onAddAnswerClick} openAnswerModal={openAnswerModal} openModal={openQuestionModal} productQA={example.results} questions={questions}/> : null }
          <Modal ref={question_modal}>
            <AddQuestion onSubmit={onQuestionSubmit} product={props.product}/>
          </Modal>
          <AnswerModal ref={answer_modal}>
            <AddAnswer onSubmit={onAnswerSubmit} currQuestion={currQuestion} product={props.product}/>
          </AnswerModal>
          <button className="btn btn-question-modal " onClick={() => question_modal.current.open()}>Add Question</button>
          {isThereMore ? <button className="btn btn-load-more-questions" onClick={() => getMoreQuestions()}>Load More Questions</button> : <button className="btn" onClick={() => {
            setQuestionCount(2);
            setIsThereMore(true);
          }}>Hide Questions</button>}
          </div>

        )
}

export default QuestionsAnswers;