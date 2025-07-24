import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => {
  const { t } = useTranslation();
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#fff",
        color: "#111",
        border: "1px solid #111",
        borderRadius: 16,
      }}
      contentArrowStyle={{ borderRight: "7px solid #111" }}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='font-bold text-[24px]' style={{ color: "#111" }}>
          {t(experience.title)}
        </h3>
        <p
          className='text-[16px] font-semibold'
          style={{ margin: 0, color: "#555" }}
        >
          {t(experience.company_name)}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, i) => (
          <li
            key={i}
            className='text-[14px]'
            style={{ color: "#111" }}
          >{t(point)}</li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { t } = useTranslation();
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={styles.sectionHeadText + " text-black"}>
          {t("experience.title")}
        </h2>
      </motion.div>

      <div className='mt-20'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
