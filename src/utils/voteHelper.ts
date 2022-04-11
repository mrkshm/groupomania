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
  console.log("start");
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
    console.log("ResJ is ", resJ);

    return resJ;
  } catch (error) {
    console.log("Erring out in voteHelper");
  }
};

export default voteHelper;
