import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { fetchPromotions, createPromotion, deletePromotion } from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PromotionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: promotions, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: fetchPromotions,
  });

  const createMutation = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });

  const mockPromotions = promotions || [
    {
      id: '1',
      title: 'Summer Sale',
      description: 'Get 50% off on all electronics',
      discount: '50%',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      status: 'active',
    },
    {
      id: '2',
      title: 'Free Shipping',
      description: 'Free shipping on orders over $100',
      discount: 'Free',
      startDate: '2024-05-01',
      endDate: '2024-12-31',
      status: 'active',
    },
    {
      id: '3',
      title: 'Black Friday',
      description: 'Huge discounts on all products',
      discount: '70%',
      startDate: '2024-11-29',
      endDate: '2024-11-29',
      status: 'scheduled',
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      discount: formData.get('discount'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    };
    createMutation.mutate(data);
  };

  const columns = [
    { header: 'Title', accessor: 'title' as const },
    { header: 'Description', accessor: 'description' as const },
    { header: 'Discount', accessor: 'discount' as const },
    { header: 'Start Date', accessor: 'startDate' as const },
    { header: 'End Date', accessor: 'endDate' as const },
    {
      header: 'Status',
      accessor: (promo: any) => (
        <Badge variant={promo.status === 'active' ? 'default' : 'secondary'}>
          {promo.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (promo: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(promo.id)}
          >
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
            <p className="text-slate-600">Manage promotional banners and offers</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Promotion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    name="discount"
                    placeholder="e.g., 50% or Free"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
                <Button type="submit" className="w-full">
                  Create Promotion
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable data={mockPromotions} columns={columns} />
      </div>
    </AdminLayout>
  );
}
