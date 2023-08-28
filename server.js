var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        console.log("@@@@process.env.DATABASE_URL==",process.env.DATABASE_URL)
        console.log("@@@@conn==",conn)
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.Contact SET Phone = $1, MobilePhone = $1, Title = $2, Department = $3 WHERE LOWER(FirstName) = LOWER($4) AND LOWER(LastName) = LOWER($5) AND LOWER(Email) = LOWER($6)',
            [req.body.phone.trim(), req.body.title.trim(), req.body.department.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.Contact (Phone, MobilePhone, Title, Department, FirstName, LastName, Email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                  [req.body.phone.trim(), req.body.phone.trim(), req.body.title.trim(), req.body.department.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
