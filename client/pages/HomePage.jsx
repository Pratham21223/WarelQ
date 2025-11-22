import React from "react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white font-inter flex flex-col text-gray-900">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-6 px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-blue-700 font-mono">WARE<span className="font-bold text-gray-800">IQ</span></span>
        </div>
        <ul className="flex gap-8 font-semibold items-center">
          <li>
            <a href="/dashboard" className="hover:text-blue-600 transition">Dashboard</a>
          </li>
          <li>
            <a href="/deliveries" className="hover:text-blue-600 transition">Deliveries</a>
          </li>
          <li>
            <a href="/products" className="hover:text-blue-600 transition">Products</a>
          </li>
          <li>
            <a href="/receipts" className="hover:text-blue-600 transition">Receipts</a>
          </li>
        </ul>
        <div className="flex gap-2 items-center">
          <a href="/signin"
            className="px-5 py-2 rounded-full text-blue-600 font-semibold shadow hover:bg-blue-100 transition">Sign In</a>
          <a href="/signup"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition">Sign Up</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 flex justify-center items-center">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200 via-white to-blue-300 opacity-30 blur-2xl"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          Streamline Your Warehouse <br /> with Care & Control
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 max-w-xl mb-8 font-medium">
          Add, track, and manage inventory—no clutter, no confusion. Start simple, scale smart.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup" className="px-7 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-800 transition">Try Free</a>
          <a href="/dashboard" className="px-7 py-3 rounded-full bg-white text-blue-600 font-semibold text-lg shadow-lg border hover:bg-blue-50 transition">View Dashboard</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 lg:px-24 bg-white flex flex-col items-center text-center border-b border-blue-100">
        <div className="inline-block px-6 py-2 bg-blue-100 rounded-full font-semibold text-blue-600 mb-6">All-in-One Solution</div>
        <h2 className="text-4xl font-bold mb-4">Why WareIQ?</h2>
        <p className="max-w-2xl text-lg text-gray-600 font-medium">
          WareIQ unifies your inventory, products, and receipts in one sleek platform. Get instant updates, full security, and powerful control—perfect for growing teams.
        </p>
      </section>

      {/* Features Part */}
      <section id="features" className="py-20 px-4 lg:px-24 bg-gradient-to-br from-white via-blue-50 to-white">
        <h2 className="text-4xl font-bold text-center mb-12">What Makes Us Unique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BoxIcon />}
            title="Stock Actions"
            desc="Add, update, or remove product stocks. Everything is real-time."
          />
          <FeatureCard
            icon={<ReceiptIcon />}
            title="Receipts Streamlined"
            desc="Upload or view receipts instantly—organized and paperless."
          />
          <FeatureCard
            icon={<MagnifierIcon />}
            title="Smart Search"
            desc="Find any product or receipt in seconds with next-gen filters."
          />
          <FeatureCard
            icon={<ShieldIcon />}
            title="Total Security"
            desc="Authentication & permissions keep your data locked and safe."
          />
        </div>
      </section>

      {/* Horizontal How It Works */}
      <section id="howitworks" className="py-20 px-6 lg:px-24 flex flex-col items-center bg-gradient-to-br from-white via-blue-50 to-white">
        <h2 className="text-4xl font-bold mb-14 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row items-start justify-center w-full max-w-6xl mx-auto gap-10 md:gap-0">
          <HowItWorksStep
            number="01"
            title="Create Account"
            subtitle="Register and set permissions for your team securely."
            glow
          />
          <HowItWorksStep
            number="02"
            title="Add Stocks / Receipts"
            subtitle="Upload products and receipts instantly, all digital."
            glow
          />
          <HowItWorksStep
            number="03"
            title="Track & Control"
            subtitle="Monitor everything in real-time—fully in your hands."
            glow
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-tr from-white via-blue-100 to-blue-50 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-4">Ready for warehouse success?</h2>
        <p className="mb-8 text-lg max-w-xl text-gray-600">
          Track, manage, and scale with WareIQ. Experience clarity and control in every step.
        </p>
        <a href="/signup" className="px-8 py-4 rounded-full bg-blue-600 text-white text-xl font-semibold shadow-lg hover:bg-blue-700 transition">
          Try WareIQ Now
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-100 mt-auto pt-10 pb-8 px-8 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex items-center gap-4 mb-6 lg:mb-0">
            <span className="text-2xl font-extrabold tracking-tight text-blue-700 font-mono">WARE<span className="font-bold text-gray-800">IQ</span></span>
            <span className="text-gray-500">| &copy; {new Date().getFullYear()}</span>
          </div>
          <ul className="flex flex-wrap gap-8 text-gray-700 font-medium justify-center">
            <li><a className="hover:text-blue-600" href="#features">Features</a></li>
            <li><a className="hover:text-blue-600" href="#howitworks">How it Works</a></li>
            <li><a className="hover:text-blue-600" href="#about">About WareIQ</a></li>
            <li><a className="hover:text-blue-600" href="/dashboard">Dashboard</a></li>
            <li><a className="hover:text-blue-600" href="mailto:hello@wareiq.com">Support</a></li>
            <li><a className="hover:text-blue-600" href="/signup">Sign Up</a></li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-600 text-sm">
            Built for speed • Secured for trust • Designed to scale
          </div>
          <form className="flex items-center gap-2 mt-4 md:mt-0">
            <input
              type="email"
              className="px-4 py-2 rounded-l-full bg-blue-50 border-none outline-none text-sm"
              placeholder="Your email for updates"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-r-full bg-blue-600 text-white font-medium text-sm shadow hover:bg-blue-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          Privacy Policy | Terms of Service | Powered by WareIQ Technologies
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl shadow-md px-8 py-10 flex flex-col items-center justify-center text-center border border-blue-50 hover:shadow-lg transition">
      <div className="mb-5">{icon}</div>
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-700">{desc}</p>
    </div>
  );
}

// Horizontal How It Works Step
function HowItWorksStep({ number, title, subtitle, glow }) {
  return (
    <div className="flex-1 flex flex-col items-center px-6">
      <div className={`w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-extrabold mb-7 shadow-lg ${
        glow ? "shadow-blue-500/50" : ""
      }`} style={{ boxShadow: glow ? '0 0 32px 2px #38bdf8' : undefined }}>
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-base text-gray-500 text-center">{subtitle}</p>
    </div>
  );
}

// Icon SVGs
function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-600" stroke="currentColor" fill="none">
      <rect x="3" y="8" width="18" height="11" rx="2" strokeWidth="2"></rect>
      <rect x="7" y="3" width="10" height="5" rx="1" strokeWidth="2"></rect>
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-600" stroke="currentColor" fill="none">
      <rect x="6" y="5" width="12" height="14" rx="2" strokeWidth="2"></rect>
      <path d="M9 9h6M9 13h2" strokeWidth="2" strokeLinecap="round"></path>
    </svg>
  );
}
function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-600" stroke="currentColor" fill="none">
      <circle cx="11" cy="11" r="7.5" strokeWidth="2"></circle>
      <line x1="16" y1="16" x2="21" y2="21" strokeWidth="2" strokeLinecap="round"></line>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-600" stroke="currentColor" fill="none">
      <path d="M12 3l7 4v5c0 5-3.5 9.2-7 10-3.5-.8-7-5-7-10V7l7-4z" strokeWidth="2"></path>
      <path d="M12 11v4" strokeWidth="2" strokeLinecap="round"></path>
      <circle cx="12" cy="15" r="0.5"></circle>
    </svg>
  );
}
