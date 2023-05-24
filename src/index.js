const dotenv = require("dotenv");
const getInteractions = require("./data");
const render = require("./image");
const {getUser} = require("./api");
const {renderText} = require("./text");
const Twitter = require("twitter-lite");

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

	// render the image
	await render([
		{distance: 0, count: 1, radius: 110, users: [user]},
		{distance: 200, count: layers[0], radius: 64, 
			users: [
				{screen_name: "joebiden", avatar: "https://pbs.twimg.com/profile_images/1276559966212654081/0oGAop6Q_400x400.jpg"},
				{screen_name: "kanyewest", avatar: "https://pbs.twimg.com/profile_images/1227379798656221696/_d7a9xlg_400x400.jpg"},
				{screen_name: "elonmusk", avatar: "https://pbs.twimg.com/profile_images/1295975423654977537/dHw9JcrK_400x400.jpg"},
				{screen_name: "BarackObama", avatar: "https://pbs.twimg.com/profile_images/822547732376207360/5g0FC8XX_400x400.jpg"},
				{screen_name: "katyperry", avatar: "https://pbs.twimg.com/profile_images/1195380678477143553/USVh7v6B_400x400.jpg"},
				{screen_name: "rihanna", avatar: "https://pbs.twimg.com/profile_images/1279342408751986177/oOeFyFz_400x400.jpg"}
			]

			},
	]);

	// Look at the arguments passed to the cli. If one of them is --text then we want to render a text version of the image too
	const shouldRenderText = process.argv.find((arg) => arg === "--text");
	if (shouldRenderText) await renderText(data);
}

// entry point
main();
