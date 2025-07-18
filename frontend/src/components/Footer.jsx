import { Link } from "react-router-dom";
import { BiLogoLinkedinSquare, BiLogoMediumSquare } from "react-icons/bi";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error(t("footer.invalidEmail"));
      return;
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzKzJGonQd0EEy1EUJ5O1Si-Phdq-JJ3Ci354u5spjFqDTMGtkMfBommOzfN_fI2tkH/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success(t("footer.successMessage"));
        setEmail("");
      } else {
        toast.error(t("footer.sendError"));
      }
    } catch (error) {
      toast.error(t("footer.networkError"));
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#f4f9ff] via-[#d6e8fa] to-[#cce0f5] text-gray-800 pt-16 pb-10 transition-all duration-500">
      <ToastContainer position="bottom-center" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center md:text-left">
        {/* COORDONNÉES */}
        <div>
          <h3 className="text-2xl font-bold mb-4">📍 {t("footer.contact")}</h3>
          <p className="mb-1">E-WebGo, LLC</p>
          <p className="mb-1">135 Madison Ave Fl 8</p>
          <p className="mb-4">Montréal, QC 10016</p>
          <p className="mb-1">✉️ info@e-webgo.com</p>
          <p>📞 (514) 576-4832</p>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-2xl font-bold mb-4">📫 {t("footer.newsletter")}</h3>
          <p className="mb-4">{t("footer.subscribePrompt")}</p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm w-full sm:w-auto text-black bg-white dark:bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105 duration-300"
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>

        {/* CTA */}
        <div>
          <h3 className="text-2xl font-bold mb-4">
            🚀 {t("footer.readyProject")}{" "}
            <span className="text-blue-600">{t("footer.custom")}</span> ?
          </h3>
          <a
            href="#contact"
            className="inline-block mt-4 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition transform hover:scale-105 duration-300 shadow-md border border-gray-300"
          >
            {t("footer.contactUs")}
          </a>
        </div>
      </div>

      {/* SOCIAL + POLITIQUE */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-sm text-center space-y-4">
        <div className="flex justify-center gap-6 text-2xl text-gray-600">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition transform hover:scale-125 duration-300"
          >
            <BiLogoLinkedinSquare />
          </a>
          <a
            href="https://medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition transform hover:scale-125 duration-300"
          >
            <BiLogoMediumSquare />
          </a>
        </div>

        <ul className="flex justify-center flex-wrap gap-4 text-xs text-gray-600">
          <li><Link to="/cookie" className="hover:text-blue-500 transition">{t("footer.cookie")}</Link></li>
          <li><Link to="/privacy" className="hover:text-blue-500 transition">{t("footer.privacy")}</Link></li>
          <li><Link to="/terms" className="hover:text-blue-500 transition">{t("footer.terms")}</Link></li>
          <li><Link to="/disclaimer" className="hover:text-blue-500 transition">{t("footer.disclaimer")}</Link></li>
        </ul>

        <p className="text-gray-500">{`© 2025 E-WebGo, LLC. ${t("footer.rights")}`}</p>
      </div>
    </footer>
  );
};

export default Footer;
