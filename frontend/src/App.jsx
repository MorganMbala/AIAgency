import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import Footer from "./components/Footer";
import Contactoptions from "./components/Contactoptions";
import ScrollToHash from "./utils/ScrollToHash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import StripeCheckout from "./pages/StripeCheckout.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./contexts/CartContext.jsx";
import DashboardIframe from "./pages/DashboardIframe.jsx";

const Home = () => (
  <>
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Navbar />
      <Hero />
    </div>
    <About />
    <Experience />
    <Tech />
    <Works />
    {/* <Feedbacks /> */}
    <div className="relative z-0">
      <Contact />
      <StarsCanvas />
    </div>
    <Footer />
  </>
);

const ConversationPage = () => (
  <>
    <Navbar />
    <Contactoptions />
    <Footer />
  </>
);

const ContactPage = () => (
  <>
    <Navbar />
    <Contact />
    <Footer />
  </>
);

const App = () => {
  return (
    <GoogleOAuthProvider clientId="585146384175-9rb4vohsrm3l09378tfpib2g17kf8ni5.apps.googleusercontent.com">
      <CartProvider>
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/conversation" element={<ConversationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/stripe-checkout" element={<StripeCheckout />} />
            <Route path="/dashboard" element={<DashboardIframe />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
