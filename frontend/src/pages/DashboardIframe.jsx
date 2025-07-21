import React from "react";

const DashboardIframe = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <iframe
        src="http://localhost:3000/"
        title="Dashboard"
        className="w-[90vw] h-[90vh] rounded-lg shadow-lg border"
        allowFullScreen
      />
    </div>
  );
};

export default DashboardIframe;
