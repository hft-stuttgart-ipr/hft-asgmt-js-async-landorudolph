const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
const db = new sqlite3.Database('./db/shoutbox.db');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', async (req, res) => {
  db.all('SELECT * FROM shouts', (err, shouts) => {
    res.render('pages/index', { shouts })
  });
});

app.get('/api/shouts', async (req, res) => {
  db.all('SELECT * FROM shouts', (err, shouts) => {
    res.json(shouts);
  });
});

app.post('/api/shouts', (req, res) => {
  if (req.body.username && req.body.message) {
    db.run('INSERT INTO shouts(username, message) VALUES (?, ?);', [req.body.username, req.body.message], function (err) {
      if(err) {
        res.json({error: err});

      } else {
        res.json({
          ...req.body,
          id: this.lastID,
        });
      }
    });
  } else {
    res.json({error: "Requested body is not correct"});
  }
});

const server = app.listen(port, () => {
 console.log(`Server listening on port ${port}…`)
});

module.exports = server
