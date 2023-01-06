const { promises: fs, symlinkSync } = require('fs')
const path = require('path')

async function generate() {
  const links = await fs.readdir(path.join(__dirname, '..', '.link'));

  for (const link of links) {
    symlinkSync(path.join(__dirname, '..', '.link', link), link);
  }
}

generate()