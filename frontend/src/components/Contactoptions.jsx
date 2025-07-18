import React from "react";
import { Link } from "react-router-dom";

const ContactOptions = () => {
  return (
    <section className="min-h-screen bg-gray-100 py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Get a Free Consultation
        </h2>
        <p className="text-lg text-gray-700">
          Let’s explore how we can work together
        </p>
        <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
          Our team will work with you to understand your business needs, your goals, and your vision.
          We'll listen carefully, then provide a detailed plan of action outlining the steps to bring your project to life.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {/* Box 1 */}
        <div className="bg-yellow-300 p-8 rounded-xl w-full md:w-1/2 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Submit an Inquiry</h3>
          <p className="text-gray-700 mb-6">
            This is a simple way to connect with us, request information, ask a question, or even get started with a new project.
          </p>
          <Link
            to="/contact"
            className="bg-white text-white font-semibold py-3 px-6 rounded-lg inline-block hover:bg-gray-100 transition"
          >
            Leave Us A Message
          </Link>
          <p className="text-xs mt-3 text-gray-600">
            The first reply takes around a business day.
          </p>
        </div>

        {/* Box 2 */}
        <div className="bg-sky-500 text-white p-8 rounded-xl w-full md:w-1/2 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Schedule a Meeting</h3>
          <p className="mb-6">
            Select a suitable time slot and have a video call with a project manager to discuss your needs.
          </p>
          <a
  href="https://calendly.com/dovonkossiemmanuel/30min"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-white text-sky-600 font-semibold py-3 px-6 rounded-lg inline-block hover:opacity-90 transition"
>
  Book a Video Meeting
</a>
          <p className="text-xs mt-3">
            Synced with the availability on both sides.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactOptions;
