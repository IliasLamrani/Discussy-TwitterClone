// -------------- STYLE ----------------- \\

const DOMStrings = {
    nightButton: document.getElementById('night-mode'),
    talkButton: document.getElementById('talk-button'),
    title: document.querySelector('h1'),
    name: document.querySelector('input'),
    message: document.querySelector('textarea'),
    ball: document.getElementById('loading-ball'),
    inputBox: document.getElementById('user-input'),
    form: document.querySelector('form'),
    tweetList: document.querySelector('#tweet-list'),
};
var night = false;

DOMStrings.ball.style.display = 'none';
function switchMode() {
    DOMStrings.nightButton.classList.toggle('dark-mode-button');
    DOMStrings.talkButton.classList.toggle('dark-mode-button');
    DOMStrings.title.classList.toggle('dark-mode-title');
    DOMStrings.name.classList.toggle('dark-mode-input');
    DOMStrings.message.classList.toggle('dark-mode-input');
}

DOMStrings.nightButton.addEventListener('click', function() {
    night = (night == false) ? true : false;

    if (night) {
        document.body.style.backgroundColor = 'grey';
        DOMStrings.nightButton.textContent = "Light mode";
    } else {
        document.body.style.backgroundColor = 'white';
        DOMStrings.nightButton.textContent = "Dark mode";
    }
    switchMode();
})

//------------------------------------------\\

getAllTweets();

//SEND TWEET TO THE SERVER
DOMStrings.talkButton.addEventListener('click', async function(event) {
    event.preventDefault();

    var name = DOMStrings.name.value;
    var message = DOMStrings.message.value;
    var tweet = {
        name,
        message
    };

    DOMStrings.inputBox.style.display = 'none';
    DOMStrings.ball.style.display = '';

    const jsonResponse = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tweet)
    })
    const dataResponse = await jsonResponse.json();

    DOMStrings.inputBox.style.display = '';
    DOMStrings.ball.style.display = 'none';
    DOMStrings.form.reset();
    location.reload();
})

// REQUEST ALL TWEETS AND DISPLAY THEM
function getAllTweets() {
    var html = "<div class='tweet'><img src='%avatar%'><h3>%name%</h3><h4>%date%</h4><p>%message%</p></div>"
    var newhtml, randomAvatar;

    fetch('/serv')
    .then (response => response.json())
    .then (result => {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            randomAvatar = Math.floor(Math.random() * 4) + 1;
            randomAvatar = '../images/avatar_' + randomAvatar + '.svg';
            newhtml = html.replace("%avatar%", randomAvatar);
            newhtml = newhtml.replace('%name%', result[i].name);
            newhtml = newhtml.replace('%date%', result[i].date.slice(0, 10));
            newhtml = newhtml.replace('%message%', result[i].message);
            DOMStrings.tweetList.insertAdjacentHTML('afterbegin', newhtml);
        };
    });
}