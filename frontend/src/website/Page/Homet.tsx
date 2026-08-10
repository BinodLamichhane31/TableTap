import Navbar from "../components/Navbar";
import AdminImage from "./AdminImage";
import BottomBar from "./BottomBar";
import FAQ from "./FAQ";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import ManageOrderTab from "./ManageOrderTab";

const Homet = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#EC5B00] selection:text-white font-poppins overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminImage />
      </div>
      <div id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ManageOrderTab />
      </div>
      <div id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HowItWorks />
      </div>
      <FAQ />
      <div id="contact" className="w-full">
        <BottomBar />
      </div>
    </div>
  );
};

export default Homet;
