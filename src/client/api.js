import axios from "axios";

export function synthesizeText(text) {
  return axios
    .post(`/synthesize`, { text })
    .then(response => response.data.key);
}
