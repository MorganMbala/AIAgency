import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => {
  const { t } = useTranslation();
  return (
    <Tilt className='xs:w-[250px] w-full'>
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
        >
          <img
            src={icon}
            alt='service-icon'
            className='w-16 h-16 object-contain'
          />
          <h3 className='text-white text-[20px] font-bold text-center'>
            {t(title)}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "Poppins, Inter, Segoe UI, Arial, sans-serif",
        color: "#111",
        borderRadius: 16,
        border: "1px solid #111",
        padding: 24,
      }}
    >
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText + ' text-black font-normal uppercase tracking-widest mb-2'} style={{ color: '#111', background: 'none', fontWeight: 400, fontSize: 16, letterSpacing: 2 }}>
          {t("about.subText") || "Our Approach"}
        </p>
        <h2 className={styles.sectionHeadText + ' text-black'} style={{ color: '#111', background: 'none', fontWeight: 800, fontSize: 38, marginBottom: 8 }}>
          {t("about.title") || "About E-WebGo"}
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-[18px] max-w-3xl leading-[30px]'
        style={{ color: '#444', background: 'none', fontWeight: 400 }}
      >
        {t("about.paragraph") || "We are passionate about building digital solutions that empower brands and businesses to grow. Our team combines creativity, technology, and strategy to deliver results that matter."}
      </motion.p>
      <br />
      <h2 className={styles.sectionHeadText + ' text-black'} style={{ color: '#111', background: 'none', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>
        {t("about.values") || "Our Values"}
      </h2>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
      <br />
      <h2 className={styles.sectionHeadText + ' text-black'} style={{ color: '#111', background: 'none', fontWeight: 800, fontSize: 32, margin: '32px 0 16px 0' }}>
        How it Works
      </h2>
    </div>
  );
};

export default SectionWrapper(About, "about");
