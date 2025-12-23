import { Play, Heart, MoreVertical, ListPlus } from "lucide-react";
import { Song } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export function SongCard({ song, queue }: SongCardProps) {
  const { playSong, currentSong, isPlaying, toggleLike, addToQueue } = usePlayer();
  const isCurrentSong = currentSong?.id === song.id;
  const { toast } = useToast();

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    toast({
      title: "Added to Queue",
      description: `${song.title} will play next.`,
    });
  };

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 w-44 cursor-pointer rounded-lg bg-card p-3 transition-all duration-300",
        "hover:bg-cloudly-surface-hover hover:scale-[1.02]",
        isCurrentSong && "ring-2 ring-primary"
      )}
      onClick={() => playSong(song, queue)}
    >
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden rounded-md mb-3">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Play overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100",
            isCurrentSong && isPlaying && "opacity-100"
          )}
        >
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 hover:scale-110 transition-transform shadow-lg cloudly-glow"
            onClick={(e) => {
              e.stopPropagation();
              playSong(song, queue);
            }}
          >
            <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
          </Button>
        </div>

        {/* Like button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 opacity-0 transition-opacity",
            "group-hover:opacity-100 hover:bg-black/70"
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song.id, !!song.liked);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              song.liked ? "fill-primary text-primary" : "text-white"
            )}
          />
        </Button>
      </div>

      {/* Menu Button - Only visible on hover */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 ring-0 focus:ring-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 backdrop-blur-md bg-black/80 border-white/10 text-white">
            <DropdownMenuItem
              onClick={handleAddToQueue}
              className="cursor-pointer focus:bg-white/10 focus:text-white"
            >
              <ListPlus className="mr-2 h-4 w-4" />
              <span>Play Next</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Song info */}
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate text-sm">{song.title}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{song.artist}</p>
      </div>
    </div>
  );
}
