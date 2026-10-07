import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import MenuList from "../components/MenuList";

function MenuPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const { data: dishes, isLoading, error } = useFetch("/menu.json");

  const filtered = dishes
    ? dishes.filter((d) => d.name.toLowerCase().includes(debounced.toLowerCase()))
    : [];

  if (isLoading) return <p>Loading menu...</p>;      // 1. Loading state
  if (error) return <p>Could not load menu: {error}</p>; // 2. Error state

  // 3. Success state
  return (
    <div>
      <h2>CampusEats Menu</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dishes..."
        style={{ padding: '8px', width: '100%', marginBottom: '20px' }}
      />
      <MenuList dishes={filtered} />
    </div>
  );
}
export default MenuPage;