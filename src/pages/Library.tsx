import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { SongCard } from "@/components/music/SongCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { useSongs, usePlaylists, useLikedSongs, useMySongs } from "@/hooks/useMusic";

const Library = () => {
  const { data: songs = [], isLoading: isLoadingSongs } = useMySongs();
  const { data: playlists = [], isLoading: isLoadingPlaylists } = usePlaylists();
  const { data: likedSongs = [], isLoading: isLoadingLiked } = useLikedSongs();

  const [searchQuery, setSearchQuery] = useState("");

  if (isLoadingSongs || isLoadingPlaylists || isLoadingLiked) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter functions
  const filteredSongs = songs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaylists = playlists.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLiked = likedSongs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Library</h1>
          <p className="text-muted-foreground mt-1">All your music in one place</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="bg-secondary mb-6">
          <TabsTrigger value="songs">Your Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} queue={filteredSongs} />
            ))}
            {filteredSongs.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No songs found matching "{searchQuery}"
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
            {filteredPlaylists.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No playlists found matching "{searchQuery}"
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="liked" className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredLiked.map((song) => (
              <SongCard key={song.id} song={song} queue={filteredLiked} />
            ))}
            {filteredLiked.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No liked songs found matching "{searchQuery}"
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Library;
