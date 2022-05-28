import React, {useState, useCallback} from "react";
import {Container, Button, Grid, TextField, InputLabel, Select, MenuItem} from '@mui/material';
import {synthesizeText} from "../api";

const App = () => {
    const [text, setText] = useState("");
    const [submittedText, setSubmittedText] = useState("");
    const [cacheKey, setCacheKey] = useState("");
    const [language, setLanguage] = useState(window.localStorage.getItem("lang") ?? "pl");

    const handleChangeText = useCallback(event => {
        setText(event.target.value);
    }, []);

    const handleLanguageChangeText = useCallback(event => {
        setLanguage(event.target.value);
        window.localStorage.setItem("lang", event.target.value);
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

    return (
        <Container>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <InputLabel>Text to synthesize:</InputLabel>
                </Grid>
                <Grid item xs={10}>
                    <TextField multiline fullWidth value={text} onChange={handleChangeText}/>
                </Grid>
                <Grid item xs={2}>
                    <Select
                        fullWidth
                        value={language}
                        label="Language"
                        onChange={handleLanguageChangeText}
                    >
                        <MenuItem value={"pl"}>Polish</MenuItem>
                        <MenuItem value={"pt"}>Portuguese</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="primary" type="submit" onClick={handleSubmitText}>
                        Synthesize
                    </Button>
                </Grid>

                {cacheKey && (
                    <Grid item xs={12}>
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
                    </Grid>
                )}

            </Grid>
        </Container>
    );
};

export default App;
