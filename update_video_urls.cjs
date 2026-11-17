const fs = require('fs');

let initialData = fs.readFileSync('src/data/initialData.ts', 'utf8');

const startStr = "export const INITIAL_MEDIA_ITEMS: MediaItem[] = ";
const start = initialData.indexOf(startStr) + startStr.length;
const end = initialData.lastIndexOf(";");
const items = eval(initialData.slice(start, end));

// Map of original file to web video URL
const videoUrlMap = {
  "IMG_9347.MP4": "/media/roka/web_videos/IMG_9347.mp4",
  "IMG_8256.MOV": "/media/roka/web_videos/IMG_8256.mp4",
  "IMG_8261.MOV": "/media/roka/web_videos/IMG_8261.mp4",
  "IMG_8225.MOV": "/media/roka/web_videos/IMG_8225.mp4",
  "IMG_8226.MOV": "/media/roka/web_videos/IMG_8226.mp4",
  "IMG_4344.MOV": "/media/roka/web_videos/IMG_4344.mp4",
  "IMG_4276.MOV": "/media/roka/web_videos/IMG_4276.mp4",
  "IMG_4278.MOV": "/media/roka/web_videos/IMG_4278.mp4",
  "IMG_4286.MOV": "/media/roka/web_videos/IMG_4286.mp4",
  "IMG_4288.MOV": "/media/roka/web_videos/IMG_4288.mp4",
};

for (const item of items) {
  if (item.type === 'video') {
    if (videoUrlMap[item.originalFilename]) {
      item.url = videoUrlMap[item.originalFilename];
    }
  }
}

// Update Collection filmUrl
initialData = initialData.replace(/filmUrl:\s*"[^"]+"/, 'filmUrl: "/media/roka/web_videos/IMG_9347.mp4"');

const before = initialData.slice(0, start);
const newContent = before + JSON.stringify(items, null, 2) + ";\n";
fs.writeFileSync('src/data/initialData.ts', newContent);
console.log("Updated video URLs in initialData.ts to local web_videos!");
