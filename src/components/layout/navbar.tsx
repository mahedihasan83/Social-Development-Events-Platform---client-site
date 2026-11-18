"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarCheckIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PlusSquareIcon,
  UserRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { authClient, useSession } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { initials } from "@/lib/format";
import { cn } from "cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
];

/** Brand logo — same style everywhere (navbar requirement). */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-sm">
        <HeartHandshakeIcon className="size-4.5" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Shohojog<span className="text-primary">.</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user;

  async function handleLogout() {
    await authClient.signOut();
    clearTokenCache();
    toast.success("You have been logged out. See you soon!");
    router.push("/");
    router.refresh();
  }

  const navLinks = (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setMenuOpen(false)}
          className={cn(
            "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) &&
              "text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">{navLinks}</nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            // Skeleton while the session resolves — prevents login-button flash.
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <Tooltip>
                {/* Hovering the profile picture shows the display name. */}
                <TooltipTrigger
                  render={
                    <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  }
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{user.name}</TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end" className="w-56">
                {/* Base UI's GroupLabel requires a surrounding Group. */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate font-medium">
                    {user.name}
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/create-event")}>
                    <PlusSquareIcon /> Create Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/manage-events")}>
                    <LayoutDashboardIcon /> Manage Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/joined-events")}>
                    <CalendarCheckIcon /> Joined Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserRoundIcon /> Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOutIcon /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button render={<Link href="/login" />}>Login</Button>
          )}

          {/* Mobile navigation */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks}
                {user ? (
                  <>
                    <Link
                      href="/create-event"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Create Event
                    </Link>
                    <Link
                      href="/manage-events"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Manage Events
                    </Link>
                    <Link
                      href="/joined-events"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Joined Events
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="rounded-md px-2 py-1.5 text-left text-sm text-destructive hover:underline"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Button render={<Link href="/login" />} onClick={() => setMenuOpen(false)}>
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
