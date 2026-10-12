import fs from 'node:fs';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
const pdf = await getDocument({data: new Uint8Array(fs.readFileSync('Officer_Dev_Passing_Out_Parade_Letter.pdf')), useSystemFonts: true}).promise;
const thumbs = [];
for (let n = 1; n <= pdf.numPages; n++) {
 const page = await pdf.getPage(n);
 const viewport = page.getViewport({scale: 1});
 const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
 await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
 fs.writeFileSync(`tmp/pdfs/page-${n}.png`, canvas.toBuffer('image/png'));
 thumbs.push(canvas);
 const text = (await page.getTextContent()).items.map(x=>x.str).join(' ');
 console.log(`Page ${n}: ${text.slice(0,100)} ... ${text.slice(-100)}`);
}
const sheet = createCanvas(600 * 3, 870 * Math.ceil(thumbs.length / 3));
const ctx = sheet.getContext('2d'); ctx.fillStyle = '#ddd'; ctx.fillRect(0,0,sheet.width,sheet.height);
thumbs.forEach((c,i)=>ctx.drawImage(c, (i%3)*600, Math.floor(i/3)*870, 595, 842));
fs.writeFileSync('tmp/pdfs/contact.png',sheet.toBuffer('image/png'));
console.log('Pages:',pdf.numPages);
