const fs = require('fs');
const path = require('path');

const readDirectoryRecursively = (dir) => {
  const result = {};

  const readDir = (currentPath) => {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stats = fs.lstatSync(fullPath);

      if (stats.isDirectory()) {
        readDir(fullPath); // Recursively read subdirectory
      } else {
        result[fullPath.replace(dir, '').slice(1).replaceAll("\\",'/')] = fs.readFileSync(fullPath).toString(); // Store file path as key and name as value
      }
    });
  };

  readDir(dir);
  return result;
};

module.exports = readDirectoryRecursively;