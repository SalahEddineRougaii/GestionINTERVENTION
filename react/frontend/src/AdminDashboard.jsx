import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Statistic, Row, Col, message } from "antd";
import {
  UserOutlined,
  FileDoneOutlined,
  BellOutlined,
} from "@ant-design/icons";

const AdminDashboard = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    employees: 0,
    interventions: 0,
    notifications: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      message.error("Accès refusé !");
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/admin/stats", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStats(response.data);
      } catch (error) {
        message.error("Erreur lors du chargement des statistiques.");
      }
    };

    fetchStats();
  }, [user, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Administrateur</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Employés"
              value={stats.employees}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Interventions"
              value={stats.interventions}
              prefix={<FileDoneOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Notifications"
              value={stats.notifications}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;