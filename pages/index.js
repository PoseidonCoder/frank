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
import execute from "../lib/functions";

library.add(faMicrophone, faMicrophoneSlash);

SpeechRecognition.applyPolyfill(
  createSpeechlySpeechRecognition(process.env.NEXT_PUBLIC_SPEECHLY_ID)
);

const wakeup = [
  "hey frank",
  "pay frank",
  "hey freak",
  "a frank",
  "i frank",
  "oh fry",
  "i break",
  "hey fra",
  "boy frank",
  "here frank",
  "i rank",
];

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

  const realFinalTranscript = finalTranscript.toLowerCase();
  const realInterimTranscript = interimTranscript.toLowerCase();

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
    setInitialRenderComplete(true);
  }, []);

  const processRequest = (request) => {
    axios
      .post("/api/generate", {
        request,
      })
      .then(({ data }) => {
        console.log(data);
        execute(data);
      });
  };

  useEffect(() => {
    let color = "white";
    if (wakeup.some((v) => realInterimTranscript.indexOf(v) >= 0))
      color = "lightgreen";
    document.body.style.backgroundColor = color;
  }, [interimTranscript]);

  useEffect(() => {
    if (wakeup.some((v) => realFinalTranscript.indexOf(v) >= 0)) {
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
          {realInterimTranscript.startsWith("hey frank") && (
            <p>
              <b>Listening...</b>
            </p>
          )}

          <h1>{realInterimTranscript}</h1>
        </div>
      </>
    );
  }
}

export default App;
