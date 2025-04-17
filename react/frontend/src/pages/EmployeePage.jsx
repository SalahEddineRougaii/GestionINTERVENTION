import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { useUserContext } from "../context/UserContext"; // Import du contexte utilisateur
import { useNavigate } from "react-router-dom"; // Importer le hook useNavigate

const EmployeePage = () => {
  const [interventions, setInterventions] = useState([]);
  const { user } = useUserContext(); // Récupérer l'utilisateur connecté depuis le contexte
  const navigate = useNavigate(); // Initialiser le hook navigate

  useEffect(() => {
    if (user) {
      fetchInterventions(user.id); // Utiliser l'ID de l'utilisateur connecté
    }
  }, [user]); // Recharger les interventions si l'utilisateur change

  const fetchInterventions = async (employeeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/interventions/employee/${employeeId}`);
      setInterventions(response.data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des interventions.");
    }
  };

  const completeIntervention = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/interventions/complete/${id}`);
      message.success("Intervention terminée.");
      fetchInterventions(user.id); // Recharger les interventions après la mise à jour
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la mise à jour de l'intervention.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
    navigate("/login"); // Rediriger vers la page de connexion
  };

  if (!user) {
    return <div>Veuillez vous connecter pour accéder à cette page.</div>; // Message si l'utilisateur n'est pas connecté
  }

  return (
    <div>
      <h1>Bienvenue {user.name}</h1>

      {/* Bouton de déconnexion dans le coin supérieur droit */}
      <Button
        onClick={handleLogout}
        type="primary"
        danger
        style={styles.logoutButton}
      >
        Se déconnecter
      </Button>

      <h2>Liste des interventions</h2>
      <Table
        dataSource={interventions}
        columns={[
          { title: "Description", dataIndex: "description" },
          { title: "Priorité", dataIndex: "priority" },
          { title: "Statut", dataIndex: "status" },
          { title: "Date souhaitée", dataIndex: "desired_date" },
          {
            title: "Actions",
            render: (_, record) => (
              <Button
                onClick={() => completeIntervention(record.id)}
                disabled={record.status === "completed"}
              >
                Terminer
              </Button>
            ),
          },
        ]}
        rowKey="id"
      />
    </div>
  );
};

const styles = {
  logoutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
  },
};

export default EmployeePage;
