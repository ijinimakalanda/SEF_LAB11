import { useState } from "react";

function OrderPage() {
  const [form, setForm] = useState({ name: "", email: "", qty: 1 });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function validate(v) {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Name too short";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = "Enter a valid email";
    if (Number(v.qty) < 1) e.qty = "Qty must be ≥ 1";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
  }

  if (done) return <p>Thanks, {form.name}! Order received.</p>;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h2>Place Order</h2>
      <div>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
      </div>
      <div>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
      </div>
      <div>
        <input name="qty" type="number" value={form.qty} onChange={handleChange} placeholder="Quantity" />
        {errors.qty && <span style={{ color: 'red', fontSize: '12px' }}>{errors.qty}</span>}
      </div>
      <button type="submit">Place order</button>
    </form>
  );
}
export default OrderPage;