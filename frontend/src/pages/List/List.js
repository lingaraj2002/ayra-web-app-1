import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./List.scss";
import { getProductsApi } from "../../services/api";

export default function List() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(500);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    getProductsApi({
      category: "",
      minPrice: null,
    })
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="list-page">
      {/* Filters */}
      <aside className="filters">
        <h3>Filters</h3>

        <input
          type="text"
          placeholder="Search"
          // value={search}
          // onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="masala">Masala</option>
          <option value="mix">Mix</option>
          <option value="malt">Malt</option>
        </select>

        <label>
          Max Price: ₹{price}
          <input
            type="range"
            min="50"
            max="500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
      </aside>

      {/* Product Grid */}
      <section className="products">
        {search && (
          <div className="search-info">
            Showing results for: <strong>"{search}"</strong>
          </div>
        )}
        {category && (
          <div className="category-info">
            Category: <strong>{category}</strong>
          </div>
        )}
        {products.length ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </section>
    </div>
  );
}
