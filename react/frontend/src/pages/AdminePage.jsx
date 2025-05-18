import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Layout,
  Menu,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assigningInterventionId, setAssigningInterventionId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const interventionRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    fetchInterventions();
    fetchUsers();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/interventions");
      setInterventions(response.data);
      setFilteredInterventions(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des interventions.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des utilisateurs.");
    }
  };

  const generatePDF = (intervention) => {
    const doc = new jsPDF();
    doc.text("Détails de l'intervention", 10, 10);
    doc.text(`Client: ${users.find((u) => u.id === intervention.client_id)?.name}`, 10, 20);
    doc.text(`Description: ${intervention.description}`, 10, 30);
    doc.text(`Priorité: ${intervention.priority}`, 10, 40);
    doc.text(`Emplacement: ${intervention.location}`, 10, 50);
    doc.text(`Date souhaitée: ${intervention.desired_date}`, 10, 60);
    doc.text(`Statut: ${intervention.status}`, 10, 70);
    doc.save(`intervention_${intervention.id}.pdf`);
  };

  const assignIntervention = async (interventionId, employeeId) => {
    if (!employeeId) return message.error("Veuillez sélectionner un employé.");

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/interventions/${interventionId}`, {
        employee_id: employeeId,
      });

      if (response.status === 200) {
        message.success("Intervention attribuée avec succès.");
        setAssigningInterventionId(null);
        fetchInterventions();
      } else {
        message.error("Erreur lors de l'attribution de l'intervention.");
      }
    } catch (error) {
      message.error("Erreur lors de l'attribution de l'intervention.");
    }
  };

  const cancelAssignment = async (interventionId) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/interventions/${interventionId}/annuler`);
      if (response.status === 200) {
        message.success("Attribution annulée avec succès.");
        fetchInterventions();
      } else {
        message.error("Erreur lors de l'annulation de l'attribution.");
      }
    } catch (error) {
      message.error("Erreur lors de l'annulation de l'attribution.");
    }
  };

  const editUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user.role === "admin") return message.error("Impossible de modifier un admin.");
    setSelectedUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const deleteUser = async (userId, role) => {
    if (role === "admin") return message.error("Impossible de supprimer un admin.");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
      message.success("Utilisateur supprimé.");
      fetchUsers();
    } catch (error) {
      message.error("Erreur lors de la suppression.");
    }
  };

  const handleUpdateRole = async (values) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${selectedUser.id}`, {
        role: values.role,
      });
      message.success("Rôle mis à jour.");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Erreur lors de la mise à jour du rôle.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUserSearch = (e) => {
    const value = e.target.value;
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleInterventionSearch = (e) => {
    const value = e.target.value;
    const filtered = interventions.filter((intervention) =>
      users.find((u) => u.id === intervention.client_id)?.name.toLowerCase().includes(value.toLowerCase()) ||
      intervention.location.toLowerCase().includes(value.toLowerCase()) ||
      intervention.priority.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInterventions(filtered);
  };

  const handleMenuClick = (key) => {
    if (key === "interventions") {
      interventionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (key === "users") {
      userRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} theme="light" style={{ backgroundColor: "#e6f4ea" }}>
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="logo" style={{ width: "80px" }} />
          <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "10px" }}>Bienvenue Salah</div>
        </div>
        <Menu
          mode="inline"
          onClick={(e) => handleMenuClick(e.key)}
          defaultSelectedKeys={["interventions"]}
          style={{ backgroundColor: "#e6f4ea" }}
        >
          <Menu.Item key="interventions" icon={<FileTextOutlined />}>
            Interventions
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Utilisateurs
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Déconnexion
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: "20px 40px" }}>
          {/* Interventions */}
          <div ref={interventionRef}>
            <h2>Gestion des interventions</h2>
            <Input
              placeholder="Rechercher par client, emplacement ou priorité"
              onChange={handleInterventionSearch}
              style={{ marginBottom: "20px", width: "300px" }}
            />
            <Table
              dataSource={filteredInterventions}
              columns={[
                {
                  title: "Client",
                  dataIndex: "client_id",
                  render: (clientId) => {
                    const client = users.find((user) => user.id === clientId);
                    return client ? client.name : "Inconnu";
                  },
                },
                { title: "Description", dataIndex: "description" },
                { title: "Priorité", dataIndex: "priority" },
                { title: "Emplacement", dataIndex: "location" },
                { title: "Date souhaitée", dataIndex: "desired_date" },
                { title: "Statut", dataIndex: "status" },
                {
                  title: "Attribuer",
                  render: (_, record) =>
                    record.status === "assigned" ? (
                      <Button onClick={() => cancelAssignment(record.id)} style={{ marginRight: 8 }}>
                        Annuler l'attribution
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setAssigningInterventionId(record.id)}
                        disabled={record.status !== "pending"}
                      >
                        Attribuer
                      </Button>
                    ),
                },
                {
                  title: "PDF",
                  render: (_, record) => (
                    <Button onClick={() => generatePDF(record)} style={{ backgroundColor: "#4caf50", color: "#fff" }}>
                      Générer PDF
                    </Button>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </div>

          {/* Utilisateurs */}
          <div ref={userRef} style={{ marginTop: "40px" }}>
            <h2>Gestion des utilisateurs</h2>
            <Input
              placeholder="Rechercher par nom, email ou rôle"
              onChange={handleUserSearch}
              style={{ marginBottom: "20px", width: "300px" }}
            />
            <Table
              dataSource={filteredUsers}
              columns={[
                { title: "Nom", dataIndex: "name" },
                { title: "Email", dataIndex: "email" },
                { title: "Rôle", dataIndex: "role" },
                {
                  title: "Actions",
                  render: (_, record) => (
                    <div>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => editUser(record.id)}
                        style={{ marginRight: 10 }}
                        disabled={record.role === "admin"}
                      />
                      <Popconfirm
                        title="Supprimer cet utilisateur ?"
                        onConfirm={() => deleteUser(record.id, record.role)}
                        okText="Oui"
                        cancelText="Non"
                        disabled={record.role === "admin"}
                      >
                        <Button icon={<DeleteOutlined />} danger disabled={record.role === "admin"} />
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </div>

          {/* Modal modification utilisateur */}
          <Modal
            title="Modifier l'utilisateur"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={() => form.submit()}
          >
            <Form form={form} onFinish={handleUpdateRole}>
              <Form.Item name="name" label="Nom" rules={[{ required: true, message: "Veuillez entrer un nom" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: "Veuillez entrer un email" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Rôle" rules={[{ required: true, message: "Veuillez sélectionner un rôle" }]}>
                <Select>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="user">Utilisateur</Select.Option>
                  <Select.Option value="employee">Employé</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal attribution d'intervention */}
          <Modal
            title="Attribuer une intervention"
            visible={assigningInterventionId !== null}
            onCancel={() => setAssigningInterventionId(null)}
            onOk={() => assignIntervention(assigningInterventionId, selectedUser)}
            okText="Attribuer"
          >
            <Select
              placeholder="Sélectionnez un employé"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedUser(value)}
            >
              {users
                .filter((user) => user.role === "employee")
                .map((employee) => (
                  <Select.Option key={employee.id} value={employee.id}>
                    {employee.name}
                  </Select.Option>
                ))}
            </Select>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
