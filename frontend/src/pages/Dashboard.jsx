import React from "react";

const Dashboard = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="http://localhost:3000"
        title="Dashboard"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default Dashboard;
