import React from "react";
import { useTranslation } from "react-i18next";

import { styles } from "../styles";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  const { t } = useTranslation();

  return (
    <div style={{ background: '#fff', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', color: '#111', borderRadius: 16, border: '1px solid #111', padding: 24 }}>
      <p className={`${styles.sectionSubText} text-center`} style={{ color: '#111', fontWeight: 700, fontSize: 18 }}>
        {t("tech.subText") || "Technologies"}
      </p>
      <h2 className={`${styles.sectionHeadText} text-center`} style={{ color: '#111', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>
        {t("tech.title") || "Technologies"}
      </h2>
      <br />
      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-28 bg-white border border-black rounded-xl flex items-center justify-center' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "");
