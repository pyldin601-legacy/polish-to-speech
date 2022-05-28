import axios from "axios";

export function synthesizeText(text, language) {
  return axios
    .post(`/synthesize`, { text, language })
    .then(response => response.data.key);
}
