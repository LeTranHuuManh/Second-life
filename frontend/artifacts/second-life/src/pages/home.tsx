import React from "react";
import { Link } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Leaf, Clock, Map } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden bg-primary/10">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-banner.png`}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 z-10">
            <div className="max-w-xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-800 leading-[1.1]">
                Sống Xanh, <br/>
                <span className="text-primary">Mua Sắm Thông Minh</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-700/80 font-medium">
                Khám phá hàng ngàn món đồ Second-hand chất lượng cao. Mua hoặc thuê - Lựa chọn là của bạn!
              </p>
              <div className="flex gap-4 pt-2">
                <Link href="/tim-kiem">
                  <Button size="lg" className="rounded-full shadow-colored font-bold text-base px-8 h-12">
                    Khám phá ngay
                  </Button>
                </Link>
                <Link href="/quan-ly">
                  <Button variant="outline" size="lg" className="rounded-full font-bold text-base px-8 h-12 bg-white/80 backdrop-blur hover:bg-white">
                    Đăng tin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold font-display mb-6">Danh mục nổi bật</h2>
        <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 snap-x hide-scrollbar">
          {MOCK_CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/tim-kiem?category=${encodeURIComponent(cat.name)}`} className="snap-start shrink-0">
              <div className="flex flex-col items-center gap-3 group w-20 md:w-24">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-colored duration-300">
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <span className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Suggested Products */}
      <section className="py-12 bg-white container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-display">Gợi ý cho bạn</h2>
          <Link href="/tim-kiem" className="text-primary font-bold hover:underline">Xem tất cả</Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.slice(0,8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Features/Trust Section */}
      <section className="py-16 bg-secondary/30 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-display text-lg">Giao dịch an toàn</h3>
              <p className="text-sm text-muted-foreground">Thanh toán được đảm bảo 100% qua hệ thống Second Life.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-display text-lg">Phát triển bền vững</h3>
              <p className="text-sm text-muted-foreground">Kéo dài tuổi thọ sản phẩm, giảm rác thải ra môi trường.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-display text-lg">Thuê linh hoạt</h3>
              <p className="text-sm text-muted-foreground">Chỉ cần thuê những gì bạn muốn, dùng trong bao lâu tùy thích.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-display text-lg">Giao nhận tận nơi</h3>
              <p className="text-sm text-muted-foreground">Hỗ trợ vận chuyển nhanh chóng, tiết kiệm chi phí.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
