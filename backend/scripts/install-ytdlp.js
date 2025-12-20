
import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const binaryPath = path.join(__dirname, '..', 'bin', 'yt-dlp.exe');
const binDir = path.join(__dirname, '..', 'bin');

if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir);
}

async function install() {
    try {
        console.log('Checking for yt-dlp binary at:', binaryPath);
        if (!fs.existsSync(binaryPath)) {
            console.log('Downloading yt-dlp binary...');
            // ytdlp-wrap downloadFromGithub defaults to downloading the correct binary for the OS if no arguments, 
            // but if we pass a path validation references might check OS. 
            // "arguments: filePath? string. platform? string. version? string."
            await YTDlpWrap.downloadFromGithub(binaryPath);
            console.log('Downloaded successfully.');
        } else {
            console.log('Binary exists.');
        }
    } catch (err) {
        console.error('Error downloading:', err);
    }
}

install();
