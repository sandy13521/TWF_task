//Import Modules and Set References.
const express = require("express");
const firebase = require("./firebase");
const path = require("path");
const { request } = require("http");
const { response } = require("express");
const { dir } = require("console");
const { type } = require("os");
const app = express();
let port = process.env.PORT || 9876;

app.listen(port);
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

// Home Page
app.get("/", (request, response) => {
    response.sendFile('./html/home.html', { root: __dirname });
});

//Login Page
app.get("/login", (request, response) => {
    response.sendFile('./html/login.html', { root: __dirname });
});

// Login Request
app.post("/login", (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(r => {
            let user = firebase.auth().currentUser;
            let database = firebase.database();
            database.ref().child("users").child(user.uid).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    response.redirect("/dashboard");
                } else {
                    response.sendFile("./html/get_details.html", { root: __dirname });
                }
            }).catch(error => {
                console.log(error.message);
            })
        })
        .catch(error => {
            console.log(error.message);
            response.redirect("/");
        });
});

// Sign Up Page
app.get("/signup", (request, response) => {
    response.sendFile("./html/signup.html", { root: __dirname });
});

// Sign Up Request
app.post("/signup", (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    let repassword = request.body.repassword;
    if (password === repassword) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
            response.redirect("/");
        }).catch((error) => {
            console.log(error.message);
        });
    } else {
        response.send("<h1>Passwords don't match</h1>");
    }
});

app.post("/add_details", (request, response) => {
    let dob = request.body.dob;
    let place_of_birth = request.body.placeofbirth;
    let address = request.body.address;
    console.log(dob);
    console.log(place_of_birth);
    console.log(address);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log(user.uid);
            let database = firebase.database();
            database.ref().child("users").child(user.uid).set({
                dob: dob,
                placeofbirth: place_of_birth,
                address: address
            }).catch(error => {
                console.log(error.message);
                console.log("DATABASE ERROR");
            });
            response.redirect('/dashboard');
        } else {
            response.redirect('/');
        }
    });
});

app.get('/dashboard', (request, response) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let database = firebase.database();
            const data = [];
            const head = [];
            database.ref().child("users").child(user.uid).once('value').then(function(snapshot) {
                head.push('DOB');
                data.push(snapshot.val()['dob']);
                head.push('Address');
                data.push(snapshot.val()['address']);
                head.push('Place Of Birth');
                data.push(snapshot.val()['placeofbirth']);
                response.render(path.resolve('./html/dashboard'), {
                    data: data,
                    head: head
                });
            }).catch(error => {
                console.log(error.message);
            })
        } else {
            response.redirect('/');
        }
    });
});