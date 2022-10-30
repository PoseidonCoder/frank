import styles from "../styles/Home.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";

library.add(faMicrophone, faMicrophoneSlash);

SpeechRecognition.applyPolyfill(
  createSpeechlySpeechRecognition(process.env.NEXT_PUBLIC_SPEECHLY_ID)
);

function App() {
  const {
    finalTranscript,
    interimTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands: [
      { command: "stop", callback: () => window.speechSynthesis.cancel() },
    ],
  });
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [location, setLocation] = useState();

  const realFinalTranscript = finalTranscript.toLocaleLowerCase();

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
    setInitialRenderComplete(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          setLocation({ latitude, longitude })
      );
    }
  }, []);

  const processRequest = (request) => {
    axios
      .post("/api/generate", {
        request,
        location,
      })
      .then(({ data }) => {
        const utterance = new SpeechSynthesisUtterance(data);
        window.speechSynthesis.speak(utterance);
      });
  };

  useEffect(() => {
    if (realFinalTranscript.startsWith("hey frank")) {
      processRequest(realFinalTranscript.split("hey frank ")[1]);
    }
    resetTranscript();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

  if (!initialRenderComplete) {
    return null;
  } else {
    if (!browserSupportsSpeechRecognition)
      return <span>Browser doesn&#39;t support speech recognition.</span>;

    return (
      <>
        <div
          style={{
            width: "50%",
            margin: "auto",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <h1 className={styles.title}>Frank</h1>
          {listening ? (
            <FontAwesomeIcon
              icon="microphone"
              className={styles.icon}
              onClick={SpeechRecognition.stopListening}
            />
          ) : (
            <FontAwesomeIcon
              icon="microphone-slash"
              className={styles.icon}
              onClick={() =>
                SpeechRecognition.startListening({ continuous: true })
              }
            />
          )}

          <h1>{interimTranscript.toLowerCase()}</h1>
        </div>
      </>
    );
  }
}

export default App;
