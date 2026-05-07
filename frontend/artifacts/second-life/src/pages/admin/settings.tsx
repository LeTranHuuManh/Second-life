import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Copy, Key, Link, Settings as SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
        <p className="text-muted-foreground mt-1">
          Cấu hình nền tảng, PayOS, AI Endpoint, và thông báo hệ thống.
        </p>
      </div>

      <div className="grid gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>PayOS Payment Gateway</CardTitle>
            <CardDescription>
              Cấu hình cổng thanh toán cho giao dịch mua bán & tiền cọc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client ID</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="clientId"
                  defaultValue="118a80..."
                  readOnly
                  className="font-mono bg-muted"
                />
                <Button size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="apiKey"
                  type="password"
                  defaultValue="e282bf83..."
                  readOnly
                  className="font-mono bg-muted"
                />
                <Button size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="webhookUrl"
                  defaultValue="https://api.secondlife.com/webhook/payos"
                  className="font-mono"
                />
                <Button size="icon" variant="outline">
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between items-center bg-muted/20">
            <div className="flex items-center space-x-2">
              <Switch id="payos-active" checked />
              <Label htmlFor="payos-active" className="text-sm font-medium">
                Bật phương thức thanh toán
              </Label>
            </div>
            <Button>Lưu thay đổi</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" /> Cấu hình Nền tảng
            </CardTitle>
            <CardDescription>
              Phí dịch vụ, tỷ lệ cọc và cấu hình định giá AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="sell-fee">Phí Sàn (Bán hàng) %</Label>
                <Input id="sell-fee" type="number" defaultValue="2.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent-fee">Phí Sàn (Cho thuê) %</Label>
                <Input id="rent-fee" type="number" defaultValue="5.0" />
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Duyệt tay sản phẩm mới đăng</Label>
                <p className="text-sm text-muted-foreground">
                  Admin phải xét duyệt trước khi sản phẩm mới hiện lên chợ.
                </p>
              </div>
              <Switch id="manual-approval" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-primary font-semibold">
                  Cho phép AI định giá (Gemini Vision)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cho phép AI xử lý hình ảnh và text để đề xuất mức giá cho
                  người bán.
                </p>
              </div>
              <Switch id="ai-pricing" checked />
            </div>
            <div className="mt-2 space-y-2 pl-6 ml-2 border-l-2">
              <Label htmlFor="ai-endpoint">
                Gemini API Target Project / Config
              </Label>
              <Input
                id="ai-endpoint"
                type="text"
                defaultValue="projects/secondlife-ai/gemini-pro-vision"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Lưu cài đặt Chung</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
