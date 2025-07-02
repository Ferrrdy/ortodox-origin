import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Daftar Baju</h1>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-2 p-3 bg-white rounded shadow"
          >
            <div>
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-green-600 font-semibold">Rp{product.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
