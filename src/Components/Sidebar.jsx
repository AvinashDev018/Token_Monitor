import {
    FaChartPie,
    FaImage,
    FaHistory,
    FaUsers,
    FaProjectDiagram,
    FaCog,
    FaKey
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar(){

    return(

        <div className="sidebar">

            <h2>AI Monitor</h2>

            <ul>

                <li><FaChartPie/> Dashboard</li>

                <li><FaImage/> Upload Image</li>

                <li><FaHistory/> History</li>

                <li><FaUsers/> Users</li>

                <li><FaProjectDiagram/> Projects</li>

                <li><FaKey/> API Keys</li>

                <li><FaCog/> Settings</li>

            </ul>

        </div>

    )

}

export default Sidebar;