import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/ImageAnimeeProjetEcom.mp4";
import { useTranslation } from "react-i18next";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaMagic, FaCreditCard } from "react-icons/fa";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-white w-full min-h-screen flex flex-col justify-between px-6 md:px-12 py-24">
      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
        
        {/* COLONNE GAUCHE : Texte */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl w-full text-center lg:text-left"
        >
          <br />
          <br />
          <br />
          <br />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mb-8">
            {/* <div>{t("hero.clean1")}</div> */}
            <div className="inline-block border-b-8 border-blue-600 pb-1 w-fit">
              {t("hero.clean2")}
            </div>
          </h1>

          <p className="text-gray-700 text-lg mb-8">
            {t("hero.subText")}
          </p>

          <div className="mb-8">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              {t("hero.cta")}
            </a>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <BsCheckCircleFill className="text-black-500" />
              <span>{t("hero.benefit1")}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <FaMagic className="text-black-500" /> */}
              <span>{t("hero.benefit2")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCreditCard className="text-black-500" />
              <span>{t("hero.benefit3")}</span>
            </div>
          </div>
        </motion.div>

        {/* COLONNE DROITE : Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="flex justify-center w-full"
        >
          <video
  className="max-w-md w-full drop-shadow-xl rounded-lg"
  autoPlay
  loop
  muted
  playsInline
>
  <source src={heroImg} type="video/mp4" />
  Your browser does not support the video tag.
</video>
        </motion.div>
      </div>

      {/* TEXTE EN BAS CENTRÉ */}
      <div className="w-full mt-20 text-center">
        <p className="text-gray-500 text-sm">
          {t("hero.trusted")}
        </p>
      </div>
    </section>
  );
};

export default Hero;
