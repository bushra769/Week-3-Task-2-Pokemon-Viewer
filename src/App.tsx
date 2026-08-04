import { useState } from "react";
import "./App.css";

type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
};

function App() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPokemon = async () => {
    if (!search.trim()) return;

    setLoading(true);
    setError("");
    setPokemon(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Pokemon not found");
      }

      const data = await response.json();
      setPokemon(data);
    } catch {
      setError("Pokémon not found!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Pokémon Viewer</h1>
        <p className="subtitle">
          Search any Pokémon and view its details.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Pokémon name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPokemon()}
          />

          <button onClick={fetchPokemon}>Search</button>
        </div>
                {loading && <p className="loading">Loading Pokémon...</p>}

        {error && <p className="error">{error}</p>}

        {pokemon && (
          <div className="pokemon-card">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pokemon-image"
            />

            <h2>
              {pokemon.name.charAt(0).toUpperCase() +
                pokemon.name.slice(1)}
            </h2>

            <div className="details">
              <p>
                <strong>Type:</strong>{" "}
                {pokemon.types.map((item) => item.type.name).join(", ")}
              </p>

              <p>
                <strong>Height:</strong> {pokemon.height}
              </p>

              <p>
                <strong>Weight:</strong> {pokemon.weight}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;