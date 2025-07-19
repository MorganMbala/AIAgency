import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState('AI Services');
  const navigate = useNavigate();

  // Détection de l'utilisateur connecté via localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Auth buttons absolutely at top right */}
      <div className="fixed top-3 right-8 z-50 flex gap-3">
        <Link to="/contact">
          <button className="px-5 py-2 border border-black text-black font-semibold rounded-full bg-white hover:bg-black hover:text-white transition text-base">Contact Us</button>
        </Link>
        {user ? (
          <button onClick={handleLogout} className="px-5 py-2 border border-black text-black font-semibold rounded-full bg-white hover:bg-black hover:text-white transition text-base">Se déconnecter</button>
        ) : (
          <Link to="/login">
            <button className="px-5 py-2 border border-black text-black font-semibold rounded-full bg-white hover:bg-black hover:text-white transition text-base">Se connecter</button>
          </Link>
        )}
      </div>
      <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 z-40 font-sans">
        <div className="max-w-[1600px] mx-auto px-8 sm:px-16 flex items-center justify-start h-20">
          {/* Logo et nom très à gauche */}
          <Link to="/" className="flex items-center gap-2 mr-12">
            {console.log("logo path:", logo)}
            <img src={logo} alt="Logo" className="h-12 w-auto ml-0" />
            <span className="font-extrabold text-2xl tracking-tight text-black ewebgo-brand" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', textDecoration: 'none', background: 'none', boxShadow: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent', borderBottom: 'none', outline: 'none', WebkitTextDecoration: 'none', WebkitBoxShadow: 'none', WebkitBorderBottom: 'none' }}>E-WebGo</span>
          </Link>
          {/* Menu centré, sans underline ni CASES */}
          <div className="hidden md:flex gap-10 items-center flex-1">
            <Link to="/" className="text-black font-semibold text-lg tracking-wide px-2 hover:text-black transition no-underline" style={{ textDecoration: 'none' }}>HOME</Link>
            {/* SERVICES Dropdown refait comme l'image, interactif */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => { setServicesOpen(false); setActiveServiceCategory('AI Services'); }}>
              <button className="text-black font-semibold text-lg tracking-wide px-2 hover:text-black transition flex items-center gap-1 focus:outline-none no-underline" style={{ textDecoration: 'none' }}>
                Services <span className="text-xs">▼</span>
              </button>
              {servicesOpen && (
                <div className="absolute left-0 top-full mt-2 w-screen max-w-none bg-white border border-gray-200 shadow-2xl rounded-xl flex z-30 min-h-[350px]">
                  {/* Colonne gauche : catégories */}
                  <div className="w-64 py-6 px-2 border-r border-gray-100 flex flex-col gap-1">
                    <button
                      className={`flex items-center justify-between px-5 py-3 rounded-lg font-semibold text-base focus:outline-none cursor-pointer ${activeServiceCategory === 'AI Services' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-black'}`}
                      onMouseEnter={() => setActiveServiceCategory('AI Services')}
                    >
                      AI Services <span className="ml-2">&gt;</span>
                    </button>
                    <button
                      className={`flex items-center justify-between px-5 py-3 rounded-lg font-semibold text-base focus:outline-none cursor-pointer ${activeServiceCategory === 'AI Solutions' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-black'}`}
                      onMouseEnter={() => setActiveServiceCategory('AI Solutions')}
                    >
                      AI Solutions <span className="ml-2">&gt;</span>
                    </button>
                    <button
                      className={`flex items-center justify-between px-5 py-3 rounded-lg font-semibold text-base focus:outline-none cursor-pointer ${activeServiceCategory === 'Software Development' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-black'}`}
                      onMouseEnter={() => setActiveServiceCategory('Software Development')}
                    >
                      Software Development <span className="ml-2">&gt;</span>
                    </button>
                    <button
                      className={`flex items-center justify-between px-5 py-3 rounded-lg font-semibold text-base focus:outline-none cursor-pointer ${activeServiceCategory === 'Software Solutions' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-black'}`}
                      onMouseEnter={() => setActiveServiceCategory('Software Solutions')}
                    >
                      Software Solutions <span className="ml-2">&gt;</span>
                    </button>
                  </div>
                  {/* Colonne droite : services dynamiques */}
                  <div className="flex-1 grid grid-cols-3 gap-12 p-12">
                    {activeServiceCategory === 'AI Services' && (
                      <>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/robot-2.png" alt="AI Agent Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Agent Development</div>
                            <div className="text-gray-600 text-sm">From customer service AI agents to employee training AI.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/artificial-intelligence.png" alt="AI Development Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Development Services</div>
                            <div className="text-gray-600 text-sm">Transform your ideas into reality with cutting-edge AI technologies.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/android-os.png" alt="AI App Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI App Development</div>
                            <div className="text-gray-600 text-sm">Building intelligent AI apps that transform ideas into smart, scalable solutions.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/fluency/48/chatbot.png" alt="Chatbot Development Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Chatbot Development Services</div>
                            <div className="text-gray-600 text-sm">Creative chatbot solutions to streamline business conversations.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/source-code.png" alt="AI Product Development Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Product Development Services</div>
                            <div className="text-gray-600 text-sm">AI product development service powering digital transformation.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/brainstorm-skill.png" alt="Generative AI Development Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Generative AI Development Services</div>
                            <div className="text-gray-600 text-sm">Advanced AI for boosting creativity and project effectiveness.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/consultation.png" alt="AI Consulting Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Consulting Services</div>
                            <div className="text-gray-600 text-sm">Expert advice to help you innovate and enhance your business processes.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/merge-git.png" alt="AI Integration Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Integration Services</div>
                            <div className="text-gray-600 text-sm">Helping businesses integrate AI technologies to business processes.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/automation.png" alt="AI Automation Services" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Automation Services</div>
                            <div className="text-gray-600 text-sm">Turn manual processes into intelligent systems.</div>
                          </div>
                        </div>
                      </>
                    )}
                    {activeServiceCategory === 'AI Solutions' && (
                      <>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/brain.png" alt="Mental Health AI" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Mental Health AI Solutions</div>
                            <div className="text-gray-600 text-sm">AI chatbots, mood tracking, therapy tools, and telehealth.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/print.png" alt="On-Demand Printing" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">On-Demand Printing Solutions</div>
                            <div className="text-gray-600 text-sm">Revolutionizing printing with AI-driven, customizable, on-demand solutions.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/money-bag.png" alt="Wealth Management" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Wealth Management Solutions</div>
                            <div className="text-gray-600 text-sm">Smart AI for smarter wealth management & investment strategies.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/conference-call.png" alt="Staffing" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Solutions for Staffing</div>
                            <div className="text-gray-600 text-sm">AI–enhanced staffing solutions for dynamic workforce needs.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/handshake.png" alt="Recruitment" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Solutions for Recruitment</div>
                            <div className="text-gray-600 text-sm">Revolutionizing recruitment with intelligent, AI-powered talent matching.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/classroom.png" alt="EdTech" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">EdTech Solutions</div>
                            <div className="text-gray-600 text-sm">Building AI–powered software solutions for education sector.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/hospital-room.png" alt="Healthcare" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">AI Solutions for Healthcare</div>
                            <div className="text-gray-600 text-sm">Optimizing medical reach rate with our AI solutions in healthcare.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/city-buildings.png" alt="Real Estate" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Real Estate AI Solutions</div>
                            <div className="text-gray-600 text-sm">Level up your real estate business with AI real estate solutions</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/insurance.png" alt="Insurance" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Insurance AI Software Development</div>
                            <div className="text-gray-600 text-sm">Solutions for underwriting, claims processing, and risk management.</div>
                          </div>
                        </div>
                      </>
                    )}
                    {activeServiceCategory === 'Software Development' && (
                      <>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/smartphone-tablet.png" alt="Mobile App" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Mobile App Development</div>
                            <div className="text-gray-600 text-sm">Designing user-centric mobile apps for seamless performance across platforms.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/cms.png" alt="CMS Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">CMS Development</div>
                            <div className="text-gray-600 text-sm">Developing versatile CMS platforms for efficient content management and workflow.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/web.png" alt="Web Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Web Development</div>
                            <div className="text-gray-600 text-sm">Crafting dynamic, responsive websites for an optimal online presence</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/shopping-cart.png" alt="ECommerce Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">ECommerce Development</div>
                            <div className="text-gray-600 text-sm">Building comprehensive eCommerce platforms for engaging shopping experiences.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/source-code.png" alt="Full Stack Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Full Stack Development</div>
                            <div className="text-gray-600 text-sm">Providing full-stack development services for versatile and efficient web solutions.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/marketing.png" alt="Digital Marketing" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Digital Marketing</div>
                            <div className="text-gray-600 text-sm">Strategic digital marketing services for enhanced brand visibility and growth.</div>
                          </div>
                        </div>
                      </>
                    )}
                    {activeServiceCategory === 'Software Solutions' && (
                      <>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/combo-chart.png" alt="UI/UX" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">UI/UX</div>
                            <div className="text-gray-600 text-sm">Creating digital experiences users enjoy and brands rely on</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/goal.png" alt="MVP Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">MVP Development</div>
                            <div className="text-gray-600 text-sm">Looking for MVP development company to launch your product faster? We build scalable, market-ready MVPs.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/factory.png" alt="Manufacturing Software Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Manufacturing Software Development</div>
                            <div className="text-gray-600 text-sm">Custom software solutions enhancing manufacturing efficiency, automation, and real-time monitoring.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/sports.png" alt="Sports Betting App Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Sports Betting App Development</div>
                            <div className="text-gray-600 text-sm">Choose best sports betting app development company, trusted by fortune 500 companies.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/financial-growth-analysis.png" alt="Trading Software Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Trading Software Development</div>
                            <div className="text-gray-600 text-sm">Powering Profitable Trades with Cutting-Edge Custom Software Solutions.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/business-group.png" alt="HR Software Development" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">HR Software Development</div>
                            <div className="text-gray-600 text-sm">Automated HR services crafted for efficiency</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/like--v1.png" alt="Dating" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Dating</div>
                            <div className="text-gray-600 text-sm">Creating engaging dating platforms for meaningful connections and experiences.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/conference.png" alt="Social Networking" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">Social Networking</div>
                            <div className="text-gray-600 text-sm">Developing dynamic social networking sites for enhanced community interaction.</div>
                          </div>
                        </div>
                        <div className="flex gap-4 items-start">
                          <img src="https://img.icons8.com/color/48/000000/shopping-mall.png" alt="eCommerce & Marketplaces" className="w-12 h-12" />
                          <div>
                            <div className="font-bold text-base text-black">eCommerce & Marketplaces</div>
                            <div className="text-gray-600 text-sm">Building robust eCommerce & marketplace solutions for seamless online trading.</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* INDUSTRIES Dropdown amélioré */}
            <div className="relative group">
              <Link to="" className="text-black font-semibold text-lg tracking-wide px-2 hover:text-black transition no-underline" style={{ textDecoration: 'none' }}>
                INDUSTRIES <span className="text-xs">▼</span>
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg z-20">
                <Link to="/industries/all" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>All Sectors</Link>
                <Link to="/industries/insurance" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>Insurance</Link>
                <Link to="/industries/real-estate" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>Real Estate</Link>
                <Link to="/industries/fintech" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>Fintech & Banking</Link>
                <Link to="/industries/logistics" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>Logistics</Link>
                <Link to="/industries/ecommerce" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>E-Commerce & Retail</Link>
                <Link to="/industries/sport" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>Sport & Wellness</Link>
                <Link to="/industries/healthcare" className="block px-6 py-3 hover:bg-gray-100 text-black no-underline" style={{ textDecoration: 'none' }}>Healthcare</Link>
              </div>
            </div>
            <Link to="/insights" className="text-black font-semibold text-lg tracking-wide px-2 hover:text-black transition no-underline" style={{ textDecoration: 'none' }}>CASES</Link>
            <Link to="/insights" className="text-black font-semibold text-lg tracking-wide px-2 hover:text-black transition no-underline" style={{ textDecoration: 'none' }}>INSIGHTS</Link>
            {/* ABOUT Dropdown (clic) */}
            <div className="relative group">
              <Link to="" className="text-black font-semibold text-lg tracking-wide px-2 hover:text-black transition no-underline" style={{ textDecoration: 'none' }}>
                ABOUT <span className="text-xs">▼</span>
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg z-20">
                <Link to="/about" className="block px-6 py-3 hover:bg-blue-50 hover:text-blue-700 text-black no-underline rounded transition" style={{ textDecoration: 'none' }}>About Us</Link>
                <Link to="/careers" className="block px-6 py-3 hover:bg-blue-50 hover:text-blue-700 text-black no-underline rounded transition" style={{ textDecoration: 'none' }}>Careers</Link>
              </div>
            </div>
            {/* Section Dashboard visible uniquement pour l'admin */}
            {user && user.user && user.user.role === 'admin' && (
              <Link to="/dashboard" className="text-black font-semibold text-lg tracking-wide px-2 hover:text-blue-700 transition no-underline" style={{ textDecoration: 'none' }}>
                DASHBOARD
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
