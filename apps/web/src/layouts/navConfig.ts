import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  ClipboardList,
  KeyRound,
  UserCircle,
  UsersRound,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", to: "/clients", icon: Building2 },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "My Projects", to: "/my-projects", icon: ClipboardList },
  { label: "Credentials", to: "/credentials", icon: KeyRound },
  { label: "User Control", to: "/admin/users", icon: UsersRound, superAdminOnly: true },
  { label: "Upgrade", to: "/billing", icon: Sparkles, superAdminOnly: true },
  { label: "Profile", to: "/profile", icon: UserCircle },
];
