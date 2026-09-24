import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // Editorial Hero & Campaign banners
  {
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    dest: 'public/assets/editorial/hero-campaign.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    dest: 'public/assets/editorial/clothing-banner.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    dest: 'public/assets/editorial/jewels-banner.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    dest: 'public/assets/editorial/the-edit.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    dest: 'public/assets/editorial/story.jpg'
  },
  // Clothing Pieces
  {
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-01.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-02.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-03.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-04.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-05.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-06.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-07.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1000&auto=format&fit=crop',
    dest: 'public/assets/products/clothing/clothing-08.jpg'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullDest = path.join(process.cwd(), destPath);
    if (fs.existsSync(fullDest) && fs.statSync(fullDest).size > 1000) {
      return resolve();
    }
    const dir = path.dirname(fullDest);
    fs.mkdirSync(dir, { recursive: true });

    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return resolve(); // non-critical fallback
      }
      const fileStream = fs.createWriteStream(fullDest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Failed to download ${url}:`, err.message);
      resolve(); // ignore network errors
    });
  });
}

async function run() {
  console.log('Downloading editorial assets...');
  for (const item of downloads) {
    await downloadFile(item.url, item.dest);
  }
  console.log('Done downloading assets.');
}

run();
