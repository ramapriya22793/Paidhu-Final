const fs = require('fs');
const path = require('path');
const supabase = require('./utils/supabaseClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const imagePath = path.join(__dirname, '..', 'frontend', 'public', 'hero_family.png');
    const fileBuffer = fs.readFileSync(imagePath);

    // Upload to Supabase Storage 'banners' bucket
    const fileName = `hero_family_${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from('banners')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('banners')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log('Uploaded image URL:', publicUrl);

    // Update the database settings
    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      let ourCommunityData = settings.ourCommunityData || {};
      
      if (!ourCommunityData.hero) {
        ourCommunityData.hero = {
          title: 'WELCOME TO THE PAIDHU COMMUNITY!',
          subtitle: 'Your supportive space for elegant living and floral wellness, together.'
        };
      }
      
      ourCommunityData.hero.image = publicUrl;

      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ourCommunityData: ourCommunityData
        }
      });
      console.log('Database updated successfully with new public URL.');
    } else {
        console.log('Settings not found in DB!');
    }

  } catch (error) {
    console.error('Error in script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
