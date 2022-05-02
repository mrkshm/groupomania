import fs from "fs";

const fileSaver = async (file: any, name: string) => {
  try {
    const data = fs.readFileSync(file.path);

    fs.writeFileSync(`./public/${name}`, data);
    return;
  } catch (error) {
    console.log("There was an error saving the file.");
  }
};
export default fileSaver;
