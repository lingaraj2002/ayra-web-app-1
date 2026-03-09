import { useState } from "react";
import "./ProductForm.scss";
import { createProductApi } from "../../../services/api";

const initialState = {
  productId: "",
  name: "",
  description: "",
  category: "",
  isAvailable: true,
};

export default function ProductForm(props) {
  const { setIsAlertOpen } = props;
  // ===== FORM STATE =====
  const [form, setForm] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  // ✅ VARIANTS STATE
  const [variants, setVariants] = useState([
    { price: "", discountPrice: "", netWeight: "" },
  ]);

  const MAX_IMAGES = 5;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ===== VARIANTS HANDLERS =====

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { price: "", discountPrice: "", netWeight: "" }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ===== IMAGE HANDLERS =====

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024,
    );

    setImages((prev) => {
      const merged = [...prev, ...validFiles];
      return merged.slice(0, MAX_IMAGES);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== SUBMIT =====

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      setIsAlertOpen({
        open: true,
        title: "Oops!",
        message: "Thumbnail is required",
      });
      return;
    }

    // Basic validation
    const invalid = variants.some((v) => !v.price || !v.netWeight);

    if (invalid) {
      setIsAlertOpen({
        open: true,
        title: "Oops!",
        message: "Price and NetWeight are required for all variants",
      });
      return;
    }

    const formData = new FormData();

    formData.append("productId", form.productId);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("isAvailable", form.isAvailable);

    // ✅ MAIN PART – SEND VARIANTS
    formData.append("variants", JSON.stringify(variants));

    // files
    formData.append("thumbnail", thumbnail);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await createProductApi(formData);
      setIsAlertOpen({
        open: true,
        title: "Wow!",
        message: res.data.message || "Product created successfully",
      });
      console.log(res.data);

      setForm(initialState);
      setVariants([{ price: "", discountPrice: "", netWeight: "" }]);
      setThumbnail(null);
      setImages([]);
    } catch (err) {
      console.error(err);
      setIsAlertOpen({
        open: true,
        title: "Oops!",
        message: err?.response?.data?.message || "Upload failed",
      });
    }
  };

  return (
    <form className="product-form-cntnr" onSubmit={handleSubmit}>
      <div className="product-form-input product-form-name">
        <label>Product Name</label>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="product-form-input product-form-description">
        <label>Product Description</label>
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="product-form-input product-form-category">
        <label>Category</label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="masala">Masala</option>
          <option value="mix">Mix</option>
          <option value="malt">Malt</option>
        </select>
      </div>
      {/* ===== VARIANTS UI ===== */}
      <div className="variant-box">
        {variants.map((variant, index) => (
          <div key={index} className="product-form-variants">
            <label>Variant {index + 1}</label>
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Discount Price"
              value={variant.discountPrice}
              onChange={(e) =>
                handleVariantChange(index, "discountPrice", e.target.value)
              }
            />

            <input
              placeholder="Net Weight (e.g 100g)"
              value={variant.netWeight}
              onChange={(e) =>
                handleVariantChange(index, "netWeight", e.target.value)
              }
              required
            />

            {variants.length > 1 && (
              <button
                className="product-form-btn"
                type="button"
                onClick={() => removeVariant(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button className="product-form-btn" type="button" onClick={addVariant}>
          + Add Variant
        </button>
      </div>
      {/* ===== FILES ===== */}
      <div className="product-form-input product-form-thumbnail">
        <label>Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          required
        />
      </div>
      <div className="product-form-input product-form-images">
        <label>Images (Max 5)</label>
        <input type="file" multiple accept="image/*" onChange={handleImages} />

        <div className="preview-cntnr">
          {images.map((img, i) => (
            <div key={i} className="preview-item">
              <img src={URL.createObjectURL(img)} width="70" alt="" />
              <button type="button" onClick={() => removeImage(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="product-form-check-box product-form-is-available">
        <label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>
      </div>
      <button className="product-form-submit-btn" type="submit">
        Save Product
      </button>
    </form>
  );
}
