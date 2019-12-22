import React, { useState, useCallback } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./App.css";
import { synthesizeText } from "../api";

const App = () => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [cacheKey, setCacheKey] = useState("");

  const handleChangeText = useCallback(event => {
    setText(event.target.value);
  }, []);

  const handleSubmitText = useCallback(
    e => {
      e.preventDefault();
      synthesizeText(text).then(key => {
        setSubmittedText(text);
        setCacheKey(key);
      });
    },
    [text]
  );

  return (
    <Container>
      <Row className="pt-3">
        <Col>
          <Form>
            <Form.Group controlId={"speechForm.inputText"}>
              <Form.Label>Text to synthesize:</Form.Label>
              <Form.Control
                as="textarea"
                value={text}
                onChange={handleChangeText}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmitText}>
              Synthesize
            </Button>
          </Form>
        </Col>
      </Row>

      {cacheKey && (
        <Row className="pt-3">
          <Col>
            <figure>
              <figcaption>
                Listen "<b>{submittedText}</b>"
              </figcaption>
              <br />
              <audio controls src={`/audio/${cacheKey}`}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            </figure>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;
