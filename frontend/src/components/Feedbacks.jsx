import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-white p-10 rounded-3xl xs:w-[320px] w-full border border-black shadow-card'
    style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', color: '#111' }}
  >
    <p className='font-black text-[48px]' style={{ color: '#111' }}>
      "
    </p>

    <div className='mt-1'>
      <p className='tracking-wider text-[18px]' style={{ color: '#111' }}>{testimonial}</p>

      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='font-medium text-[16px]' style={{ color: '#111' }}>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-[12px]' style={{ color: '#555' }}>
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className='w-10 h-10 rounded-full object-cover border border-black'
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <div className={`mt-12 bg-white rounded-[20px] border border-black`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', color: '#111' }}>
      <div
        className={`bg-white rounded-2xl ${styles.padding} min-h-[300px] border-b border-black`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText + ' text-black'}>What others say</p>
          <h2 className={styles.sectionHeadText + ' text-black'}>Testimonials</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");