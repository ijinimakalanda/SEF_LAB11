function DishCard({ dish }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', borderRadius: '8px' }}>
      <h3>{dish.name}</h3>
      <p>Rs. {dish.price.toFixed(2)}</p>
      <small>{dish.category}</small>
      {!dish.available && <span style={{ color: 'red' }}> — Sold out</span>}
    </div>
  );
}
export default DishCard;