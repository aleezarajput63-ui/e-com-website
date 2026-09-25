import { Supabase } from '../../lib/ConnectSb';
import React, { useState, useEffect } from 'react'

function Product() {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [descrip, setdescrip] = useState("");
  const [image, setimage] = useState("");
  const [showform, setshowform] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [sbdata, setsbdata] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categors, setcategors] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await Supabase.from("products").select("*, categories(categoryName)");
      const { data: fetchcat, error: caterror } = await Supabase.from("categories").select("*");
      if (caterror) {
        console.log(caterror);
      } else {
        console.log(fetchcat);
        setCategoriesList(fetchcat);
      }

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setProductsList(data)
      }
    };
    fetchData();
  }, [sbdata])

  const resetForm = () => {
    setname("");
    setprice("");
    setdescrip("");
    setcategors("");
    setimage("");
    setSelectedProduct(null);
    setshowform(false);
  };

  const form = () => {
    setshowform(true);
  }

  const cancelform = () => {
    resetForm();
  }

  const Userproduct = async (e) => {
    e.preventDefault();
    if (!image) return;

    const uniqueName = `${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await Supabase.storage
      .from("product-images")
      .upload(`products/${uniqueName}`, image)

    if (uploadError) {
      console.log("Upload fail", uploadError);
    } else {
      console.log("Upload success...");

      const { data: urlData } = Supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);

      const { data, error } = await Supabase.from("products").insert({
        productName: name,
        productPrice: Number(price),
        description: descrip,
        category_id: categors,
        image: urlData.publicUrl
      });
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setsbdata(Date.now());
        resetForm();
      }
    }
  }

  const updateProduct = async (productObj) => {
    if (!showform || selectedProduct?.id !== productObj.id) {
      setSelectedProduct(productObj);
      setname(productObj.productName || productObj.productname || "");
      setprice(productObj.productPrice || productObj.productprice || "");
      setdescrip(productObj.description || "");
      setcategors(productObj.category_id || "");
      setshowform(true);
      return;
    }

    const { data, error } = await Supabase.from("products").update({
      productName: name,
      productPrice: Number(price),
      description: descrip,
      category_id: categors,
    }).eq("id", productObj.id)

    if (error) {
      console.log(error);
    } else {
      console.log("update successfully!");
      setsbdata(Date.now());
      resetForm();
    }
  }

  const deleteProduct = async (id) => {
    const { error } = await Supabase.from("products").delete()
      .eq("id", id)

    if (error) {
      console.log(error);
    } else {
      console.log("Delete successfully!");
      setsbdata(Date.now());
    }
  }

  return (
    <div className="product-page">

      <div className="product-top">

        <div>
          <h1>Products</h1>
          <p>Manage your products</p>
        </div>

        <button className="add-btn" onClick={() => { form() }}>
          + Add Product
        </button>

      </div>


      {/* FORM UPPER SIDE */}
      {showform === true ?

        <form className="product-form">

          <div className="form-top">
            <div>
              <h2>
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p>
                {selectedProduct
                  ? "Update product information"
                  : "Add a new product to your store"}
              </p>
            </div>

            <button
              type="button"
              className="close-btn"
              onClick={() => { cancelform() }}
            >
              ×
            </button>
          </div>


          <div className="form-grid">

            <div className="field">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                placeholder="Enter product name"
                onChange={(e) => { setname(e.target.value) }}
              />
            </div>


            <div className="field">
              <label>Price</label>
              <input
                value={price}
                type="number"
                placeholder="Enter price"
                onChange={(e) => { setprice(e.target.value) }}
              />
            </div>


            <div className="field">
              <label>Category</label>

              <select
                value={categors}
                onChange={(e) => setcategors(e.target.value)}
              >
                <option value="">Select Category</option>

                {categoriesList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Product Image</label>

              <input
                type="file"
                key={image ? image.name : "empty-file"}
                accept="image/*"
                onChange={(e) => {
                  setimage(e.target.files[0])
                }}
              />
            </div>


            <div className="field full">
              <label>Description</label>

              <textarea
                value={descrip}
                placeholder="Enter product description"
                onChange={(e) => { setdescrip(e.target.value) }}
              ></textarea>
            </div>

          </div>


          <div className="form-buttons">

            {!selectedProduct && (
              <button
                type="button"
                className="save-btn"
                onClick={(e) => { Userproduct(e) }}
              >
                Add Product
              </button>
            )}

            {selectedProduct && (
              <button
                type="button"
                className="save-btn"
                onClick={() => { updateProduct(selectedProduct) }}
              >
                Save Changes
              </button>
            )}

            <button
              type="button"
              className="cancel-btn"
              onClick={() => { cancelform() }}
            >
              Cancel
            </button>

          </div>

        </form>

        : null}


      {/* PRODUCTS TABLE */}
      <div className="products-card">

        <div className="table-title">
          <div>
            <h2>All Products</h2>
            <p>Your product list</p>
          </div>

          <span className="product-count">
            {productsList.length} Products
          </span>
        </div>


        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {
                productsList && productsList.map((product, index) => (

                  <tr key={product.id || index}>

                    <td>
                      <img
                        src={product.image}
                        alt="product"
                        className="product-image"
                      />
                    </td>


                    <td>
                      <div className="product-name">
                        {product.productName ||
                          product.productname ||
                          "Khali"}
                      </div>
                    </td>


                    <td>
                      <span className="price">
                        Rs. {product.productPrice ||
                          product.productprice ||
                          "0"}
                      </span>
                    </td>


                    <td>
                      <div className="description">
                        {product.description || "Khali"}
                      </div>
                    </td>


                    <td>
                      <span className="category">
                        {product.categories?.categoryName || "Khali"}
                      </span>
                    </td>


                    <td>

                      <div className="actions">

                        <button
                          onClick={() => { updateProduct(product) }}
                          className="update-btn"
                        >
                          {selectedProduct?.id === product.id
                            ? "Save"
                            : "Update"}
                        </button>


                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              }

            </tbody>

          </table>

        </div>

      </div>


      <style>{`

        .product-page {
          min-height: 100vh;
          background: #fff8f2;
          padding: 30px;
          font-family: Arial, sans-serif;
          color: #222;
        }

        .product-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .product-top h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 700;
        }

        .product-top p {
          margin: 7px 0 0;
          color: #888;
          font-size: 14px;
        }

        .add-btn {
          border: none;
          background: #f97316;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .add-btn:hover {
          background: #ea580c;
        }


        /* FORM */

        .product-form {
          background: white;
          border: 1px solid #ffe0cc;
          border-radius: 14px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .form-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .form-top h2 {
          margin: 0;
          font-size: 21px;
        }

        .form-top p {
          margin: 5px 0 0;
          color: #999;
          font-size: 13px;
        }

        .close-btn {
          border: none;
          background: #fff1e8;
          color: #f97316;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 22px;
          cursor: pointer;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #444;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 2px #fff1e8;
        }

        .field textarea {
          min-height: 90px;
          resize: vertical;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .save-btn {
          border: none;
          background: #f97316;
          color: white;
          padding: 11px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .save-btn:hover {
          background: #ea580c;
        }

        .cancel-btn {
          border: none;
          background: #f1f1f1;
          color: #555;
          padding: 11px 20px;
          border-radius: 8px;
          cursor: pointer;
        }


        /* TABLE */

        .products-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #eee;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.04);
        }

        .table-title {
          padding: 20px 23px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }

        .table-title h2 {
          margin: 0;
          font-size: 20px;
        }

        .table-title p {
          margin: 5px 0 0;
          color: #999;
          font-size: 13px;
        }

        .product-count {
          background: #fff1e8;
          color: #ea580c;
          padding: 7px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        th {
          background: #fffaf7;
          color: #777;
          text-align: left;
          padding: 15px 18px;
          font-size: 13px;
          font-weight: 600;
        }

        td {
          padding: 15px 18px;
          border-top: 1px solid #f1f1f1;
          vertical-align: middle;
        }

        .product-image {
          width: 55px;
          height: 55px;
          object-fit: cover;
          border-radius: 9px;
          border: 1px solid #eee;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          min-width: 120px;
        }

        .price {
          color: #f97316;
          font-weight: 700;
          white-space: nowrap;
        }

        .description {
          color: #777;
          font-size: 13px;
          max-width: 230px;
        }

        .category {
          background: #fff1e8;
          color: #ea580c;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          gap: 7px;
        }

        .update-btn,
        .delete-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .update-btn {
          background: #fff1e8;
          color: #ea580c;
        }

        .delete-btn {
          background: #fff0f0;
          color: #dc2626;
        }

        .update-btn:hover {
          background: #f97316;
          color: white;
        }

        .delete-btn:hover {
          background: #dc2626;
          color: white;
        }


        /* RESPONSIVE */

        @media (max-width: 700px) {

          .product-page {
            padding: 18px;
          }

          .product-top {
            align-items: flex-start;
            gap: 15px;
          }

          .product-top h1 {
            font-size: 24px;
          }

          .add-btn {
            padding: 10px 14px;
          }

          .product-form {
            padding: 18px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .table-title {
            padding: 17px;
          }

        }

        @media (max-width: 450px) {

          .product-top {
            flex-direction: column;
          }

          .add-btn {
            width: 100%;
          }

          .form-buttons {
            flex-direction: column;
          }

          .save-btn,
          .cancel-btn {
            width: 100%;
          }

        }

      `}</style>

    </div>
  )
}

export default Product