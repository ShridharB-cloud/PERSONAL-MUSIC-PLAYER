
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binDir = path.join(__dirname, '..', 'bin');
const binaryPath = path.join(binDir, 'yt-dlp.exe');

if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
}

const file = fs.createWriteStream(binaryPath);
const url = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";

console.log(`Downloading yt-dlp from ${url}...`);

https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
        console.log(`Redirecting to ${response.headers.location}...`);
        https.get(response.headers.location, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Download completed.');
            });
        });
    } else {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Download completed.');
        });
    }
}).on('error', (err) => {
    fs.unlink(binaryPath, () => { }); // Delete the file async. (But we don't check the result) - fixed syntax
    console.error('Error downloading:', err.message);
});
