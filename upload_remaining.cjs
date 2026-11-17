const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const P2_DIR = "/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/PhotoGrapher Non Edited /Photographer 2";
const P2_FOLDER_ID = "1oxHHub6j6Lk4AYPrscdjVbtf65sZtS7a";

const W1_DIR = "/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1";
const W2_DIR = "/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 2";
const FAMILY_FOLDER_ID = "16b3KM6d7FrsQx0zJbN3cDi97KlrDejrY";

// 1. Upload Photographer 2
console.log("=== Starting Photographer 2 Uploads ===");
const p2MapPath = path.join(__dirname, 'public/media/roka/gdrive_p2_upload_map.json');
let p2Map = {};
if (fs.existsSync(p2MapPath)) {
  try { p2Map = JSON.parse(fs.readFileSync(p2MapPath, 'utf8')); } catch(e){}
}

const p2Files = fs.readdirSync(P2_DIR).filter(f => f.toUpperCase().endsWith('.JPG')).sort();
console.log(`Found ${p2Files.length} P2 photos. Already uploaded: ${Object.keys(p2Map).length}`);

for (let i = 0; i < p2Files.length; i++) {
  const file = p2Files[i];
  if (p2Map[file]) continue;
  const filePath = path.join(P2_DIR, file);
  try {
    const out = execSync(`gdrive mutate upload "${filePath}" --parent "${P2_FOLDER_ID}"`, { encoding: 'utf8' });
    const match = out.match(/ID:\s*([a-zA-Z0-9_-]+)/i);
    if (match) {
      const fileId = match[1];
      p2Map[file] = fileId;
      console.log(`[P2 ${i+1}/${p2Files.length}] Uploaded ${file} -> ${fileId}`);
      fs.writeFileSync(p2MapPath, JSON.stringify(p2Map, null, 2));
    } else {
      console.log(`[P2 ${i+1}/${p2Files.length}] Warning: no ID match in: ${out.trim()}`);
    }
  } catch (err) {
    console.error(`Error uploading ${file}:`, err.message);
  }
}

// 2. Upload Family & WhatsApp photos
console.log("\n=== Starting Family & WhatsApp Uploads ===");
const familyMapPath = path.join(__dirname, 'public/media/roka/gdrive_family_upload_map.json');
let familyMap = {};
if (fs.existsSync(familyMapPath)) {
  try { familyMap = JSON.parse(fs.readFileSync(familyMapPath, 'utf8')); } catch(e){}
}

function processFamilyDir(dirName, prefix) {
  if (!fs.existsSync(dirName)) return;
  const files = fs.readdirSync(dirName).filter(f => !f.startsWith('.') && !f.toUpperCase().endsWith('.MOV') && !f.toUpperCase().endsWith('.MP4')).sort();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const key = `${prefix}/${file}`;
    if (familyMap[key] || familyMap[file]) continue;
    const filePath = path.join(dirName, file);
    try {
      const out = execSync(`gdrive mutate upload "${filePath}" --parent "${FAMILY_FOLDER_ID}"`, { encoding: 'utf8' });
      const match = out.match(/ID:\s*([a-zA-Z0-9_-]+)/i);
      if (match) {
        const fileId = match[1];
        familyMap[key] = fileId;
        familyMap[file] = fileId;
        console.log(`[Family ${i+1}/${files.length}] Uploaded ${key} -> ${fileId}`);
        fs.writeFileSync(familyMapPath, JSON.stringify(familyMap, null, 2));
      } else {
        console.log(`[Family ${i+1}/${files.length}] Warning: no ID match in: ${out.trim()}`);
      }
    } catch (err) {
      console.error(`Error uploading ${key}:`, err.message);
    }
  }
}

processFamilyDir(W1_DIR, "Whatsapp 1");
processFamilyDir(W2_DIR, "Whatsapp 2");

console.log("=== All Uploads Completed Successfully! ===");
