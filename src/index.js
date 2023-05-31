const render = require("./image");
const {renderText} = require("./text");
const mysql = require('mysql2/promise');

function getDbConfig() {
	const url = process.env.DATABASE_URL;
	const parsedUrl = new URL(url);
	const host = parsedUrl.hostname;
	const port = parsedUrl.port;
	const user = parsedUrl.username;
	const password = parsedUrl.password;
	const database = parsedUrl.pathname.replace("/", "");
	return {
		host: host,
		port: port,
		user: user,
		password: password,
		database: database,
		ssl: {
			minVersion: 'TLSv1.2',
			rejectUnauthorized: true
		}
	}
}

async function getQueryResults(query) {
	const conn = await mysql.createConnection(getDbConfig());
	const [rows, fields] = await conn.execute(query);
	return rows;
}


function splitArray(input, groupSizes) {
  let output = [];
  for (let size of groupSizes) {
    let group = input.splice(0, size);
    output.push(group);
  }

  // If any items are left, add them to the last group
  if (input.length > 0) {
    output[output.length - 1] = output[output.length - 1].concat(input);
  }

  return output;
}

async function main() {
	const user = await getQueryResults('SELECT avatar_url as avatar, login as screen_name FROM curr_user limit 1');

	// this is how many users we will have for each layer from the inside out
	const layers = [8, 15, 26];

	const sqlQuery = 'SELECT avatar_url as avatar, login as screen_name FROM users limit 49';
  const results = await getQueryResults(sqlQuery);

	const users = splitArray(results, layers);


	// render the image
	await render([
		{distance: 0, count: 1, radius: 110, users: [user]},
		{distance: 200, count: layers[0], radius: 64, users: users[0]},
		{distance: 330, count: layers[1], radius: 58, users: users[1]},
		{distance: 450, count: layers[2], radius: 50, users: users[2]},
	]);

}

main();
