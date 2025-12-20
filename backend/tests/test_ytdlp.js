
import { downloadYoutubeAudio } from '../utils/youtube.js';

const testUrl = 'https://youtu.be/bP8ATWCvqzw?si=FvmjTW8RR3wbkWab';

console.log('Testing download for:', testUrl);

try {
    const result = await downloadYoutubeAudio(testUrl);
    console.log('Success:', result);
} catch (error) {
    console.error('Test Failed:', error);
}
