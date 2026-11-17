const fs = require('fs');
const path = require('path');

const initialDataPath = path.join(__dirname, 'src/data/initialData.ts');
let initialDataContent = fs.readFileSync(initialDataPath, 'utf8');

// Load maps
let p1Map = {};
let p2Map = {};
let familyMap = {};

try { p1Map = JSON.parse(fs.readFileSync('public/media/roka/gdrive_p1_upload_map.json', 'utf8')); } catch(e){}
try { p2Map = JSON.parse(fs.readFileSync('public/media/roka/gdrive_p2_upload_map.json', 'utf8')); } catch(e){}
try { familyMap = JSON.parse(fs.readFileSync('public/media/roka/gdrive_family_upload_map.json', 'utf8')); } catch(e){}

// Known video map
const videoMap = {
  "IMG_9347.MP4": "1O5aPL_89CebKWTF_U2K_iKXx1mbL3Kp9",
  "IMG_8256.MOV": "16afP9KK-wtyD7c1V-eRaWM-uLVj88Wuh",
  "IMG_8261.MOV": "1TleS0uEXWHX4r47jS6_-c-m7cnjET5DZ",
  "IMG_8225.MOV": "1LGU7_OA73sX_L_wqGT2syg0EjSytDU6b",
  "IMG_8226.MOV": "1xlJTxUeXIxgggqqv1BWbeNBTtOnpmXEl",
  "IMG_4344.MOV": "1dZYO8LnMsrNBJnL3KzT45zwHU14aaqL_"
};

const startStr = "export const INITIAL_MEDIA_ITEMS: MediaItem[] = ";
const start = initialDataContent.indexOf(startStr);
const end = initialDataContent.lastIndexOf(";");

const before = initialDataContent.slice(0, start + startStr.length);
const items = eval(initialDataContent.slice(start + startStr.length, end));

let updatedCount = 0;
for (const item of items) {
  let gId = null;
  const orig = item.originalFilename;
  if (!orig) continue;

  if (item.type === 'video') {
    for (const [vName, vId] of Object.entries(videoMap)) {
      if (orig.includes(vName)) {
        gId = vId;
        break;
      }
    }
  } else if (p1Map[orig]) {
    gId = p1Map[orig];
  } else if (orig.startsWith("P2_")) {
    const p2Raw = orig.replace(/^P2_/, "");
    if (p2Map[p2Raw]) {
      gId = p2Map[p2Raw];
    }
  } else if (familyMap[orig]) {
    gId = familyMap[orig];
  } else {
    // try to match basename
    for (const [k, v] of Object.entries(familyMap)) {
      if (k.endsWith(orig) || orig.endsWith(k)) {
        gId = v;
        break;
      }
    }
  }

  if (gId) {
    item.gdriveId = gId;
    item.gdriveUrl = `https://drive.google.com/file/d/${gId}/view?usp=sharing`;
    updatedCount++;
  }
}

console.log(`Matched and assigned gdriveId to ${updatedCount}/${items.length} items`);
const newContent = before + JSON.stringify(items, null, 2) + ";\n";
fs.writeFileSync(initialDataPath, newContent);
console.log("Updated src/data/initialData.ts successfully!");
