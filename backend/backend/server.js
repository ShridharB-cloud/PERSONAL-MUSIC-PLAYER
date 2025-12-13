import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const songs = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", genre: "Pop", image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Blinding+Lights" },
  { id: 2, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", genre: "Pop", image: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Levitating" },
  { id: 3, title: "Shape of You", artist: "Ed Sheeran", album: "÷", duration: "3:53", genre: "Pop", image: "https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=Shape+of+You" },
  { id: 4, title: "Bad Habits", artist: "Ed Sheeran", album: "=", duration: "3:51", genre: "Pop", image: "https://via.placeholder.com/300x300/96CEB4/FFFFFF?text=Bad+Habits" },
  { id: 5, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", genre: "Pop", image: "https://via.placeholder.com/300x300/FECA57/FFFFFF?text=Watermelon+Sugar" }
];

const playlists = [
  { id: 1, name: "Top Hits 2025", songs: [1, 2, 3], isPublic: true },
  { id: 2, name: "Workout Vibes", songs: [1, 4], isPublic: true },
  { id: 3, name: "Chill Hits", songs: [2, 5], isPublic: true }
];

app.get('/api/songs', (req, res) => {
  const { genre, search } = req.query;
  let filtered = songs;
  if (genre) filtered = filtered.filter(s => s.genre === genre);
  if (search) filtered = filtered.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.artist.toLowerCase().includes(search.toLowerCase())
  );
  res.json(filtered);
});

app.get('/api/playlists', (req, res) => res.json(playlists));

app.get('/api/playlist/:id', (req, res) => {
  const playlist = playlists.find(p => p.id === parseInt(req.params.id));
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  const songsData = playlist.songs.map(id => songs.find(s => s.id === id)).filter(Boolean);
  res.json({ ...playlist, songs: songsData });
});

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => console.log(`Backend on port ${PORT}`));
