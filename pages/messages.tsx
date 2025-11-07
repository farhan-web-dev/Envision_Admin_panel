import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { fetchMessages } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });

  const mockMessages = messages || [
    {
      id: '1',
      sender: 'John Doe',
      email: 'john@example.com',
      subject: 'Question about product',
      message: 'Hello, I have a question about the Laptop Pro...',
      date: '2024-05-03',
      status: 'unread',
    },
    {
      id: '2',
      sender: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Order issue',
      message: 'My order has not arrived yet...',
      date: '2024-05-02',
      status: 'read',
    },
    {
      id: '3',
      sender: 'Mike Johnson',
      email: 'mike@example.com',
      subject: 'Feedback',
      message: 'Great service! Keep up the good work.',
      date: '2024-05-01',
      status: 'read',
    },
    {
      id: '4',
      sender: 'Sarah Williams',
      email: 'sarah@example.com',
      subject: 'Refund request',
      message: 'I would like to request a refund for...',
      date: '2024-04-30',
      status: 'unread',
    },
  ];

  const columns = [
    { header: 'Sender', accessor: 'sender' as const },
    { header: 'Email', accessor: 'email' as const },
    { header: 'Subject', accessor: 'subject' as const },
    {
      header: 'Message',
      accessor: (msg: any) => (
        <span className="line-clamp-1 max-w-xs">{msg.message}</span>
      ),
    },
    { header: 'Date', accessor: 'date' as const },
    {
      header: 'Status',
      accessor: (msg: any) => (
        <Badge variant={msg.status === 'unread' ? 'default' : 'secondary'}>
          {msg.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (msg: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded bg-slate-200"></div>
          <div className="h-96 rounded-lg bg-slate-200"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-slate-600">View and respond to customer messages</p>
        </div>

        <DataTable data={mockMessages} columns={columns} />
      </div>
    </AdminLayout>
  );
}
