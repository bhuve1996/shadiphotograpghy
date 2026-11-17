#!/bin/bash
mkdir -p public/media/roka/web_videos

declare -A videos=(
  ["IMG_9347.MP4"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_9347.MP4"
  ["IMG_8256.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8256.MOV"
  ["IMG_8261.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8261.MOV"
  ["IMG_8225.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8225.MOV"
  ["IMG_8226.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_8226.MOV"
  ["IMG_4344.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 1/IMG_4344.MOV"
  ["IMG_4276.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4276.MOV"
  ["IMG_4278.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4278.MOV"
  ["IMG_4286.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4286.MOV"
  ["IMG_4288.MOV"]="/Users/Bhuvesh.Singla/Downloads/Roka/Roka Photo and Videos All/Random Whatsapp/Whatsapp 3/IMG_4288.MOV"
)

for name in "${!videos[@]}"; do
  src="${videos[$name]}"
  out="public/media/roka/web_videos/${name%.*}.mp4"
  if [ ! -f "$out" ]; then
    echo "Encoding $name -> $out..."
    avconvert --source "$src" -p Preset960x540 -o "$out" --replace
  fi
done
echo "All web videos encoded!"
ls -lh public/media/roka/web_videos/
