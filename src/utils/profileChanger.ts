const profileChanger = async (url: string, payload: FormData) => {
  const res = await fetch(url, { method: "PUT", body: payload });
  if (!res.ok) {
    console.log("Il y avait un erreur.");
    return;
  }
  const resJ = await res.json();
  return resJ;
};

export default profileChanger;
