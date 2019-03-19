

//const { gitDescribeSync } = require('git-describe');
const { writeFileSync } = require('fs');
const path = require('path');
//const info = gitDescribeSync();
//const infoJson = JSON.stringify(info, null, 2);


const ver = process.env.SOURCE_VERSION || '<undefined>'
const infots = "export const git_hash = '"+ ver +"';\n";
writeFileSync(path.join(__dirname, 'srv/git-version.ts'), infots);
writeFileSync(path.join(__dirname, 'src/git-version.ts'), infots);

