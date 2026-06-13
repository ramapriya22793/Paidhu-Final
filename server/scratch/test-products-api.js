async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Total products from API:", data.total);
    console.log("Sample products:", data.products?.map(p => ({ id: p.id, name: p.name, category: p.category })));
  } catch (error) {
    console.error("API Fetch Error:", error);
  }
}
test();
