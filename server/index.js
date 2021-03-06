const express = require('express');
const key = require('../config');
const axios = require('axios');
const compression = require('compression');

let app = express();

app.use(compression());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});
app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/home', function(req, res) {
  axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/40344', {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then(results => {
      res.send([results.data]);
    })
    .catch(err => {
      console.log('There was an error getting products from the API: ', err);
    })
});



app.post('/related', (req, res) => {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${req.body.id}/related`, {
    headers: {
      Authorization: key.TOKEN
    }
  })
  .then(related => {
    res.send(related.data);
  })
  .catch(err => {
    console.log('Error getting related products: ', err);
  })
})

app.post('/reviews', function(req, res) {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews?product_id=${req.body.id}&sort=${req.body.sort}
  `, {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then(results => {
      res.send(results.data);
    })
    .catch(err => {
      console.log('There was a server error getting reviews from the API: ', err);
    })
});

app.post('/metareviews', function(req, res) {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews/meta?product_id=${req.body.id}
`, {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then(results => {
      res.send(results.data);
    })
    .catch(err => {
      console.log('There was a server error getting meta reviews from the API: ', err);
    })
});

app.post('/qa/questions', function(req, res) {
  if (req.body.question_helpfulness) {

  } else if (req.body.question_id) {
    axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${req.body.question_id}/answers`, {
      body: req.body.body,
      name: req.body.name,
      email: req.body.email
    }, {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.error(err, 'this is not an error');
    })
  } else if (req.body.body) {
    axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=${req.body.product_id}`, {
        body: req.body.body,
        name: req.body.name,
        email: req.body.email,
        product_id: req.body.product_id
    }, {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.error(err, 'this is not an eerror');
    })
  } else {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=${req.body.id}`, {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then(results => {
      res.send(results.data);
    })
    .catch(err => {
      console.error('Failed to retrieve questions from API: ', err);
    })
  }
});

app.get('/qa/questions', function(req, res) {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=${req.query.product_id}&page=${req.query.page}&count=${req.query.count}`, {
    headers: {
      Authorization: key.TOKEN
    }
  })
  .then((results) => {
    res.send(results.data.results);
  })
  .catch((error) => {
    console.error('Error loading more questions', error);
  })
})

app.put('/qa/questions', function(req, res) {
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${req.query.question_id}/helpful`,{
    question_helpfulness: req.body.q_helpfulness
  }, {
    headers: {
      Authorization: key.TOKEN
    }
  })
  .then((results) => {
    console.log('Successfully updated question helpfulness rating for question: ',req.query.question_id);
  })
  .catch((error) => {
    console.error('Error updating question helpfulness rating. ', error);
  })
})

app.put('/qa/answers', function(req, res) {
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/answers/${req.query.answer_id}/helpful`, {
    answer_helpfulness: req.body.answer_helpfulness
  }, {
    headers: {
      Authorization: key.TOKEN
    }
  })
  .then((results) => {
    console.log('Successfully updated answer helpfulness rating for answer: ',req.query.answer_id);
  })
  .catch((err) =>  {
    console.error('Error updating answer helpfulness rating. ', err);
  })
});

app.post('/reviews/avg', function(req, res) {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews?product_id=${req.body.id}`, {
      headers: {
        Authorization: key.TOKEN
      }
    })
    .then(reviews => {
      const count = reviews.data.count;
      let total = 0;
      for (let i = 0; i < count; i++) {
        if (reviews.data.results[i]) {
          total += reviews.data.results[i].rating;
        }
      }
      res.send(String(total/count));
    })
    .catch(err => {
      console.log('There was a server error getting reviews from the API: ', err);
    })
  });


// app.get('/qa/questions', function(req, res) {
//   axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions?product_id=40355', {
//     headers: {
//       Authorization: key.TOKEN
//     }
//   })
//   .then(results => {
//     res.send(results.data);
//   })
//   .catch(err => {
//     console.error('Failed to retrieve questions from API: ', err);
//   })
// })

app.post('/styles', function(req, res) {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${req.body.id}/styles`, {
    headers: {
      Authorization: key.TOKEN
    }
  })
  .then(results => {
    res.send(results.data);
  })
  .catch(err => {
    console.log('There was an error getting the styles from the API: ', err);
  })
})

app.post('/details', function(req, res) {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${req.body.id}`, {
    headers: {
      Authorization: key.TOKEN
    }
  })
  .then(related => {
    res.send(related.data);
  })
  .catch(err => {
    console.log('Error getting product details: ',err);
  })
})

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
