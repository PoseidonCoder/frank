import axios from "axios";

const local_time = (ctx) => new Date().toLocaleTimeString();
const speak = (ctx, text) => text;
const weather = async ({ location: { latitude, longitude } }) => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat: latitude,
        lon: longitude,
        appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
      },
    }
  );

  return `It is ${Math.floor(
    (response.data.main.temp - 273.15) * (9 / 5) + 32
  )} degrees farenheit and ${response.data.weather[0].description}`;
};
const code = (ctx, code) => eval(code);
const dictionary = async (ctx, word) => {
  const response = await axios.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
  );
  return response.data[0].meanings.map(
    (definition) =>
      `as an ${definition.partOfSpeech} ${response.data[0].word} is defined as ${definition.definitions[0].definition}`
  );
};

const functions = {
  time: local_time,
  speak,
  weather,
  code,
  word: dictionary,
};

const execute = (ctx, command) =>
  command.arguments
    ? functions[command.id](ctx, ...command.arguments)
    : functions[command.id](ctx);

export default execute;
