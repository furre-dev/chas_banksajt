const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { JsonDB, Config } = require("node-json-db");

dotenv.config();

const token_secret = process.env.TOKEN_SECRET;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const usersDB = new JsonDB(new Config("usersDataBase", true, true, "/"));
const accountsDB = new JsonDB(new Config("accountsDatabase", true, true, "/"));

app.get("/", (req, res) => {
	res.json(users);
});

function generateAccessToken(userId) {
	return jwt.sign({ id: userId }, token_secret);
}

app.post("/create-user", async (req, res) => {
	const input = req.body;

	const userId = uuid();
	const user = {
		username: input.username,
		password: input.password,
		id: userId,
	};
	await usersDB.push("/users[]", user, true);

	const bankAccountId = uuid();
	await accountsDB.push(
		"/accounts[]",
		{
			id: bankAccountId,
			userId: userId,
			balance: input.balance,
		},
		true,
	);

	const accessToken = generateAccessToken(userId);

	return res.status(200).json({ access_token: accessToken });
});

app.post("/login-user", async (req, res) => {
	const { username, password } = req.body;

	const users = await usersDB.getData("/users");

	const user = users.find(
		(user) => user.username === username && user.password === password,
	);

	if (!user) {
		return res.status(403).json({
			error: "No user with that username or password has been found :(",
		});
	}

	const userId = user.id;

	const accessToken = generateAccessToken(userId);

	return res.status(200).json({ access_token: accessToken });
});

function authenticateTokenMiddleware(req, res, next) {
	const accessToken = req.headers.authorization.split(" ")[1];
	if (!accessToken) {
		return res.status(401).json({
			error: "No access token",
		});
	}

	jwt.verify(
		accessToken,
		process.env.TOKEN_SECRET,
		async (error, decodedToken) => {
			if (error) {
				return res.sendStatus(403).json({
					error: "Unauthorized, couldn't verify token",
				});
			}

			const users = await usersDB.getData("/users");

			const user = users.find((user) => user.id === decodedToken.id);

			if (!user) {
				return res.sendStatus(403).json({
					error: "Unauthorized, couldn't find user",
				});
			}

			req.user = user;

			next();
		},
	);
}

app.get("/me", authenticateTokenMiddleware, async (req, res) => {
	const user = req.user;

	const accounts = await accountsDB.getData("/accounts");
	const account = accounts.find((account) => account.userId === user.id);

	return res.status(200).json({ account, user });
});

app.listen(5000);
