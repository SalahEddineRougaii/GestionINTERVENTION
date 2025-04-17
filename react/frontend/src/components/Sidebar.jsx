import React from "react";

const Sidebar = ({ role }) => {
    return (
        <div className="sidebar">
            {role === "admin" ? (
                <ul>
                    <li>Dashboard Admin</li>
                    <li>Liste des Employés</li>
                </ul>
            ) : (
                <ul>
                    <li>Dashboard Employé</li>
                    <li>Mes Tâches</li>
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
