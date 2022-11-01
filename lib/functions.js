import axios from "axios";

const time = () => say("The time is " + new Date().toLocaleTimeString());
const speak = (text) => say(text);
const weather = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
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

        say(
          `It is ${Math.floor(
            (response.data.main.temp - 273.15) * (9 / 5) + 32
          )} degrees farenheit and ${response.data.weather[0].description}`
        );
      }
    );
  }
};
const code = (code) => eval(code);
const dictionary = async (word) => {
  const response = await axios.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
  );
  say(
    response.data[0].meanings.map(
      (definition) =>
        `as an ${definition.partOfSpeech} ${response.data[0].word} is defined as ${definition.definitions[0].definition}`
    )
  );
};

const say = (text) =>
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

const functions = {
  time,
  speak,
  weather,
  code,
  dictionary,
};

const execute = (command) =>
  command.arguments
    ? functions[command.id](...command.arguments)
    : functions[command.id]();

export default execute;
