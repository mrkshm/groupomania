import voteLogic from "./voteLogic";

interface voteHelperPropType {
  entityId: number;
  userId: string;
  voteValue: number;
  userVote: number;
}

const voteHelper = async (
  entityId: number,
  userId: string,
  voteValue: number,
  userVote: number,
  action?: string
) => {
  // @ts-ignore
  const { uservoteLocal, change } = voteLogic(userVote, voteValue);
  const url = action === "comment" ? "/api/vote/comment" : "/api/vote/post";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: entityId,
        value: uservoteLocal,
        userId: userId
      })
    });
    const resJ = await res.json();
    resJ.userVote = uservoteLocal;
    resJ.voteScoreChange = change;

    return resJ;
  } catch (error) {
    console.log(error);
  }
};

export default voteHelper;
