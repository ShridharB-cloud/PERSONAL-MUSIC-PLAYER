import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, ListMusic, Heart, Settings } from "lucide-react";
import { usePlaylists, useLikedSongs, useMySongs } from "@/hooks/useMusic";

import { authService } from "@/services/auth";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Camera } from "lucide-react";

const Profile = () => {
  const { data: songs = [] } = useMySongs();
  const { data: playlists = [] } = usePlaylists();
  const { data: likedSongs = [] } = useLikedSongs();
  const user = authService.getCurrentUser();

  const stats = [
    { label: "Songs Uploaded", value: songs.length, icon: Music },
    { label: "Playlists Created", value: playlists.length, icon: ListMusic },
    { label: "Liked Songs", value: likedSongs.length, icon: Heart },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        <Button onClick={() => window.location.href = '/login'}>Login</Button>
      </div>
    );
  }

  const joinYear = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  const [name, setName] = useState(user.name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await authService.updateProfile(formData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      // Reload page to reflect changes (simplest way since we rely on localStorage user for initial state in this component)
      // Ideally we should use a global auth context, but for now:
      window.location.reload();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 p-6 rounded-xl bg-card border border-border">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-24 w-24 ring-2 ring-transparent group-hover:ring-primary transition-all">
              <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatarUrl} className="object-cover" />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Member since {joinYear}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => document.getElementById("profile-settings")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl bg-card border border-border text-center"
            >
              <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Profile Settings */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
            <Button className="w-fit" onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
