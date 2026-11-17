const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const W3_DIR = "/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3";
const VIDEO_FOLDER_ID = "13KrRWKxQx-GCnzi6a4-YIxg0SReTSqyb";
const FAMILY_FOLDER_ID = "16b3KM6d7FrsQx0zJbN3cDi97KlrDejrY";

const files = fs.readdirSync(W3_DIR).filter(f => !f.startsWith('.')).sort();
console.log("Uploading Whatsapp 3 files:", files);

const w3MapPath = path.join(__dirname, 'public/media/roka/gdrive_w3_upload_map.json');
let w3Map = {};
if (fs.existsSync(w3MapPath)) {
  try { w3Map = JSON.parse(fs.readFileSync(w3MapPath, 'utf8')); } catch(e){}
}

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  if (w3Map[file]) {
    console.log(`Already uploaded: ${file} -> ${w3Map[file]}`);
    continue;
  }
  const filePath = path.join(W3_DIR, file);
  console.log(`[${i+1}/${files.length}] Uploading ${file} to Google Drive...`);
  try {
    const out = execSync(`gdrive mutate upload "${filePath}" --parent "${VIDEO_FOLDER_ID}"`, { encoding: 'utf8' });
    const match = out.match(/ID:\s*([a-zA-Z0-9_-]+)/i);
    if (match) {
      const fileId = match[1];
      w3Map[file] = fileId;
      console.log(`Uploaded ${file} -> ${fileId}`);
      fs.writeFileSync(w3MapPath, JSON.stringify(w3Map, null, 2));
    } else {
      console.log(`No ID matched in output:`, out);
    }
  } catch (err) {
    console.error(`Error uploading ${file}:`, err.message);
  }
}

console.log("Done uploading Whatsapp 3 to Google Drive!");
