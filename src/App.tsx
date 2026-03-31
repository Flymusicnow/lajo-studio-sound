import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import About from "./pages/About";
import FileUpload from "./pages/FileUpload";
import QuickBooking from "./pages/QuickBooking";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Requests from "./pages/admin/Requests";
import RequestDetail from "./pages/admin/RequestDetail";
import Customers from "./pages/admin/Customers";
import CustomerDetail from "./pages/admin/CustomerDetail";
import Calendar from "./pages/admin/Calendar";
import Content from "./pages/admin/Content";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/about" element={<About />} />
              <Route path="/upload/:bookingId" element={<FileUpload />} />
              <Route path="/quick-booking" element={<QuickBooking />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="/admin/requests/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/admin/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
              <Route path="/admin/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
