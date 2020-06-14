const express = require('express');
const mongoose = require('mongoose');
const tweetModel = require('./models/Tweet');
const Filter = require('bad-words');

require('dotenv').config();

const app = express();
const filter = new Filter();
const port = process.env.PORT || 3000;
const database = process.env.DB_URL;




// PORT AND DB CONNECTION
app.listen(port, () => console.log(`server running on port ${port}`));

mongoose.connect(database,
     { useNewUrlParser: true, useUnifiedTopology: true },
     () => console.log('Connected to DB')
);


app.use(express.static('public'));
app.use(express.json());

function isStringCorrect(name,comment) {
    if (name.trim() === '' || comment.trim() === '')
        return false;
    else return true;
}

// RECEIVE AND STORE TWEET IN DB
app.post('/api', (req, res) => {
    
    const tweet = new tweetModel;

    tweet.name = filter.clean(req.body.name.toString());
    tweet.message = filter.clean(req.body.message.toString());

    if (isStringCorrect(tweet.name, tweet.message)) {
        tweet.save(function (err, docs) {
            if (err)
                console.log('Error with DB !');
            else {
                console.log('Tweet stored in DB');
                res.json(docs);
            }
        });
    }
    else {
        res.json({
            status: "422",
            message: "bad input",
        });
    }
});

//GET AND SEND ALL TWEETS TO CLIENT
app.get('/serv', (req, res) => {
    tweetModel.find({}, function(err, tweets) {
        if (err) {
            console.log('Could not get tweets from DB');
            res.json({
                status: "error",
                message: "can't access to DB"
            });
        }
        else {
            console.log("Sending back all tweets !");
            res.json(tweets);
        }
    });
});


