const fs = require('fs');
const path = require('path');
const debug = require('debug')('app:startup');
const config = require('config');
const validateCourse = require('./validators/courseValidator');
const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middlewares/logger');
const authenticate = require('./middlewares/authenticate');

// Configuration
debug(`Application Name: ${config.get('name')}`);
debug(`Mail Server Name: ${config.get('mail.host')}`);
debug(`Mail Server Passwd: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(
      morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'logs', 'error.log'), {
          flag: 'a'
        })
      })
    );
    
    app.use(
      morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {
          flags: 'a'
        })
      })
    );
    app.use(morgan('dev'));

    debug('Morgan enabled...');
}

app.set('view engine', 'pug');
app.set('views', './views');  // default

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.use(logger);
// app.use(authenticate);

let courses = [
  { id: 1, name: 'course 1' },
  { id: 2, name: 'course 2' },
  { id: 3, name: 'course 3' },
  { id: 4, name: 'course 4' }
];

app.get('/', (req, res) => {
  res.render('index', { title: 'My Express App', message: 'Hello, World!' });
});

app.get('/api/courses', (req, res) => {
  res.send(JSON.stringify(courses));
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );

  if (!course) {
    res.status(404).send('The course with the given ID was not found');
  }
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);

  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );

  if (!course) {
    res.status(400).send('The course with the given ID was not found');
    return;
  }

  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details);
    return;
  }

  const updatedCourse = {
    ...course,
    name: req.body.name
  };

  courses[--course.id] = updatedCourse;

  res.send(updatedCourse);
});

app.delete('/api/courses/:id', (req, res) => {
  let course = courses.find((course) => course.id === parseInt(req.params.id));

  if (!course) {
    res.status(400).send('The course with the given ID was not found');
    return;
  }

  courses = courses.filter((course) => course.id !== parseInt(req.params.id));

  res.send(courses);
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listens on port ${PORT}`);
});
