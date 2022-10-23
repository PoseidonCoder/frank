import styles from "../styles/Home.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

library.add(faMicrophone, faMicrophoneSlash);

const wakeup = "hey Frank";

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

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  useEffect(() => {
    const checkTranscript = async () => {
      if (finalTranscript.startsWith(wakeup)) {
        const request = finalTranscript.split(wakeup + " ")[1];
        const response = await axios
          .post("/api/generate", {
            request,
          })
          .then((response) => response.data);

        const utterance = new SpeechSynthesisUtterance(response);
        window.speechSynthesis.speak(utterance);
      }
      resetTranscript();
    };

    checkTranscript();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

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
        <h1>{interimTranscript}</h1>
      </div>
    </>
  );
}

export default App;
