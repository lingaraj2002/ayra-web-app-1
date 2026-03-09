import "./ProductCard.scss";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../services/api";

export default function ProductCard({ product }) {
  return (
    <div className="card" key={product.productId}>
      <div className="card-thumbnail">
        <img src={`${BASE_URL}${product.thumbnail}`} alt={product.name} />
      </div>
      <div className="card-details">
        <h4>{product.name}</h4>
        <p>
          Starting at <span>₹ {product.variants[0].discountPrice}</span>
        </p>
        <Link to={`/details/${product.productId}`}>
          <button>Details</button>
        </Link>
      </div>
    </div>
  );
}
