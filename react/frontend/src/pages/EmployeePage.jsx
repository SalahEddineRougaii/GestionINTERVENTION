import React, { useState, useEffect } from "react";
import { Table, Button, message, Layout, Menu } from "antd";
import { FileTextOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const EmployeePage = () => {
  const [interventions, setInterventions] = useState([]);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchInterventions(user.id);
    }
  }, [user]);

  const fetchInterventions = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/interventions/employee/${employeeId}`
      );
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
      fetchInterventions(user.id);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la mise à jour de l'intervention.");
    }
  };

  const cancelIntervention = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/interventions/cancel/${id}`);
      message.success("Intervention annulée.");
      fetchInterventions(user.id);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'annulation de l'intervention.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      handleLogout();
    }
  };

  if (!user) {
    return <div>Veuillez vous connecter pour accéder à cette page.</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ✅ Sidebar */}
      <Sider width={220} theme="light" style={{ backgroundColor: "#e6f4ea" }}>
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="employee"
            style={{ width: "80px", borderRadius: "50%" }}
          />
          <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "10px" }}>
            {user.name}
          </div>
        </div>
        <Menu
          mode="inline"
          onClick={handleMenuClick}
          defaultSelectedKeys={["interventions"]}
          style={{ backgroundColor: "#e6f4ea", borderRight: "none" }}
        >
          <Menu.Item key="interventions" icon={<FileTextOutlined />}>
            Interventions
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
            Déconnexion
          </Menu.Item>
        </Menu>
      </Sider>

      {/* ✅ Contenu principal */}
      <Layout>
        <Content style={{ backgroundColor: "#f5f5f5", padding: "24px", minHeight: "100vh" }}>
          <h2 style={{ marginBottom: "24px" }}>Liste des interventions</h2>
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
                  <>
                    <Button
                      onClick={() => completeIntervention(record.id)}
                      disabled={record.status === "completed"}
                      style={{ marginRight: 8 }}
                    >
                      Terminer
                    </Button>
                    {record.status === "completed" && (
                      <Button onClick={() => cancelIntervention(record.id)} danger>
                        Annuler
                      </Button>
                    )}
                  </>
                ),
              },
            ]}
            rowKey="id"
            style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px" }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployeePage;
