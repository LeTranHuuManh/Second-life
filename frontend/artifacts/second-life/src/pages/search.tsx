import React, { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useProducts, ListingType, SortOption } from "@/hooks/use-products";
import { MOCK_CATEGORIES, VIETNAMESE_PROVINCES } from "@/lib/mock-data";
import { useCart } from "@/lib/context";
import { formatPrice } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search as SearchIcon,
  SlidersHorizontal,
  ShoppingCart,
  CalendarRange,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { Product } from "@/lib/mock-data";

// ─── Constants ────────────────────────────────────────────────────────────────

const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "buy", label: "Chỉ mua" },
  { value: "rent", label: "Chỉ thuê" },
  { value: "both", label: "Mua & Thuê" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Mặc định" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "distance", label: "Khoảng cách: Gần nhất" },
];

const PAGE_SIZE = 8;

// ─── Search Product Card ──────────────────────────────────────────────────────

function SearchProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ product, type: "buy", quantity: 1 });
    setLocation("/gio-hang");
  };

  const handleRent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(`/san-pham/${product.id}`);
  };

  const canBuy = product.type === "buy" || product.type === "both";
  const canRent = product.type === "rent" || product.type === "both";

  return (
    <Link href={`/san-pham/${product.id}`} className="block group h-full">
      <div className="bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-0.5 flex flex-col h-full">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-secondary/30 relative shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {canBuy && (
              <Badge className="bg-white/90 backdrop-blur-sm text-emerald-700 border-0 shadow-sm text-[10px] font-bold px-2">
                Mua
              </Badge>
            )}
            {canRent && (
              <Badge className="bg-white/90 backdrop-blur-sm text-blue-700 border-0 shadow-sm text-[10px] font-bold px-2">
                Thuê
              </Badge>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-3.5 flex flex-col flex-1 gap-2">
          <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Prices */}
          <div className="space-y-1">
            {product.buyPrice && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground shrink-0">Mua:</span>
                <span className="text-sm font-bold text-foreground">
                  {formatPrice(product.buyPrice)}
                </span>
              </div>
            )}
            {product.rentPricePerDay && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground shrink-0">Thuê:</span>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(product.rentPricePerDay)}
                  <span className="text-[10px] text-muted-foreground font-normal">/ngày</span>
                </span>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate max-w-[90px]">{product.location}</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 font-medium">
              <Star className="w-2.5 h-2.5 fill-amber-500" />
              {product.rating}
              <span className="text-muted-foreground font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 mt-auto pt-1">
            {canBuy && (
              <Button
                size="sm"
                className="flex-1 rounded-full text-xs h-8 font-bold shadow-sm"
                onClick={handleBuy}
              >
                <ShoppingCart className="w-3 h-3 mr-1 shrink-0" />
                Mua ngay
              </Button>
            )}
            {canRent && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-full text-xs h-8 font-bold border-primary/60 text-primary hover:bg-primary hover:text-white transition-colors"
                onClick={handleRent}
              >
                <CalendarRange className="w-3 h-3 mr-1 shrink-0" />
                Thuê ngay
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const all = Array.from({ length: total }, (_, i) => i + 1);
  const visible = all.filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-xl"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && (
              <span className="text-muted-foreground text-sm px-1">…</span>
            )}
            <Button
              variant={current === p ? "default" : "outline"}
              size="icon"
              className="h-9 w-9 rounded-xl font-semibold"
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          </React.Fragment>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-xl"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterProps {
  searchInput: string;
  setSearchInput: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  province: string;
  setProvince: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  category: string;
  setCategory: (v: string) => void;
  onClear: () => void;
  hasActive: boolean;
}

function FilterSidebar({
  searchInput,
  setSearchInput,
  onSearch,
  province,
  setProvince,
  district,
  setDistrict,
  sort,
  setSort,
  category,
  setCategory,
  onClear,
  hasActive,
}: FilterProps) {
  return (
    <div className="space-y-6">
      {/* Search input */}
      <div>
        <h3 className="font-bold text-sm mb-2.5 text-foreground flex items-center gap-1.5">
          <SearchIcon className="w-3.5 h-3.5 text-primary" />
          Từ khóa
        </h3>
        <form onSubmit={onSearch} className="flex gap-2">
          <Input
            placeholder="Nhập từ khóa..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-xl text-sm h-9 flex-1"
          />
          <Button type="submit" size="sm" className="rounded-xl h-9 px-3 shrink-0">
            <SearchIcon className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      <div className="border-t border-border/40" />

      {/* Location */}
      <div>
        <h3 className="font-bold text-sm mb-2.5 text-foreground flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          Vị trí
        </h3>
        <div className="space-y-2">
          <Select
            value={province || "all"}
            onValueChange={(v) => setProvince(v === "all" ? "" : v)}
          >
            <SelectTrigger className="rounded-xl text-sm h-9">
              <SelectValue placeholder="Chọn tỉnh / thành phố" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">Toàn quốc</SelectItem>
              {VIETNAMESE_PROVINCES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {province && (
            <Input
              placeholder="Nhập phường / quận..."
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-xl text-sm h-9"
            />
          )}
        </div>
      </div>

      <div className="border-t border-border/40" />

      {/* Sort */}
      <div>
        <h3 className="font-bold text-sm mb-2.5 text-foreground flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
          Sắp xếp
        </h3>
        <RadioGroup
          value={sort}
          onValueChange={(v) => setSort(v as SortOption)}
          className="space-y-1.5"
        >
          {SORT_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`sort-${opt.value}`} />
              <Label
                htmlFor={`sort-${opt.value}`}
                className="text-sm font-normal cursor-pointer leading-none"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="border-t border-border/40" />

      {/* Categories */}
      <div>
        <h3 className="font-bold text-sm mb-2.5 text-foreground flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          Danh mục
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => setCategory("")}
            className={`block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              category === ""
                ? "bg-primary text-white font-semibold"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Tất cả danh mục
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                category === cat.name
                  ? "bg-primary text-white font-semibold"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasActive && (
        <>
          <div className="border-t border-border/40" />
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl text-sm"
            onClick={onClear}
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Xóa tất cả bộ lọc
          </Button>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Search() {
  const searchParams = new URLSearchParams(window.location.search);
  const initQ = searchParams.get("q") || "";
  const initCat = searchParams.get("category") || "";

  const [listingType, setListingType] = useState<ListingType>("all");
  const [category, setCategory] = useState(initCat);
  const [query, setQuery] = useState(initQ);
  const [searchInput, setSearchInput] = useState(initQ);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [page, setPage] = useState(1);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const { data: products, isLoading } = useProducts({
    listing_type: listingType,
    category,
    query,
    province,
    sort,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
    setListingType("all");
    setPage(1);
  };

  const handleListingType = (v: ListingType) => {
    setListingType(v);
    setPage(1);
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setMobileSidebar(false);
  };

  const handleProvince = (v: string) => {
    setProvince(v);
    setDistrict("");
    setPage(1);
  };

  const handleSort = (v: SortOption) => {
    setSort(v);
    setPage(1);
  };

  const clearAll = () => {
    setListingType("all");
    setCategory("");
    setQuery("");
    setSearchInput("");
    setProvince("");
    setDistrict("");
    setSort("default");
    setPage(1);
    setMobileSidebar(false);
  };

  const hasActive =
    !!query || !!category || !!province || sort !== "default" || listingType !== "all";

  // Client-side pagination
  const totalPages = Math.ceil((products?.length ?? 0) / PAGE_SIZE);
  const paginated = useMemo(() => {
    if (!products) return [];
    return products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [products, page]);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterProps: FilterProps = {
    searchInput,
    setSearchInput,
    onSearch: handleSearch,
    province,
    setProvince: handleProvince,
    district,
    setDistrict,
    sort,
    setSort: handleSort,
    category,
    setCategory: handleCategory,
    onClear: clearAll,
    hasActive,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-7 items-start">

          {/* ── Desktop sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-border/60 rounded-2xl p-5 shadow-sm sticky top-24 self-start">
            <FilterSidebar {...filterProps} />
          </aside>

          {/* ── Main content ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 className="text-2xl font-bold font-display">
                  {query ? `Kết quả cho "${query}"` : "Khám phá sản phẩm"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isLoading
                    ? "Đang tải..."
                    : `${products?.length ?? 0} sản phẩm`}
                </p>
              </div>

              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden rounded-xl gap-1.5"
                onClick={() => setMobileSidebar((v) => !v)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
                {hasActive && (
                  <span className="bg-primary text-white text-xs rounded-full px-1.5 leading-4">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile sidebar panel */}
            {mobileSidebar && (
              <div className="lg:hidden bg-white border border-border/60 rounded-2xl p-5 shadow-sm mb-5">
                <FilterSidebar {...filterProps} />
              </div>
            )}

            {/* Active filter chips */}
            {hasActive && (
              <div className="flex flex-wrap gap-2 mb-4">
                {query && (
                  <Badge variant="secondary" className="rounded-full gap-1 pl-3 pr-2 py-1">
                    🔍 {query}
                    <button onClick={() => { setQuery(""); setSearchInput(""); }} className="ml-0.5 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {listingType !== "all" && (
                  <Badge variant="secondary" className="rounded-full gap-1 pl-3 pr-2 py-1">
                    {LISTING_TYPES.find((l) => l.value === listingType)?.label}
                    <button onClick={() => setListingType("all")} className="ml-0.5 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {category && (
                  <Badge variant="secondary" className="rounded-full gap-1 pl-3 pr-2 py-1">
                    {MOCK_CATEGORIES.find((c) => c.name === category)?.icon} {category}
                    <button onClick={() => setCategory("")} className="ml-0.5 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {province && (
                  <Badge variant="secondary" className="rounded-full gap-1 pl-3 pr-2 py-1">
                    📍 {province}
                    <button onClick={() => { setProvince(""); setDistrict(""); }} className="ml-0.5 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {sort !== "default" && (
                  <Badge variant="secondary" className="rounded-full gap-1 pl-3 pr-2 py-1">
                    {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                    <button onClick={() => setSort("default")} className="ml-0.5 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Listing type tabs */}
            <div className="flex gap-1 mb-6 bg-secondary/40 p-1 rounded-xl w-fit overflow-x-auto">
              {LISTING_TYPES.map((lt) => (
                <button
                  key={lt.value}
                  onClick={() => handleListingType(lt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    listingType === lt.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lt.label}
                </button>
              ))}
            </div>

            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : paginated.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((p) => (
                  <SearchProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <img
                  src={`${import.meta.env.BASE_URL}images/empty-search.png`}
                  alt="Không tìm thấy"
                  className="w-40 h-40 object-contain opacity-70 mb-6"
                />
                <h3 className="text-xl font-bold font-display mb-2">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Hãy thử đổi từ khóa hoặc điều chỉnh bộ lọc để tìm được sản phẩm ưng ý.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={clearAll}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}

            {/* Pagination */}
            <Pagination current={page} total={totalPages} onChange={goToPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
