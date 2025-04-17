import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message, Table } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const { Option } = Select;

const ClientPage = () => {
  const { user, logoutUser } = useUserContext();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [interventions, setInterventions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    console.log(user); // Vérifie la structure de l'objet user
  }, [user]);

  const handleRequestIntervention = async (values) => {
    if (!user || !user.id) {
      message.error("Utilisateur non trouvé. Veuillez vous reconnecter.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/interventions", {
        client_id: user.id,
        description: values.description,
        priority: values.priority,
        location: values.location,
        desired_date: values.desired_date.format("YYYY-MM-DD"),
        status: "pending",
      });

      if (response.status === 201) {
        message.success("Demande envoyée avec succès !");
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      message.error("Erreur lors de l'envoi de la demande !");
    } finally {
      setLoading(false);
    }
  };

  const fetchInterventionsHistory = async () => {
    if (!user || !user.id) {
      message.error("Utilisateur non trouvé. Veuillez vous reconnecter.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/interventions/client/${user.id}`);
      setInterventions(response.data);
      setShowHistory(true);
    } catch (error) {
      message.error("Erreur lors de la récupération de l'historique des interventions.");
    }
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const columns = [
    { title: "Description", dataIndex: "description" },
    { title: "Priorité", dataIndex: "priority" },
    { title: "Statut", dataIndex: "status" },
    { title: "Date souhaitée", dataIndex: "desired_date" },
    { title: "Emplacement", dataIndex: "location" },
  ];

  if (!user) {
    return <div>ERROR 404</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.name}</h1>

      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Demander une intervention
      </Button>

      <Button type="default" onClick={fetchInterventionsHistory} style={{ marginLeft: "10px" }}>
        Historique des interventions
      </Button>

      <Modal
        title="Nouvelle demande d'intervention"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleRequestIntervention}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Veuillez entrer une description" }]}>
            <Input.TextArea placeholder="Décrivez votre problème" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priorité"
            rules={[{ required: true, message: "Veuillez sélectionner une priorité" }]}>
            <Select placeholder="Sélectionnez une priorité">
              <Option value="haute">Haute</Option>
              <Option value="moyenne">Moyenne</Option>
              <Option value="basse">Basse</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="Emplacement"
            rules={[{ required: true, message: "Veuillez entrer un emplacement" }]}>
            <Input placeholder="Entrez l'emplacement" />
          </Form.Item>

          <Form.Item
            name="desired_date"
            label="Date souhaitée"
            rules={[{ required: true, message: "Veuillez sélectionner une date souhaitée" }]}>
            <DatePicker />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Envoyer la demande
          </Button>
        </Form>
      </Modal>

      {/* Bouton de déconnexion positionné dans le coin supérieur droit */}
      <Button
        onClick={() => {
          logoutUser(); 
          
          navigate("/login");
          
        }}
        style={{...styles.logoutButton , backgroundColor: "red", color: "white" }}
        
      >
        Se déconnecter
      </Button>

      {/* Affichage de l'historique des interventions */}
      {showHistory && (
        <div style={{ marginTop: "20px" }}>
          <h2>Historique des interventions</h2>
          <Button onClick={handleCloseHistory}>Fermer</Button>
          <Table
            dataSource={interventions}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

// Styles pour le bouton de déconnexion
const styles = {
  logoutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    
  },
};

export default ClientPage;
