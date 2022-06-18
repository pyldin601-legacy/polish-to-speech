import React, {useState, useCallback} from "react";
import {Grommet, Menu, TextArea, FormField, Button} from 'grommet';
import {synthesizeText} from "../api";
import "./App.css"

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
        },
    },
};

const App = () => {
    const [text, setText] = useState("");
    const [submittedText, setSubmittedText] = useState("");
    const [cacheKey, setCacheKey] = useState("");
    const [language, setLanguage] = useState(window.localStorage.getItem("lang") ?? "pl");

    const handleChangeText = useCallback(event => {
        setText(event.target.value);
    }, []);

    const handleLanguageChangeText = useCallback(value => {
        setLanguage(value);
        window.localStorage.setItem("lang", value);
    }, []);

    const handleSubmitText = useCallback(
        e => {
            e.preventDefault();
            synthesizeText(text, language).then(key => {
                setSubmittedText(text);
                setCacheKey(key);
            });
        },
        [text, language]
    );

    const lags = [
        {key: 'pl', label: "Polish", onClick: () => handleLanguageChangeText('pl')},
        {key: 'pt', label: "Portuguese", onClick: () => handleLanguageChangeText('pt')}
    ]

    return (
        <Grommet theme={theme}>
            <FormField label={"Text to synthesize:"}>
                <TextArea multiline fullWidth value={text} onChange={handleChangeText}/>
            </FormField>
            <Menu
                fullWidth
                value={language}
                label={lags.find(l => l.key === language)?.label}
                onChange={handleLanguageChangeText}
                items={lags}
            />

            <Button variant="primary" type="submit" onClick={handleSubmitText}>
                Synthesize
            </Button>

            {cacheKey && (
                <figure>
                    <figcaption>
                        Listen "<b>{submittedText} ({language})</b>"
                    </figcaption>
                    <br/>
                    <audio controls src={`/audio/${cacheKey}`} autoPlay>
                        Your browser does not support the
                        <code>audio</code> element.
                    </audio>
                </figure>
            )}

        </Grommet>
    );
};

export default App;
