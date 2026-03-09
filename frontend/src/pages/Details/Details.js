import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Details.scss";
import { getProductById } from "../../services/api";
import { BASE_URL } from "../../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then((res) => setProduct(res.data.data));
  }, [id]);

  if (!product) return <p>Product not found</p>;

  return (
    <section className="detail">
      {/* Image */}
      <div className="detail-image">
        <img src={`${BASE_URL}${product.thumbnail}`} alt={product.name} />
      </div>

      {/* Info */}
      <div className="detail-info">
        <h1>{product.name}</h1>
        {/* <p className="price">₹{product.variants[0].discountPrice}</p> */}
        <p className="desc">{product.description}</p>

        <div className="actions">
          <button className="add">Email</button>
          <button className="buy">Whatsapp</button>
          <button className="buy">Phone</button>
        </div>
      </div>
    </section>
  );
}
