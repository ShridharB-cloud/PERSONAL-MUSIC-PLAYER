import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, Music, Image, Loader2, Link as LinkIcon, Youtube } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { musicService } from "@/services/music";

const Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [tempAudioPath, setTempAudioPath] = useState<string | null>(null);
  const [tempCoverPath, setTempCoverPath] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
  });

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setTempAudioPath(null); // Clear imported if manual select
    }
  };

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    try {
      const result = await musicService.importYoutube(importUrl);
      setFormData({
        title: result.title,
        artist: result.artist,
        album: result.album || "Single",
      });
      setTempAudioPath(result.audioPath);
      setTempCoverPath(result.coverPath);
      setCoverPreview(result.thumbnailUrl);
      setAudioFile(null); // Clear manual file
      setCoverFile(null); // Clear manual file

      toast({
        title: "Import Successful",
        description: "Song metadata and audio imported from YouTube.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.response?.data?.error || "Failed to import from YouTube",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setTempCoverPath(null);
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile && !tempAudioPath) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an audio file or import from YouTube.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("artist", formData.artist);
      data.append("album", formData.album);

      if (audioFile) {
        data.append("audio", audioFile);
      } else if (tempAudioPath) {
        data.append("tempAudioPath", tempAudioPath);
      }

      if (coverFile) {
        data.append("cover", coverFile);
      } else if (tempCoverPath) {
        data.append("tempCoverPath", tempCoverPath);
      }

      await musicService.uploadSong(data);

      toast({
        title: "Upload successful!",
        description: `"${formData.title}" has been added to your library.`,
      });

      // Reset form
      setFormData({ title: "", artist: "", album: "" });
      setAudioFile(null);
      setCoverFile(null);
      setTempAudioPath(null);
      setTempCoverPath(null);
      setCoverPreview(null);
      setImportUrl("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to upload song",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Upload Music</h1>
        <p className="text-muted-foreground mt-1">Share your music with the world</p>
      </div>

      {/* YouTube Import Section */}
      <div className="bg-card/50 border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Youtube className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold">Import from YouTube</h2>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Paste YouTube link here..."
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleImport}
            disabled={isImporting || !importUrl}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              "Auto Import"
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Audio File Upload */}
        <div className="space-y-2">
          <Label>Audio File</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-card relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required={!audioFile && !tempAudioPath}
            />
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            {audioFile ? (
              <div>
                <p className="text-primary font-medium truncate">{audioFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : tempAudioPath ? (
              <div>
                <p className="text-green-500 font-medium truncate">✓ Imported from YouTube</p>
                <p className="text-sm text-muted-foreground mt-1">{formData.title}</p>
              </div>
            ) : (
              <>
                <p className="text-foreground font-medium">Drop your audio file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">MP3, WAV, or M4A up to 50MB</p>
              </>
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-card relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {coverPreview ? (
              <div className="relative z-10">
                <img src={coverPreview} alt="Cover preview" className="w-32 h-32 mx-auto object-cover rounded shadow-md mb-2" />
                <p className="text-sm text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <>
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium">Drop your cover image here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">JPG or PNG, recommended 500x500px</p>
              </>
            )}
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter song title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              placeholder="Enter artist name"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              placeholder="Enter album name (optional)"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload Song
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Upload;
