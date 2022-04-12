import fs from "fs";

const fileSaver = async (file: any, name: string) => {
  try {
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./static/public/${name}`, data);
    console.log("dirname is", __dirname);

    await fs.unlinkSync(file.path);
    return;
  } catch (error) {
    console.log("There was an error saving the file.");
  }
};
export default fileSaver;
