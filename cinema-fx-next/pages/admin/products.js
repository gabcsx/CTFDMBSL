// pages/admin/products.js
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import ProductList from "../../components/ProductList";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import styles from "../../styles/ViewUsers.module.css";

// ---  Official, singular, standardized categories ---
const categoryOptions = [
  "Soap",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Cleanser",
  "Whitening",
  "Hair Care",
  "Deodorant",
  "Other...",
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    featured: false,
    stock: "",
    price: "",
    image: null,
  });

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    payload: null,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/product-manager")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  const handleDelete = (id) => {
    setConfirmModal({
      open: true,
      action: "delete",
      payload: id,
    });
  };

  const handleEdit = (updatedProduct) => {
    setConfirmModal({
      open: true,
      action: "edit",
      payload: updatedProduct,
    });
  };

  const handleConfirmModal = async () => {
    if (confirmModal.action === "delete") {
      const id = confirmModal.payload;
      setConfirmModal({ open: false, action: null, payload: null });

      try {
        const res = await fetch("/api/product-manager", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          console.error("Failed to delete product");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    } else if (confirmModal.action === "edit") {
      const updatedProduct = confirmModal.payload;
      setConfirmModal({ open: false, action: null, payload: null });

      try {
        const res = await fetch("/api/product-manager", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        });

        if (res.ok) {
          const savedProduct = await res.json();
          setProducts((prev) =>
            prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
          );
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          console.error("Failed to update product");
        }
      } catch (err) {
        console.error("Edit error:", err);
      }
    }
  };

  const handleAddProduct = async () => {
    // Convert stock and price to numbers or 0 if empty
    const productToSend = {
      ...newProduct,
      stock: Number(newProduct.stock) || 0,
      price: Number(newProduct.price) || 0,
    };

    const formData = new FormData();
    for (let key in productToSend) {
      formData.append(key, productToSend[key]);
    }

    try {
      const res = await fetch("/api/product-manager", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const addedProduct = await res.json();
        setProducts((prev) => [...prev, addedProduct]);
        setShowAddModal(false);
        setNewProduct({
          name: "",
          description: "",
          category: "",
          featured: false,
          stock: "",
          price: "",
          image: null,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error("Failed to add product");
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const showCustomCategoryInput = newProduct.category === "";

  let confirmMessage = "";
  if (confirmModal.action === "delete") {
    confirmMessage = "Are you sure you want to delete this product?";
  } else if (confirmModal.action === "edit") {
    confirmMessage = "Are you sure you want to save these changes?";
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "#e75480",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: 5,
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          + Add Product
        </button>
      </div>

      <ProductList
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>Add Product</div>
            <form
              className={styles.modalForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProduct();
              }}
            >
              <div className={styles.formGroup}>
                <label>Product Name:</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  className={styles.modalInput}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  rows={6}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category:</label>
                <select
                  className={styles.modalInput}
                  value={
                    // If not in options, default to "Other..."
                    categoryOptions.includes(newProduct.category)
                      ? newProduct.category
                      : "Other..."
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewProduct({
                      ...newProduct,
                      category: val === "Other..." ? "" : val,
                    });
                  }}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {/* Show input if "Other..." is selected */}
                {showCustomCategoryInput && (
                  <input
                    type="text"
                    className={styles.modalInput}
                    placeholder="Enter custom category"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    style={{ marginTop: 8 }}
                    required
                  />
                )}
              </div>

              <div
                className={styles.formGroup}
                style={{ justifyContent: "flex-start" }}
              >
                <label
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        featured: e.target.checked,
                      })
                    }
                  />
                  Featured
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Stock:</label>
                <input
                  type="number"
                  className={styles.modalInput}
                  value={newProduct.stock}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (/^\d+$/.test(val) && Number(val) >= 0)) {
                      setNewProduct({ ...newProduct, stock: val });
                    }
                  }}
                  min={0}
                  required
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Price (₱):</label>
                <input
                  type="number"
                  className={styles.modalInput}
                  value={newProduct.price}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (
                      val === "" ||
                      (/^\d*\.?\d*$/.test(val) && Number(val) >= 0)
                    ) {
                      setNewProduct({ ...newProduct, price: val });
                    }
                  }}
                  min={0}
                  step="0.01"
                  required
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                  }}
                  inputMode="decimal"
                  autoComplete="off"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Image:</label>
                <input
                  type="file"
                  className={styles.modalInput}
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.okBtn}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmModal.open}
        message={confirmMessage}
        onCancel={() =>
          setConfirmModal({ open: false, action: null, payload: null })
        }
        onConfirm={handleConfirmModal}
      />

      <Toast
  show={showSuccess}
  message="Successfully saved!"
  onClose={() => setShowSuccess(false)}
  type="success"
/>

    </AdminLayout>
  );
}
