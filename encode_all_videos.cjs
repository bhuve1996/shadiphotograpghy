const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public/media/roka/web_videos');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const list = [
  { name: 'IMG_9347.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_9347.MP4' },
  { name: 'IMG_8256.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8256.MOV' },
  { name: 'IMG_8261.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8261.MOV' },
  { name: 'IMG_8225.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8225.MOV' },
  { name: 'IMG_8226.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8226.MOV' },
  { name: 'IMG_4344.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_4344.MOV' },
  { name: 'IMG_4276.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4276.MOV' },
  { name: 'IMG_4278.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4278.MOV' },
  { name: 'IMG_4286.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4286.MOV' },
  { name: 'IMG_4288.mp4', src: '/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4288.MOV' },
];

for (const item of list) {
  const out = path.join(targetDir, item.name);
  if (!fs.existsSync(out)) {
    console.log(`Encoding ${item.name}...`);
    try {
      execSync(`avconvert --source "${item.src}" -p Preset960x540 -o "${out}" --replace`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  } else {
    console.log(`Already encoded: ${item.name}`);
  }
}
console.log("All done!");
