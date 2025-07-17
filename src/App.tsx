import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginUserPage from "./pages/auth/LoginUser";
import RegisterUserPage from "./pages/auth/RegisterUser";
import LoginAdmin from "./pages/auth/LoginAdmin";
import RegisterAdmin from "./pages/auth/RegisterAdmin";

import AllProductsPage from "./pages/AllProducts";
import SaldoPage from "./pages/SaldoPage";
import OrdersPage from "./pages/OrdersPage";
import MyProductsPage from "./pages/MyProductsPage";

import PrivateRoute from "./router"; // Bisa akses jika login
import AdminRoute from "./router/AdminRoute"; // Hanya untuk role admin
import OrdersToMePage from "./pages/AdminOrders";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginUserPage />} />
        <Route path="/register" element={<RegisterUserPage />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/register/admin" element={<RegisterAdmin />} />

        {/* Private Route untuk semua role */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AllProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/saldo"
          element={
            <PrivateRoute>
              <SaldoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        {/* Admin only */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/my-product" element={<MyProductsPage />} />
          <Route path="/admin/orders/me" element={<OrdersToMePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
