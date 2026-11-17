// Losslessly extract the single RGB image embedded in the supplied ReportLab PDF.
// This preserves the artwork; presentation/cropping is handled by the web layout.
const fs = require('node:fs');
const zlib = require('node:zlib');
const path = require('node:path');
const input = process.argv[2];
if (!input) throw new Error('Pass the source PDF path.');
const pdf = fs.readFileSync(input).toString('latin1');
function ascii85(source) {
  source=source.replace(/\s/g,'').replace(/~>$/,'');
  const output=[];let group=[];
  function flush(chars,count) {let value=0;for(const c of chars)value=value*85+c;const bytes=[(value>>>24)&255,(value>>>16)&255,(value>>>8)&255,value&255];output.push(...bytes.slice(0,count));}
  for(const c of source){if(c==='z'){if(group.length)throw new Error('Invalid ASCII85');output.push(0,0,0,0);continue;}group.push(c.charCodeAt(0)-33);if(group.length===5){flush(group,4);group=[];}}
  if(group.length){const count=group.length-1;while(group.length<5)group.push(84);flush(group,count);}
  return Buffer.from(output);
}
const image=pdf.match(/3 0 obj\s*<<([\s\S]*?)>>\s*stream\r?\n([\s\S]*?)endstream/);
if(!image||!image[1].includes('/Subtype /Image'))throw new Error('Expected embedded image missing');
const width=Number(image[1].match(/\/Width (\d+)/)[1]);
const height=Number(image[1].match(/\/Height (\d+)/)[1]);
const rgb=zlib.inflateSync(ascii85(image[2]));
if(rgb.length!==width*height*3)throw new Error('Unexpected RGB image size');
function crc32(buf){let crc=0xffffffff;for(const byte of buf){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),length=Buffer.alloc(4),checksum=Buffer.alloc(4);length.writeUInt32BE(data.length);checksum.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([length,name,data,checksum]);}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=2;
const scanlines=Buffer.alloc(height*(width*3+1));for(let y=0;y<height;y++)rgb.copy(scanlines,y*(width*3+1)+1,y*width*3,(y+1)*width*3);
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(scanlines)),chunk('IEND',Buffer.alloc(0))]);
fs.writeFileSync(path.join(__dirname,'../assets/iiuc-360-source.png'),png);
// Self-contained viewport wrapper for the browser tab icon; no re-drawing.
const favicon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="236 64 96 108"><defs><filter id="blue" color-interpolation-filters="sRGB"><feColorMatrix type="hueRotate" values="58"/><feColorMatrix type="saturate" values=".65"/></filter></defs><image width="502" height="392" href="data:image/png;base64,${png.toString('base64')}" filter="url(#blue)"/></svg>`;
fs.writeFileSync(path.join(__dirname,'../assets/favicon.svg'),favicon);
console.log(JSON.stringify({width,height,bytes:png.length}));
