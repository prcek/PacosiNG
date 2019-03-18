

//const { gitDescribeSync } = require('git-describe');
const { writeFileSync } = require('fs');
const path = require('path');
//const info = gitDescribeSync();
//const infoJson = JSON.stringify(info, null, 2);


const ver = process.env.SOURCE_VERSION || '<undefined>'
const infoJson = JSON.stringify({hash: ver});
writeFileSync(path.join(__dirname, 'srv/git-version.json'), infoJson);
writeFileSync(path.join(__dirname, 'src/git-version.json'), infoJson);

