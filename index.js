const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { uuid } = require("uuidv4");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = [];
const accounts = [];

app.get("/", (req, res) => {
	res.json(users);
});

app.post("/users", (req, res) => {
	const id = uuid();
	const newUser = req.body;
	console.log(newUser);
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
	res.send("message recieved succesfully");
	console.log(accounts);
});

app.listen(5000);
