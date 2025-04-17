import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // pour modifier le rôle d'un utilisateur
  const [assigningInterventionId, setAssigningInterventionId] = useState(null); // intervention en cours d'assignation
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterventions();
    fetchUsers();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/interventions");
      setInterventions(response.data);
      setFilteredInterventions(response.data); // Initialement, toutes les interventions sont filtrées
      console.log("Interventions:", response.data); // Pour déboguer les données des interventions
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des interventions.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialement, tous les utilisateurs sont filtrés
      console.log("Utilisateurs:", response.data); // Pour déboguer les utilisateurs
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des utilisateurs.");
    }
  };

  // Fonction pour assigner un employé à l'intervention (opération inline)
  const assignIntervention = async (interventionId, employeeId) => {
    if (!employeeId) {
      message.error("Veuillez sélectionner un employé.");
      return;
    }

    console.log("Attribuer l'intervention...", interventionId, employeeId);

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/interventions/${interventionId}`, {
        employee_id: employeeId,
      });
      console.log("Réponse de l'API:", response); // Pour déboguer l'API
      if (response.status === 200) {
        message.success("Intervention attribuée avec succès.");
        setAssigningInterventionId(null); // Réinitialiser l'assignation après le succès
        fetchInterventions(); // Recharger les interventions après mise à jour
      } else {
        message.error("Erreur lors de l'attribution de l'intervention.");
      }
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'attribution de l'intervention.");
    }
  };

  const editUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user.role === "admin") {
      message.error("Impossible de modifier un utilisateur ayant le rôle 'admin'.");
      return;
    }
    setSelectedUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const deleteUser = async (userId, role) => {
    if (role === "admin") {
      message.error("Impossible de supprimer un utilisateur ayant le rôle 'admin'.");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
      message.success("Utilisateur supprimé avec succès.");
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  const handleUpdateRole = async (values) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${selectedUser.id}`, {
        role: values.role,
      });
      message.success("Rôle mis à jour avec succès.");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la mise à jour du rôle.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fonction de filtrage des utilisateurs
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

  // Fonction de filtrage des interventions
  const handleInterventionSearch = (e) => {
    const value = e.target.value;
    const filtered = interventions.filter(
      (intervention) =>
        users.find(user => user.id === intervention.client_id)?.name.toLowerCase().includes(value.toLowerCase()) ||
        intervention.location.toLowerCase().includes(value.toLowerCase()) ||
        intervention.priority.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInterventions(filtered);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          type="primary"
          danger
          style={styles.logoutButton}
        >
          Se déconnecter
        </Button>
      </div>

      <h1 style={styles.pageTitle}>Bienvenue Admin</h1>

      {/* Barre de recherche pour les interventions */}
      <h2 style={styles.sectionTitle}>Gestion des interventions</h2>
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
              const client = users.find(user => user.id === clientId);
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
            render: (_, record) => {
              if (assigningInterventionId === record.id) {
                return (
                  <>
                    <Select
                      placeholder="Sélectionner un employé"
                      style={{ width: 200 }}
                      onChange={(employeeId) => {
                        assignIntervention(record.id, employeeId); // Attribuer l'employé directement
                      }}
                    >
                      {users
                        .filter(user => user.role === "employee")
                        .map(user => (
                          <Select.Option key={user.id} value={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                    </Select>
                    <Button
                      type="default"
                      onClick={() => setAssigningInterventionId(null)}
                      style={{ marginLeft: 8 }}
                    >
                      Annuler
                    </Button>
                  </>
                );
              }
              return (
                <Button
                  onClick={() => setAssigningInterventionId(record.id)} // Montre la sélection
                  disabled={record.status !== "pending"} // Se désactive si l'intervention n'est pas "pending"
                  style={styles.assignButton}
                >
                  Attribuer
                </Button>
              );
            },
          },
        ]}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        style={styles.table}
      />

      {/* Barre de recherche pour les utilisateurs */}
      <h2 style={styles.sectionTitle}>Gestion des utilisateurs</h2>
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
                  style={styles.editButton}
                  disabled={record.role === "admin"}
                />
                <Popconfirm
                  title={`Êtes-vous sûr de vouloir supprimer cet utilisateur${record.role === "admin" ? " (admin)" : ""} ?`}
                  onConfirm={() => deleteUser(record.id, record.role)}
                  okText="Oui"
                  cancelText="Non"
                  disabled={record.role === "admin"}
                >
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    style={styles.deleteButton}
                    disabled={record.role === "admin"}
                  />
                </Popconfirm>
              </div>
            ),
          },
        ]}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        style={styles.table}
      />

      {/* Modal pour modifier le rôle d'un utilisateur */}
      <Modal
        title="Modifier le rôle d'un utilisateur"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={styles.modal}
      >
        <Form form={form} onFinish={handleUpdateRole}>
          <Form.Item name="name" label="Nom" rules={[{ required: true, message: "Veuillez entrer le nom" }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Veuillez entrer l'email" }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="role" label="Rôle" rules={[{ required: true, message: "Veuillez sélectionner un rôle" }]}>
            <Select placeholder="Sélectionner un rôle" disabled={selectedUser?.role === "admin"}>
              <Select.Option value="employee">Employé</Select.Option>
              <Select.Option value="client">Client</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" disabled={selectedUser?.role === "admin"} style={styles.submitButton}>
            Modifier
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  },
  header: {
    textAlign: "right",
    marginBottom: "20px",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4d4d4d",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
  },
  table: {
    marginBottom: "20px",
  },
  assignButton: {
    backgroundColor: "#1890ff",
    color: "#fff",
  },
  editButton: {
    marginRight: "10px",
  },
  deleteButton: {
    marginLeft: "10px",
  },
  logoutButton: {
    position: "absolute",
    top: "20px",
    left: "1100px",
  },
  modal: {
    top: 20,
  },
  submitButton: {
    marginTop: "10px",
  },
};

export default AdminPage;
