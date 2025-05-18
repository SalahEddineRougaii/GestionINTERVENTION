import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message, Table, Layout, Card, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Content } = Layout;

const ClientPage = () => {
  const { user, logoutUser } = useUserContext();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [interventions, setInterventions] = useState([]);
  const [showHistory, setShowHistory] = useState(true); // Historique affiché par défaut

  useEffect(() => {
    if (user && user.id) {
      fetchInterventionsHistory(); // Charger l'historique des interventions dès la première connexion
    } else {
      message.error("Utilisateur non trouvé. Veuillez vous reconnecter.");
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchInterventionsHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/interventions/client/${user.id}`);
      setInterventions(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération de l'historique des interventions.");
    }
  };

  const handleRequestIntervention = async (values) => {
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

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const columns = [
    { title: "Description", dataIndex: "description" },
    { title: "Priorité", dataIndex: "priority" },
    { title: "Statut", dataIndex: "status" },
    { title: "Date souhaitée", dataIndex: "desired_date" },
    { title: "Emplacement", dataIndex: "location" },
  ];

  if (!user) {
    return <div>Veuillez faire le login </div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
        {/* Section Nom du client avec icône et déconnexion */}
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <UserOutlined style={{ fontSize: "32px", marginRight: "10px" }} />
                  <h2>Bienvenue, {user.name}</h2>
                </div>
              }
              style={{ borderRadius: "8px", textAlign: "center" }}
              extra={
                <Button
                  type="default"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{ color: "green", borderColor: "green", position: "absolute", top: "20px", right: "20px" }}
                >
                  Se déconnecter
                </Button>
              }
            >
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: "20px", width: "200px" }}
              >
                Demander une intervention
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Section Historique des interventions */}
        <Card
          title={<h2 style={{ textAlign: "center" }}>Historique des interventions</h2>}
          style={{ borderRadius: "8px", marginBottom: "30px", backgroundColor: "#ffffff" }}
        >
          {/* Affichage de l'historique des interventions */}
          <Table
            dataSource={interventions}
            columns={columns}
            rowKey="id"
            pagination={false}
            style={{ backgroundColor: "#fff", borderRadius: "8px" }}
          />
        </Card>

        {/* Section pour la demande d'intervention */}
        <Modal
          title="Nouvelle demande d'intervention"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={form} onFinish={handleRequestIntervention}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Veuillez entrer une description" }]}
            >
              <Input.TextArea placeholder="Décrivez votre problème" />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Priorité"
              rules={[{ required: true, message: "Veuillez sélectionner une priorité" }]}
            >
              <Select placeholder="Sélectionnez une priorité">
                <Option value="haute">Haute</Option>
                <Option value="moyenne">Moyenne</Option>
                <Option value="basse">Basse</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="location"
              label="Emplacement"
              rules={[{ required: true, message: "Veuillez entrer un emplacement" }]}
            >
              <Input placeholder="Entrez l'emplacement" />
            </Form.Item>

            <Form.Item
              name="desired_date"
              label="Date souhaitée"
              rules={[{ required: true, message: "Veuillez sélectionner une date souhaitée" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
              Envoyer la demande
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ClientPage;
