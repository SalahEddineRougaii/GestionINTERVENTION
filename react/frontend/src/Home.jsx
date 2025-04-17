import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Accueil</h2>
            <button onClick={() => navigate("/login")}>Se connecter</button>
        </div>
    );
}

export default Home;
