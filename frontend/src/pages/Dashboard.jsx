import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    // Redirige automatiquement vers le dashboard e-commerce externe
    React.useEffect(() => {
        window.location.href = "http://localhost:3000/ecommerce";
    }, []);
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center">
                <div className="w-full max-w-full flex-1 flex flex-col items-center">
                    <p>Redirection vers le dashboard e-commerce...</p>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
