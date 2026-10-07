import DishCard from "./DishCard";

function MenuList({ dishes }) {
  if (!dishes || !dishes.length) return <p>No dishes match your search.</p>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
export default MenuList;