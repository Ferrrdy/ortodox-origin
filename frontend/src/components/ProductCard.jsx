
const ProductCard = ({ product }) => (
  <div className="bg-white border rounded-lg shadow-md p-4 w-64">
    <h3 className="text-lg font-semibold">{product.name}</h3>
    <p className="text-gray-600 text-sm">{product.description}</p>
    <p className="text-green-700 font-bold mt-2">Rp {Number(product.price).toLocaleString('id-ID')}</p>
  </div>
)

export default ProductCard
