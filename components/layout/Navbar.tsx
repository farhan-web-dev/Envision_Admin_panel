import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <User className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
