import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center">
                <div className="w-full max-w-full flex-1 flex flex-col items-center">
                    <iframe
                        src="http://localhost:3001" // Change this URL if ton dashboard tourne sur un autre port
                        title="Admin Dashboard"
                        className="w-full h-[80vh] border-0 rounded-xl shadow-lg"
                        style={{ minHeight: '700px', background: 'white' }}
                        allowFullScreen
                    />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
