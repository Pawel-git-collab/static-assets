import React, { useEffect, useState } from "react";


function DynamicTable() {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState(""); 
  const [search, setSearch] = useState("");           
  const [sortConfig, setSortConfig] = useState({ key: "Name", direction: "asc" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL =
      "https://rekrutacja-webhosting-it.krd.pl/api/Recruitment/GetTopDebts";

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Wczytywanie danych...</p>;
  if (data.length === 0) return <p>Brak dostępnych danych</p>;

  const columnLabels = {
  Number: "Numer sprawy",
  Name: "Dłużnik",
  Date: "Data powstania zobowiązania",
  Value: "Kwota zadłużenia",
  NIP: "NIP"
};

  const columnsToShow = ["Name", "NIP", "Value", "Date"];

  const filteredData = data.filter((row) => {
    if (search.length > 0 && search.length < 3) {
    return true;
    }
    return (
      String(row.Name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(row.NIP || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  const sortedData = [...filteredData];
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (col) => {
    let direction = "asc";
    if (sortConfig.key === col && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: col, direction });
  };

  const getSortIndicator = (col) => {
    if (sortConfig.key === col)
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    return "";
  };

  const handleSearchClick = () => {
    setSearch(searchInput);
  };

  const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; 
  const day = String(date.getDate()).padStart(2, "0");     
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; 
};

  return (
    <div className="table-container">
      <div className="search-box-container">
        <input
          type="text"
          placeholder="Podaj NIP lub nazwę dłużnika"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-box"
        />
        <button className="search-button" onClick={handleSearchClick}>
          Szukaj
        </button>
      </div>

        <table className="data-table">
          <thead>
            <tr>
              {columnsToShow.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{ cursor: "pointer" }}
                >
                  {columnLabels[col] || col}
                  {getSortIndicator(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx}>
                {columnsToShow.map((col) => (
                  <td key={col}>
                {col === "Date" ? formatDate(row[col]) : row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}
export default DynamicTable
