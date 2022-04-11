const path = require("path");

const imageNamer = (originalName: string) => {
  const nameParsed = path.parse(originalName);
  if (nameParsed.name.length > 30) {
    nameParsed.name = nameParsed.name.substring(0, 29);
  }
  const imageName = nameParsed.name.split(" ").join("_");
  const imageExt = nameParsed.ext;

  const newImageName = imageName + "_" + Date.now() + imageExt;
  return newImageName;
};

export default imageNamer;
