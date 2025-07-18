import React from "react";
import { useTranslation } from "react-i18next";

import { styles } from "../styles";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p className={`${styles.sectionSubText} text-center`}>
        {t("tech.subText")}
      </p>
      <h2 className={`${styles.sectionHeadText} text-center`}>
        {t("tech.title")}
      </h2>
      <br />

      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-28' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "");
