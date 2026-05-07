import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProviders } from "@/lib/context";
import { Layout } from "@/components/layout";
import { AdminLayout } from "@/components/admin-layout";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import AddressPage from "@/pages/address";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Messages from "@/pages/messages";
import Shop from "@/pages/shop";
import CreateProductPage from "@/pages/create-product";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminAILogs from "@/pages/admin/ai-logs";
import AdminSettings from "@/pages/admin/settings";
import AdminSellerRequests from "@/pages/admin/seller-requests";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin Application */}
      <Route path="/admin" nest>
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminLayout>
            <Switch>
              <Route path="/" component={AdminDashboard} />
              <Route path="/seller-requests" component={AdminSellerRequests} />
              <Route path="/users" component={AdminUsers} />
              <Route path="/products" component={AdminProducts} />
              <Route path="/orders" component={AdminOrders} />
              <Route path="/ai-logs" component={AdminAILogs} />
              <Route path="/settings" component={AdminSettings} />
              <Route component={NotFound} />
            </Switch>
          </AdminLayout>
        </ProtectedRoute>
      </Route>

      {/* Consumer Application */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/tim-kiem" component={Search} />
            <Route path="/san-pham/:id" component={ProductDetail} />
            <Route path="/cua-hang/:id" component={Shop} />

            {/* Protected User Routes */}
            <Route path="/dang-ban">
              <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
                <CreateProductPage />
              </ProtectedRoute>
            </Route>
            <Route path="/gio-hang">
              <ProtectedRoute allowedRoles={["USER", "SELLER"]}>
                <Cart />
              </ProtectedRoute>
            </Route>
            <Route path="/thanh-toan">
              <ProtectedRoute allowedRoles={["USER", "SELLER"]}>
                <Checkout />
              </ProtectedRoute>
            </Route>
            <Route path="/dia-chi">
              <ProtectedRoute allowedRoles={["USER", "SELLER"]}>
                <AddressPage />
              </ProtectedRoute>
            </Route>
            <Route path="/don-hang">
              <ProtectedRoute allowedRoles={["USER", "SELLER"]}>
                <Orders />
              </ProtectedRoute>
            </Route>
            <Route path="/tin-nhan">
              <ProtectedRoute allowedRoles={["USER", "SELLER"]}>
                <Messages />
              </ProtectedRoute>
            </Route>
            <Route path="/quan-ly">
              <ProtectedRoute allowedRoles={["USER", "SELLER"]}>
                <Dashboard />
              </ProtectedRoute>
            </Route>

            {/* Auth Routes */}
            <Route path="/dang-nhap" component={Login} />
            <Route path="/dang-ky" component={Register} />

            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProviders>
    </QueryClientProvider>
  );
}

export default App;
