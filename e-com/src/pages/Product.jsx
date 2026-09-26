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
      const { data, error } = await Supabase
        .from("products")
        .select("*, categories(categoryName)");

      const { data: fetchcat, error: caterror } =
        await Supabase.from("categories").select("*");

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

    const { data: uploadData, error: uploadError } =
      await Supabase.storage
        .from("product-images")
        .upload(`products/${uniqueName}`, image)

    if (uploadError) {
      console.log("Upload fail", uploadError);
    } else {
      console.log("Upload success...");

      const { data: urlData } = Supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);

      const { data, error } = await Supabase
        .from("products")
        .insert({
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

    const { data, error } = await Supabase
      .from("products")
      .update({
        productName: name,
        productPrice: Number(price),
        description: descrip,
        category_id: categors,
      })
      .eq("id", productObj.id)

    if (error) {
      console.log(error);
    } else {
      console.log("update successfully!");
      setsbdata(Date.now());
      resetForm();
    }
  }


  const deleteProduct = async (id) => {

    const { error } = await Supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.log(error);
    } else {
      console.log("Delete successfully!");
      setsbdata(Date.now());
    }
  }


  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-orange-50 p-3 sm:p-5 md:p-6">

      {/* TOP */}
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Manage your products
          </p>
        </div>

        <button
          className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          onClick={() => { form() }}
        >
          + Add Product
        </button>

      </div>


      {/* FORM */}
      {showform === true && (

        <form className="mb-5 w-full rounded-xl border border-orange-100 bg-white p-4 shadow-sm sm:p-5 md:p-6">

          {/* Form Header */}
          <div className="mb-5 flex items-start justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                {selectedProduct
                  ? "Update product information"
                  : "Add a new product to your store"}
              </p>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl text-orange-500 transition hover:bg-orange-100"
              onClick={() => { cancelform() }}
            >
              ×
            </button>

          </div>


          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Product Name */}
            <div className="flex min-w-0 flex-col gap-2">

              <label className="text-sm font-semibold text-gray-600">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                placeholder="Enter product name"
                onChange={(e) => {
                  setname(e.target.value)
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>


            {/* Price */}
            <div className="flex min-w-0 flex-col gap-2">

              <label className="text-sm font-semibold text-gray-600">
                Price
              </label>

              <input
                value={price}
                type="number"
                placeholder="Enter price"
                onChange={(e) => {
                  setprice(e.target.value)
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>


            {/* Category */}
            <div className="flex min-w-0 flex-col gap-2">

              <label className="text-sm font-semibold text-gray-600">
                Category
              </label>

              <select
                value={categors}
                onChange={(e) => setcategors(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >

                <option value="">
                  Select Category
                </option>

                {categoriesList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                ))}

              </select>

            </div>


            {/* Image */}
            <div className="flex min-w-0 flex-col gap-2">

              <label className="text-sm font-semibold text-gray-600">
                Product Image
              </label>

              <input
                type="file"
                key={image ? image.name : "empty-file"}
                accept="image/*"
                onChange={(e) => {
                  setimage(e.target.files[0])
                }}
                className="w-full min-w-0 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-xs outline-none sm:text-sm"
              />

            </div>


            {/* Description */}
            <div className="flex min-w-0 flex-col gap-2 md:col-span-2">

              <label className="text-sm font-semibold text-gray-600">
                Description
              </label>

              <textarea
                value={descrip}
                placeholder="Enter product description"
                onChange={(e) => {
                  setdescrip(e.target.value)
                }}
                className="min-h-[100px] w-full resize-y rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              ></textarea>

            </div>

          </div>


          {/* Buttons */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            {!selectedProduct && (
              <button
                type="button"
                className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
                onClick={(e) => {
                  Userproduct(e)
                }}
              >
                Add Product
              </button>
            )}


            {selectedProduct && (
              <button
                type="button"
                className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
                onClick={() => {
                  updateProduct(selectedProduct)
                }}
              >
                Save Changes
              </button>
            )}


            <button
              type="button"
              className="w-full rounded-lg bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-200 sm:w-auto"
              onClick={() => {
                cancelform()
              }}
            >
              Cancel
            </button>

          </div>

        </form>
      )}


      {/* PRODUCTS CARD */}
      <div className="w-full max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div>
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              All Products
            </h2>

            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Your product list
            </p>
          </div>

          <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            {productsList.length} Products
          </span>

        </div>


        {/* TABLE SCROLL */}
        <div className="w-full max-w-full overflow-x-auto">

          <table className="w-full min-w-[850px] border-collapse">

            <thead>

              <tr className="bg-orange-50">

                <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold text-gray-500">
                  Image
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold text-gray-500">
                  Name
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold text-gray-500">
                  Price
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold text-gray-500">
                  Description
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold text-gray-500">
                  Category
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold text-gray-500">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {
                productsList &&
                productsList.map((product, index) => (

                  <tr
                    key={product.id || index}
                    className="border-t border-gray-100"
                  >

                    {/* Image */}
                    <td className="px-4 py-4">

                      <img
                        src={product.image}
                        alt="product"
                        className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                      />

                    </td>


                    {/* Name */}
                    <td className="px-4 py-4">

                      <div className="min-w-[120px] whitespace-nowrap text-sm font-semibold text-gray-700">
                        {product.productName ||
                          product.productname ||
                          "Khali"}
                      </div>

                    </td>


                    {/* Price */}
                    <td className="px-4 py-4">

                      <span className="whitespace-nowrap font-bold text-orange-500">
                        Rs. {product.productPrice ||
                          product.productprice ||
                          "0"}
                      </span>

                    </td>


                    {/* Description */}
                    <td className="px-4 py-4">

                      <div className="w-[230px] truncate text-sm text-gray-500">
                        {product.description || "Khali"}
                      </div>

                    </td>


                    {/* Category */}
                    <td className="px-4 py-4">

                      <span className="whitespace-nowrap rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                        {product.categories?.categoryName || "Khali"}
                      </span>

                    </td>


                    {/* Actions */}
                    <td className="px-4 py-4">

                      <div className="flex min-w-[135px] gap-2">

                        <button
                          onClick={() => {
                            updateProduct(product)
                          }}
                          className="whitespace-nowrap rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                        >
                          {selectedProduct?.id === product.id
                            ? "Save"
                            : "Update"}
                        </button>


                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="whitespace-nowrap rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
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

    </div>
  )
}

export default Product