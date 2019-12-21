import React, { useState, useCallback } from "react";
import "./App.css";

const App = () => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  const handleChangeText = useCallback(event => {
    setText(event.target.value);
  }, []);

  const handleSubmitText = useCallback(() => {
    setSubmittedText(text);
  }, [text]);

  return (
    <div>
      <input
        className={"input-text"}
        type="text"
        value={text}
        onChange={handleChangeText}
      />
      <button onClick={handleSubmitText}>Submit</button>
      {submittedText && (
        <div>
          <figure>
            <figcaption>
              Listen <b>{submittedText}</b>:
            </figcaption>
            <audio controls src={`/synthesize/${submittedText}`}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </figure>
          <a href={`/synthesize/${submittedText}`} target={"__blank"}>
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
