import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    compagny: "",
    companySize: "1-50",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_usg1xmf",
        "template_3u5k4um",
        {
          from_name: form.name,
          to_name: "Morgan",
          from_email: form.email,
          to_email: "morganmbala03@gmail.com",
          message: form.message,
        },
        "k_UaJ0rMQiIj6YBgJ"
      )
      .then(
        () => {
          setLoading(false);
          alert(t("contact.alert.success"));
          setForm({
            name: "",
            email: "",
            compagny: "",
            companySize: "1-50",
            message: "",
          });
        },
        () => {
          setLoading(false);
          alert(t("contact.alert.error"));
        }
      );
  };

  return (
    <div className='xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden'>
      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='flex-[0.75] bg-white p-8 rounded-2xl border border-black'
      >
        <p className={styles.sectionSubText + ' text-black'} style={{ color: '#111' }}>{t("contact.subText") || "Contact us for a free consultation"}</p>
        <h3 className={styles.sectionHeadText + ' text-black'} style={{ color: '#111' }}>{t("contact.title") || "Contact"}</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>
              {t("contact.labels.fullName")}
            </span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder={t("contact.placeholders.fullName")}
              className='bg-white py-4 px-6 placeholder:text-gray-500 text-black rounded-lg outline-none border border-black font-medium'
            />
          </label>

          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>
              {t("contact.labels.workEmail")}
            </span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder={t("contact.placeholders.workEmail")}
              className='bg-white py-4 px-6 placeholder:text-gray-500 text-black rounded-lg outline-none border border-black font-medium'
            />
          </label>

          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>
              {t("contact.labels.companyName")}
            </span>
            <input
              type='text'
              name='compagny'
              value={form.compagny}
              onChange={handleChange}
              placeholder={t("contact.placeholders.companyName")}
              className='bg-white py-4 px-6 placeholder:text-gray-500 text-black rounded-lg outline-none border border-black font-medium'
            />
          </label>

          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>
              {t("contact.labels.companySize")}
            </span>
            <select
              name='companySize'
              value={form.companySize}
              onChange={handleChange}
              className='bg-white py-4 px-6 text-black rounded-lg outline-none border border-black font-medium'
            >
              <option value='1-50'>1-50</option>
              <option value='50-100'>50-100</option>
              <option value='100-500'>100-500</option>
              <option value='500-1000'>500-1000</option>
              <option value='1000+'>1000+</option>
            </select>
          </label>

          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>
              {t("contact.labels.message")}
            </span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder={t("contact.placeholders.message")}
              className='bg-white py-4 px-6 placeholder:text-gray-500 text-black rounded-lg outline-none border border-black font-medium'
            />
          </label>

          <button
            type='submit'
            className='bg-black py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md border border-black hover:bg-gray-900 transition'
          >
            {loading ? t("contact.button.sending") : t("contact.button.send")}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");