const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconDir = path.resolve(__dirname, '../public/icons');
const sourceIcon = path.resolve(iconDir, 'icon-512.png');

async function processIcons() {
  console.log('🚀 Processing PWA Icons...');

  if (!fs.existsSync(sourceIcon)) {
    console.error('❌ Source icon missing at:', sourceIcon);
    return;
  }

  try {
    // Generate 192x192
    await sharp(sourceIcon)
      .resize(192, 192)
      .toFile(path.resolve(iconDir, 'icon-192.png'));
    console.log('✅ Generated icon-192.png');

    // Generate 512x512
    // Even if source is 1024, we force 512 for the standard icon
    const temp512 = path.resolve(iconDir, 'icon-512-temp.png');
    await sharp(sourceIcon)
      .resize(512, 512)
      .toFile(temp512);
    
    // Replace old 512 (which might have been 1024)
    fs.renameSync(temp512, sourceIcon);
    console.log('✅ Updated icon-512.png (512x512)');

    // Generate 512x512 Maskable
    // 80% safe zone: 512 * 0.8 = ~410px
    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 5, g: 5, b: 7, alpha: 1 } // #050507
      }
    })
    .composite([{
      input: await sharp(sourceIcon).resize(410, 410).toBuffer(),
      gravity: 'center'
    }])
    .toFile(path.resolve(iconDir, 'icon-512-maskable.png'));
    console.log('✅ Generated icon-512-maskable.png');

    console.log('🎉 All icons processed successfully!');
  } catch (err) {
    console.error('❌ Sharp Error:', err);
  }
}

processIcons();
