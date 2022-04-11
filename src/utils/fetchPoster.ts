const fetchPoster = async (url: string, payload: any) => {
  const res = await fetch(url, {
    method: "POST",
    body: payload
  });
  const resJ = await res.json();
  return resJ;
};

export default fetchPoster;
