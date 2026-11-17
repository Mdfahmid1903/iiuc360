// Produce a small static folder ready to submit or host on any static host.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const name of ['index.html','css','js','assets'])fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true});
console.log('Static assignment ready in dist/. No backend, installation, or API keys required.');
