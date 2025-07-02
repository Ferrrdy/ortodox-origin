
const ProductCard = ({ product }) => (
  <div className="bg-white border rounded-lg shadow-md p-4 w-64">
    <h3 className="text-lg font-semibold">{product.name}</h3>
    <p className="text-gray-600 text-sm">{product.description}</p>
    <p className="text-green-700 font-bold mt-2">Rp {Number(product.price).toLocaleString('id-ID')}</p>
    <p className="text-gray-600 text-sm">Stok: {product.stock}</p>
    {product.image && (
      <img
        src={`http://127.0.0.1:8000/storage/${product.image}`}
        alt={product.name}
        className="mt-2"
      />
    )}
  </div>
)

export default ProductCard
