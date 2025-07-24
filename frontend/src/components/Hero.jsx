import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/ImageAnimeeProjetEcom.mp4";
import { useTranslation } from "react-i18next";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaMagic, FaCreditCard } from "react-icons/fa";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="w-full min-h-screen flex flex-col justify-between px-6 md:px-0 py-24 bg-white"
      style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', color: '#111' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-24 w-full">
        {/* COLONNE GAUCHE : Texte */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl w-full text-center lg:text-left"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-8"
            style={{ color: '#111', lineHeight: 1.1 }}
          >
            <span className="block">Your brand deserve the</span>
            <span className="block">best</span>
          </h1>
          <div className="h-1 w-2/3 bg-black mx-auto lg:mx-0 mb-8" />
          <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-xl mx-auto lg:mx-0">
            We create tailored websites, landing pages, portfolios, and SaaS solutions to boost your brand and ensure success.
          </p>
          <div className="mb-12">
            <a
              href="#contact"
              className="inline-block px-10 py-4 bg-black text-white font-bold rounded-lg text-lg hover:bg-gray-900 transition shadow-lg border-2 border-black"
              style={{ letterSpacing: 1 }}
            >
              Start your project
            </a>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-10 text-base text-gray-800 mt-8">
            <div className="flex items-center gap-2">
              <BsCheckCircleFill className="text-black" />
              <span>100% Risk-Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Try Before You Buy</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCreditCard className="text-black" />
              <span>Pay Only If Satisfied</span>
            </div>
          </div>
        </motion.div>
        {/* COLONNE DROITE : Image/vidéo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="flex justify-center w-full"
        >
          <video
            className="max-w-lg w-full drop-shadow-2xl rounded-2xl border-4 border-black"
            autoPlay
            loop
            muted
            playsInline
            style={{ background: '#f4f4f4' }}
          >
            <source src={heroImg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>
      {/* TEXTE EN BAS CENTRÉ */}
      <div className="w-full mt-24 text-center">
        <p className="text-gray-500 text-base tracking-wide">
          Trusted by 5,000+ businesses and creative agencies worldwide from all shapes and sizes.
        </p>
      </div>
    </section>
  );
};

export default Hero;
