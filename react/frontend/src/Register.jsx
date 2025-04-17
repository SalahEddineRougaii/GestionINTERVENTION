import { useState, useEffect } from "react";
import axios from "axios"; // Importation manuelle d'axios
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fonction pour récupérer les catégories depuis l'API
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/categories", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                console.log("Données des catégories:", response.data); // Vérification des données dans la console
                setCategories(response.data); // Sauvegarde des catégories dans l'état
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories", error);
            }
        };

        fetchCategories();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/register", {
                name,
                email,
                password,
                categories: selectedCategories
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            navigate("/admin/employees"); // Redirige après l'inscription réussie
        } catch (error) {
            console.error("Erreur lors de l'inscription", error);
        }
    };

    return (
        <div>
            <h2>Ajouter un Employé</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <label htmlFor="categories">Catégories :</label>
<select id="categories" multiple onChange={(e) => setSelectedCategories([...e.target.selectedOptions].map(o => o.value))}>
    {categories.length > 0 ? (
        categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
        ))
    ) : (
        <option>Aucune catégorie disponible</option>
    )}
</select>

                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}

export default Register;
