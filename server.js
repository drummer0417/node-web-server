const express = require('express');
const hbs = require('hbs'); // Handlebars
const fs = require('fs');
const Mailgun = require('mailgun').Mailgun;

var app = express();
const port = process.env.PORT || 3000;
const testVar = process.env.TESTVAR || "Var not found";

var pageContent = 'This is quite some peace of useless text on this page... But it works, which is GREAT!';
var currentYear = new Date().getFullYear();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// log incomming request
app.use((req, res, next) => {
  var msg = `${new Date().toString()}: ${req.method} ${req.url}`;

  console.log(msg);
  fs.appendFile('./log/server.log', `${msg}\n`, (error) => {
    if (error) {
      console.log(error);
    }
  });
  next();
});

// to desplay maintenance page and not continue uncomment below method
//
// app.use((req, res, next) => {
//
//   res.render('maint.hbs', {
//     pageTitle: 'Maintenance all over your place',
//     pageContent: 'We\'re doing maintenance now JANK!'
//   });
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
  res.render('welcome.hbs', {
    siteName: 'Hans\' site',
    pageTitle: 'Home sweet home',
    welcomeText: 'Welcome to my brand new website.... Tot ziens!',
    pageContent: pageContent
  })
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'GitHub projects',
    pageHeader: 'Projects:',
    pageContent: 'Here you will find an overview of my GitHub Projects'
  });
  console.log(`the testVar\'s value is "${testVar}"`);
});

app.get('/mail', (req, res) => {
  var mg = new Mailgun('key-9379c4aa11ce3ea8e13a3371b34fa770');
  mg.sendText('hans.vanmeurs@gmail.com', ['drummer0417'],
    'I: Test mailtje',
    'Dit is een testmeeltje verzonden door mailgun',
    'noreply@androidappfactory.nl', {}, (err) => {
      if (err) {
        console.log(`Oops Error: ${err}`);;
      } else {
        console.log('Mail sent successful');
      }
    })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'Over ons',
    pageContent: pageContent
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'Bad request. Check your url, correct it and try again... mafkees',
    nickname: ['slome',
      'mafkees', 'gek'
    ]
  })
})

app.listen(port, () => {
  console.log(`Server is up & running on port: ${port} `);
})
