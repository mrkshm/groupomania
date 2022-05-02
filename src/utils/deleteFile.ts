import fs from "fs";

const deleteFile = async (name: string) => {
  fs.unlink(`./public/${name}`, () => {
    console.log("old image deleted");
  });
};
export default deleteFile;
