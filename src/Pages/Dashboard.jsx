import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-content">

                <Navbar />

                <DashboardCards />

            </div>

        </div>
    );
}

export default Dashboard;