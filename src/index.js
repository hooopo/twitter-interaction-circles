const dotenv = require("dotenv");
const getInteractions = require("./data");
const render = require("./image");
const {getUser} = require("./api");
const {renderText} = require("./text");
const Twitter = require("twitter-lite");

const mysql = require('mysql2');

function conn() {
  const url = process.env.DATABASE_URL;
	console.log(url);
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const port = parsedUrl.port;
  const user = parsedUrl.username;
  const password = parsedUrl.password;
  const database = parsedUrl.pathname.replace("/", "");

  const conn = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });
	
	conn.query("SELECT * FROM users limit 10", function (err, result, fields) {
		if (err) throw err;
		console.log(result);
	});

}

/**
 * Load the environment variables from the .env file
 */
dotenv.config();

/**
 * This is the main function of the app. It need to be a function because we can't have a top level await.
 */
async function main() {


	// fetch the information of the logged in user
	// instead of getMe you could replace it with another method to get a third user to generate their circles
	const user = {screen_name: "realDonaldTrump", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"};

	// this is how many users we will have for each layer from the inside out
	const layers = [8, 15, 26];

	conn();


	// render the image
	await render([
		{distance: 0, count: 1, radius: 110, users: [user]},
		{distance: 200, count: layers[0], radius: 64, 
			users: [
				{screen_name: "joebiden", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"},
				{screen_name: "kanyewest", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"},
				{screen_name: "elonmusk", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"},
				{screen_name: "BarackObama", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"},
				{screen_name: "katyperry", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"},
				{screen_name: "rihanna", avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"}
			]

			},
	]);

	// Look at the arguments passed to the cli. If one of them is --text then we want to render a text version of the image too
	const shouldRenderText = process.argv.find((arg) => arg === "--text");
	if (shouldRenderText) await renderText(data);
}

// entry point
main();
