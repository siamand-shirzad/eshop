"use client";

import { Package, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth";

interface UserMenuProps {
  onOpenOrders: () => void;
}

export function UserMenu({ onOpenOrders }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await logout();
    toast({
      title: "Signed out",
      description: "Your bag stays with you on this device.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-gold/30 bg-secondary/60 hover:border-gold hover:bg-accent"
          aria-label={`Account menu for ${user.name}`}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/15 font-serif text-xs font-semibold text-gold">
              {initials || "C"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 border-border/80 bg-popover">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onOpenOrders}
            className="gap-2.5 cursor-pointer"
          >
            <Package className="h-4 w-4 text-gold" />
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="gap-2.5 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
