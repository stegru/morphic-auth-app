// invoked by npm after install

const fs = require("fs");
const path = require("path");

// copy the svg files from bootstrap-icons
copyDir("./node_modules/bootstrap-icons/icons", "./src/img/bootstrap-icons");

/**
 * Copies a directory (just the files).
 * @param {String} from Source directory.
 * @param {String} to Destination directory.
 */
function copyDir(from, to)
{
  // eslint-disable-next-line no-console
  console.log(`Copying ${from} to ${to}`);
  fs.mkdirSync(to, {recursive: true});
  fs.readdirSync(from, {withFileTypes: true}).forEach(file => {
    if (file.isFile()) {
      fs.copyFileSync(path.join(from, file.name), path.join(to, file.name));
    }
  });
}

