import { Supabase } from '../../lib/ConnectSb';
import React, { useEffect, useState } from 'react'

function Categories() {
  const [catname, setcatname] = useState("");
  const [descrip, setdescrip] = useState("");
  const [showform, setshowform] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [id, setid] = useState("");
  const [update, setupdate] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await Supabase.from("categories").select("*");

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setCategoriesList(data);
      }
    }

    fetch();
  }, [refresh])


  const openform = () => {
    setshowform(true)
  }


  const cancelform = () => {
    setshowform(false)
  }


  //insert query
  const addCategory = async () => {
    const { data, error } = await Supabase.from("categories").insert([
      {
        categoryName: catname,
        description: descrip,
      }
    ]).select();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setcatname("");
      setdescrip("");
      setRefresh(!refresh);
    }
  };


  //edit function
  const edit = (id, categoryName, description) => {
    setcatname(categoryName);
    setdescrip(description);
    setshowform(true);
    setid(id)
    setupdate(true);
  }


  //update query
  const upd = async (e) => {
    e.preventDefault();

    const { data, error } = await Supabase.from("categories").update({
      categoryName: catname,
      description: descrip,
    }).eq("id", id);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      cancelform();
      setRefresh(!refresh);
    }
  }


  //del query
  const del = async (id) => {
    const { data, error } = await Supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setRefresh(!refresh);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store categories
          </p>
        </div>

        <button
          onClick={() => { openform() }}
          className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:w-auto"
        >
          + Add Category
        </button>

      </div>


      {/* Form */}
      {
        showform === true ?
          <form className="mb-8 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              {update === true ? "Edit Category" : "Add New Category"}
            </h2>


            <div className="grid gap-4 sm:grid-cols-2">

              <input
                type="text"
                placeholder="Enter category name.."
                value={catname}
                onChange={(e) => {
                  setcatname(e.target.value)
                }}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />


              <input
                type="text"
                placeholder="Enter description.."
                value={descrip}
                onChange={(e) => {
                  setdescrip(e.target.value)
                }}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>


            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              {
                update === true
                  ?
                  <>
                    <button
                      type="submit"
                      onClick={(e) => {
                        upd(e)
                      }}
                      className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        cancelform()
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                  :
                  <>
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        addCategory()
                      }}
                      className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Add
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        cancelform()
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
              }

            </div>

          </form>
          :
          <></>
      }


      {/* Categories List */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {
          categoriesList.map((items) => {
            return (
              <div
                key={items.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                    🗂️
                  </div>

                </div>


                <h2 className="text-xl font-bold text-gray-800">
                  {items.categoryName}
                </h2>


                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                  {items.description}
                </p>


                {/* Action Buttons */}
                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">

                  <button
                    onClick={() => {
                      edit(
                        items.id,
                        items.categoryName,
                        items.description
                      )
                    }}
                    className="flex-1 rounded-lg bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => {
                      del(items.id)
                    }}
                    className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>

                </div>

              </div>
            )
          })
        }

      </div>

    </div>
  )
}

export default Categories