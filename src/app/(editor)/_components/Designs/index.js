"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./styles.module.css";
import { v4 as uuidv4 } from "uuid";
import { useStoreItems } from "@/app/_store";
import { AiFillFilter } from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";
import Image from "next/image";
import BasicLoader from "@/app/_components/Loaders/Loader";

async function getAllDesigns(currentPage) {
  try {
    const response = await fetch(`/api/designs/get-all-designs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPage),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { response, data };
    } else {
      alert("Ha ocurrido un error al obtener los diseños.");
      return;
    }
  } catch (error) {
    alert("Ha ocurrido un error al obtener los diseños.");
  }
}

async function getCategoriesDesigns() {
  const response = await fetch("/api/designs/get-designs-categories");
  const data = await response.json();
  return { data };
}

async function searchDesigns(searchValue, e) {
  e.preventDefault();
  const response = await fetch("/api/designs/search-designs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchValue }),
  });

  const data = await response.json();
  return { response, data };
}

export default function Designs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [showAllDesigns, setShowAllDesigns] = useState(true);
  const [minSearchLengthError, setMinSearchLengthError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredPath, setFilteredPath] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);

  const newLayer = useStoreItems((state) => state.setNewLayerItem);
  const newMultipleLayers = useStoreItems(
    (state) => state.setMultipleLayerItems
  );
  const sideIndex = useStoreItems((state) => state.sideIndex);

  useEffect(() => {
    const designsFetcher = async () => {
      try {
        // Fetch data only if it's not already cached

        const { response, data } = await getAllDesigns({
          currentPage,
        });

        if (!response.ok) {
          setError("Hubo un error en el servidor.");
          setLoading(false);
          return;
        }

        if (response.status >= 400) {
          setError("Error interno de la aplicación.");
          setLoading(false);
          return;
        }
        setDesigns(data.designs);
        setTotalDesigns(data.totalDocuments);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    designsFetcher();
  }, [currentPage]); // Fetch data only if the designs array is empty

  useEffect(() => {
    const showCategoriesFunction = async () => {
      if (showCategories) {
        const categories = await getCategoriesDesigns();
        setCategories(categories.data.designsByCategory);
      }
    };

    showCategoriesFunction();
  }, [showCategories]);

  // Function to handle moving to the next page
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Function to handle moving to the previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const newDesignHandler = (url, name, width, height, d) => {
    const inputId = uuidv4();
    console.log(width, height);
    newLayer(sideIndex, {
      id: inputId,
      inputType: "design",
      designUrl: url,
      designName: name,
      width,
      height,
      transform: {
        translate: "translate(0px, 0px)",
        rotate: "rotate(0deg)",
        scale: "scale(1)",
      },
    });
  };

  const newConstructedDesignsHandler = (url, groupedItems) => {
    const itemsWithId = groupedItems.map((element) => {
      const inputId = uuidv4(); // Generate a new id for each object
      return { ...element, id: inputId };
    });
    newMultipleLayers(sideIndex, itemsWithId);
  };

  const handleDesignSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    const searchValue = e.target[0].value;
    if (searchValue.length < 3) {
      setMinSearchLengthError(true);
      return;
    }
    const { response, data } = await searchDesigns(searchValue, e);
    if (!response.ok) {
      setError("Hubo un error en el servidor.");
      setSearchLoading(false);
      return;
    }

    if (response.status >= 400) {
      setError("Error interno de la aplicación.");
      setSearchLoading(false);
      return;
    }
    setDesigns(data); // Use the setDesigns function
    setShowAllDesigns(false);
    minSearchLengthError && setMinSearchLengthError(false);
    setSearchLoading(false);
  };

  const showAllDesignsHandler = async () => {
    if (!showAllDesigns) {
      setShowAllDesigns(true);
      const { response, data } = await getAllDesigns({
        currentPage,
      });

      if (!response.ok) {
        setError("Hubo un error en el servidor.");
        setLoading(false);
        return;
      }

      if (response.status >= 400) {
        setError("Error interno de la aplicación.");
        setLoading(false);
        return;
      }

      setDesigns(data.designs);
      setFilteredPath("");
    }
  };

  async function getDesignsByCategory(designId, keyword) {
    const response = await fetch("/api/designs/get-designs-by-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designId, keyword }),
    });

    if (!response.ok) {
      alert("Ha ocurrido un error al obtener los diseños.");
      return;
    }

    const data = await response.json();
    const { designs, filteredPath } = data;
    setShowAllDesigns(false);
    setDesigns(designs);
    setFilteredPath(filteredPath);
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 1100) {
        setShowCategories(false);
      }
    }
  }

  return (
    <>
      <>
        <div className={styles.categoriesPanel}>
          {showCategories && (
            <div className={styles.categoriesContainer}>
              <div
                style={{
                  margin: "10px",
                  border: "1px solid #9e9e9e",
                  padding: "8px",
                  borderRadius: "4px",
                  color: "#575757",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BiSolidCategory
                  style={{
                    fontSize: "18px",
                    marginRight: "5px",
                    color: "#1483ff",
                  }}
                />
                <span>Diseños por categoria</span>
              </div>
              <div>
                <div
                  style={{
                    border: "1px solid #9e9e9e",
                    height: "100%",
                    overflowY: "auto",
                    margin: "10px",
                    borderRadius: "4px",
                  }}
                >
                  {!loading ? (
                    categories.map((category, index) => (
                      <div
                        style={{
                          margin: "10px",
                        }}
                        key={index}
                      >
                        <details>
                          <summary
                            style={{ cursor: "pointer", color: "#575757" }}
                          >
                            {category.designType}
                          </summary>
                          <div>
                            {category.designs.map((designObject) =>
                              Object.keys(designObject).map((key, index) => (
                                <button
                                  style={{
                                    marginLeft: "15px",
                                    width: "90%",
                                    height: "30px",
                                    border: "none",
                                    outline: "none",
                                    background: "#fff",
                                    border: "1px solid #dedede",
                                    borderRadius: "4px",
                                    marginTop: "5px",
                                    cursor: "pointer",
                                    color: "#575757",
                                  }}
                                  key={index}
                                  onClick={() =>
                                    getDesignsByCategory(category._id, key)
                                  }
                                >
                                  {key}
                                </button>
                              ))
                            )}
                          </div>
                        </details>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        padding: "15px",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                      }}
                    >
                      <>
                        <BasicLoader />
                      </>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ margin: "60px 20px 0px 20px" }}>
          <form
            style={{
              display: "flex",
              margin: "10px 0px 10px 0px",
              width: "100%",
            }}
            onSubmit={handleDesignSearch}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {minSearchLengthError && (
                <span style={{ fontSize: "14px", color: "red" }}>
                  Minimo 3 letras.
                </span>
              )}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <input
                  style={{
                    borderRadius: "4px 0px 0px 4px",
                    outline: minSearchLengthError
                      ? "1px solid red"
                      : "1px solid #1483FF",
                    fontSize: "15px",
                    width: "100%",
                    padding: "4px",
                    border: "none",
                  }}
                  placeholder="Busca todo tipo de diseños..."
                  type="text"
                ></input>
                <input
                  type="submit"
                  value={searchLoading ? "..." : "Buscar"}
                  style={{
                    outline: minSearchLengthError
                      ? "1px solid red"
                      : "1px solid #1483FF",
                    border: "none",
                    fontSize: "17px",
                    padding: "4px",
                    border: "none",
                    borderRadius: "0px 4px 4px 0px",
                    cursor: "pointer",
                    background: minSearchLengthError ? "red" : "#1483FF",
                    width: "80px",
                    color: "#fff",
                  }}
                ></input>
              </div>
            </div>
          </form>

          <div style={{ display: "flex" }}>
            <button
              style={{
                border: "none",
                padding: "8px",
                background: "#facb7f",
                margin: "0px 0px 9px 0px",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                outline: "none",
                color: "#333",
              }}
              onClick={() => setShowCategories(!showCategories)}
            >
              Filtrar por categoria
            </button>
            <button
              style={{
                border: "1px solid #1483FF",
                padding: "8px",
                background: showAllDesigns ? "#1483FF" : "#fff",
                color: showAllDesigns ? "#fff" : "#1483FF",
                margin: "0px 0px 9px 0px",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "10px",
                width: "100%",
              }}
              onClick={showAllDesignsHandler}
            >
              Todos los diseños
            </button>
          </div>
          {error && <p>Ha ocurrido un error obteniendo los datos</p>}
        </div>

        {showAllDesigns === true && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className={styles.pagination}>
              <button
                className={styles.switchBtnOne}
                onClick={previousPage}
                disabled={currentPage === 1}
                style={{
                  background: currentPage === 1 && "rgb(155, 201, 255)",
                }}
              >
                Anterior
              </button>
              <button
                className={styles.switchBtnSecond}
                onClick={nextPage}
                disabled={currentPage * 20 >= totalDesigns}
                style={{
                  background:
                    currentPage * 20 >= totalDesigns && "rgb(155, 201, 255)",
                }}
              >
                Siguiente
              </button>
            </div>
            {totalDesigns > 0 && (
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  color: "#909190",
                  marginBottom: "8px",
                }}
              >
                Diseños totales: {totalDesigns}
              </span>
            )}
          </div>
        )}

        {!loading ? (
          <>
            {filteredPath.length > 0 && (
              <div
                style={{
                  background: "#e8e9eb",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "6px",
                  color: "#8b8b8c",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AiFillFilter />
                  <span>{filteredPath}</span>
                </div>
              </div>
            )}

            <div className={styles.designsContainer}>
              {designs?.length > 0 ? (
                designs.map((design) => (
                  <div
                    key={design._id}
                    className={styles.designItem}
                    onClick={
                      design.groupedItems === undefined
                        ? () =>
                            newDesignHandler(
                              design.url,
                              design.type,
                              design.width,
                              design.height
                            )
                        : () =>
                            newConstructedDesignsHandler(
                              design.url,
                              design.groupedItems
                            )
                    }
                  >
                    <Image
                      src={design.url}
                      alt={design.name}
                      className={styles.imageItem}
                      width={100}
                      height={100}
                    />
                  </div>
                ))
              ) : (
                <>
                  <img
                    src={"/icons/no-designs-results.svg"}
                    draggable="false"
                  ></img>
                </>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              height: "80%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BasicLoader />
          </div>
        )}
      </>
    </>
  );
}
