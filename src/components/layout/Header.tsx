import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ROUTE_TITLES: Record<string, string> = {
    "/": "Home",
    "/library": "Your Library",
    "/upload": "Upload Music",
    "/playlists": "Your Playlists",
    "/liked": "Liked Songs",
    "/discover": "Discover",
    "/profile": "Profile",
    "/search": "Search",
    "/login": "Login",
    "/register": "Register",
};

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    // Determine title
    let title = ROUTE_TITLES[path];

    // Handle dynamic routes if exact match fails
    if (!title) {
        if (path.startsWith("/playlists/")) {
            title = "Playlist";
        } else {
            title = "Cloudly";
        }
    }

    const showBackButton = path !== "/";

    return (
        <header className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
            {showBackButton && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full hover:bg-white/10 -ml-2"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            )}

            <h1 className="text-xl font-bold tracking-tight text-foreground/90">
                {title}
            </h1>
        </header>
    );
}
