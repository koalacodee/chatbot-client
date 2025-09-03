const fs = require("fs");
const fg = require("fast-glob");

const files = fg.sync(["**/*.{js,jsx,ts,tsx}"], {
  ignore: ["node_modules"],
});

const classNameRegex =
  /\s*className\s*=\s*({[^}]*}|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const updated = content.replace(classNameRegex, "");
  if (content !== updated) {
    fs.writeFileSync(file, updated);
    console.log(`✅ Cleaned: ${file}`);
  }
});
