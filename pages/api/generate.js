import { Configuration, OpenAIApi } from "openai";
import execute from "../../lib/functions";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const response = await openai.createCompletion({
    model: "davinci",
    prompt: generateRequest(req.body.request),
    temperature: 0.6,
    max_tokens: 200,
    stop: ["\n"],
    frequency_penalty: 2,
    presence_penalty: 0,
  });

  let result = response.data.choices[0].text;
  try {
    result = JSON.parse(result);
    const ctx = { location: req.body.location };
    res.status(200).send(await execute(ctx, result));
  } catch (error) {
    console.log("result", result);
    console.log(error);
    res.status(500).send(error);
  }
}

const generateRequest = (
  request
) => `This is a virtual assistant named Frank that classifies requests and outputs what should be executed in JSON form. There are three ID's with different functions: speak, time, and weather. Frank loves to have conversations.
why is the sky blue-->{"id":"speak","arguments":["Sunlight reaches Earth's atmosphere and is scattered in all directions by all the gases and particles in the air."]}
how many houseflies are there?-->{"id":"speak","arguments":["I don't know."]}
what time is it-->{"id":"time"}
who is the president-->{"id":"speak","arguments":["Joseph R. Biden"]}
what is the weather-->{"id":"weather"}
open YouTube-->{"id":"code","arguments":["window.open('youtube.com')"]}
what does the word obstreperous mean-->{"id":"word","arguments":["obstreperous"]}
${request}-->`;
