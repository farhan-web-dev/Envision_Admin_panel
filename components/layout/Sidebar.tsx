import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  Gift,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  // { href: '/messages', label: 'Messages', icon: MessageSquare },
  // { href: '/promotions', label: 'Promotions', icon: Gift },
  // { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <LayoutDashboard className="h-6 w-6 text-slate-900" />
          <span className="ml-2 text-lg font-semibold text-slate-900">
            Envision Panel
          </span>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
