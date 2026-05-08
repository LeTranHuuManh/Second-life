import React, { useState } from "react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/use-addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, MapPin, CheckCircle, Plus } from "lucide-react";

export default function AddressPage() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    isDefault: false,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAddress.mutateAsync(formData);
      toast({ title: "Thêm địa chỉ thành công!" });
      setIsOpen(false);
      setFormData({ name: "", phoneNumber: "", address: "", isDefault: false });
    } catch (error: any) {
      toast({
        title: "Lỗi thêm địa chỉ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await deleteAddress.mutateAsync(id);
      toast({ title: "Xóa địa chỉ thành công!" });
    } catch (error: any) {
      toast({ title: "Lỗi xóa địa chỉ", variant: "destructive" });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress.mutateAsync(id);
      toast({ title: "Đã đặt làm mặc định!" });
    } catch (error: any) {
      toast({ title: "Lỗi thiết lập", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Địa chỉ của tôi</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-colored hover:-translate-y-0.5 transition-all">
              <Plus className="w-5 h-5 mr-2" /> Thêm địa chỉ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-display">
                Thêm địa chỉ
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="rounded-xl bg-secondary/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                  className="rounded-xl bg-secondary/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ chi tiết</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  className="rounded-xl bg-secondary/20"
                />
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, isDefault: !!c })
                  }
                />
                <Label
                  htmlFor="isDefault"
                  className="font-medium cursor-pointer"
                >
                  Đặt làm địa chỉ mặc định
                </Label>
              </div>
              <Button
                type="submit"
                disabled={createAddress.isPending}
                className="w-full rounded-full font-bold h-12 mt-6"
              >
                {createAddress.isPending ? "Đang xử lý..." : "Hoàn thành"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : addresses?.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-border shadow-sm text-center flex flex-col items-center">
          <MapPin className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold">Chưa có địa chỉ</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Bạn chưa lưu địa chỉ nào. Hãy thêm để thanh toán nhanh hơn nhé!
          </p>
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm ngay
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses?.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white p-6 rounded-3xl border ${addr.isDefault ? "border-primary ring-1 ring-primary/20 shadow-md" : "border-border shadow-sm"} transition-all flex flex-col md:flex-row justify-between gap-4`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">{addr.name}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">
                    {addr.phoneNumber}
                  </span>
                  {addr.isDefault && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> Mặc định
                    </span>
                  )}
                </div>
                <p className="text-foreground">{addr.address}</p>
              </div>
              <div className="flex flex-row md:flex-col gap-2 justify-end">
                {!addr.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-1"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Đặt mặc định
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full flex-1"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
