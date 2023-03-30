const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { uuid } = require("uuidv4");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');



dotenv.config()



const token_secret = process.env.TOKEN_SECRET;



const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());



const users = [];
const accounts = [];

app.get("/", (req, res) => {
	res.json(users);
});

function generateAccessToken(username) {
	return jwt.sign({ username: username }, token_secret, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
		console.log(err)

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}


app.post("/users", (req, res) => {
	const id = uuid();
	const newUser = req.body;
	users.push({
		username: newUser.username,
		password: newUser.password,
		id: id,
	});
	accounts.push({
		id: uuid(),
		userId: id,
		balance: newUser.balance,
	});
	res.status(200).json({ status: "message recieved succesfully" });
	console.log(accounts);
});

app.post("/sessions", (req, res) => {
	const { username, password } = req.body;
	const userArr = users.filter((user) => {
		return user.username === username
	});
	if (userArr.length < 1) {
		res.status(403).json({
			error: "Invalid username"
		})
		return;
	}
	const user = userArr[0];

	if (user.password === password) {
		const token = generateAccessToken(username)
		res.cookie("token", token, { secure: false, httpOnly: false, maxAge: 10000 })
		console.log(res.getHeaders())
		res.status(200).json({
			status: "Correct password."
		});
	} else {
		res.status(403).json({
			error: "Invalid password"
		})
	}
})

app.get("/me/accounts", authenticateToken, (req, res) => {

})

app.listen(5000);
