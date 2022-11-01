import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const response = await openai.createCompletion({
    model: "davinci",
    prompt: generateRequest(req.body.request),
    temperature: 0.7,
    max_tokens: 200,
    stop: ["\n"],
    frequency_penalty: 2,
    presence_penalty: 0,
  });

  let result = response.data.choices[0].text;
  try {
    res.status(200).send(JSON.parse(result));
  } catch (error) {
    console.log("result", result);
    console.log(error);
    res.status(500).send(error);
  }
}

const generateRequest = (
  request
) => `This is a virtual assistant named Frank that classifies requests and outputs what should be executed in JSON form. There are four ID's with different functions: speak, time, weather, and dictionary (to look up words).
why is the sky blue-->{"id":"speak","arguments":["Sunlight reaches Earth's atmosphere and is scattered in all directions by all the gases and particles in the air."]}
how many houseflies are there?-->{"id":"speak","arguments":["I don't know."]}
what time is it-->{"id":"time","arguments":[]}
who is the president-->{"id":"speak","arguments":["Joseph R. Biden"]}
what is the weather-->{"id":"weather","arguments":[]}
open YouTube-->{"id":"code","arguments":["window.open('youtube.com')"]}
what does the word obstreperous mean-->{"id":"dictionary","arguments":["obstreperous"]}
what is the meaning of paradox-->{"id":"dictionary","arguments":["paradox"]}
${request}-->`;
