const fetcher = (url: string) =>
  fetch(url, { method: "GET", credentials: "include" })
    .then(res => res.json())
    .catch(error => console.log(error));

export default fetcher;
