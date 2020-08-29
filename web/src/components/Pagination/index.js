import React from "react";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import "./styles.css";

export default function Pagination({
  entitiesPerPage,
  totalEntities,
  goForward,
  goBack,
  currentPage,
}) {
  const pageNumbers = [];
  const pages = Math.ceil(totalEntities / entitiesPerPage);
  let generatePages = false;
  if (pages !== 0) {
    generatePages = true;
  }
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="pagination">
      <ul>
        {generatePages ? (
          <div>
            <li>
              <button
                disabled={currentPage === 1 ? true : false}
                onClick={() => goBack()}
                className={`btn-page ${currentPage === 1 ? "disabled" : ""}`}
              >
                <FiArrowLeft color="#333" size={16} />
              </button>
            </li>
            <li className="page-number current">
              {pageNumbers[currentPage - 1]}
            </li>
            <li>|</li>
            <li className="page-number">
              {pageNumbers[pageNumbers.length - 1]}
            </li>
            <li>
              <button
                disabled={currentPage === pages ? true : false}
                onClick={() => goForward()}
                className={`btn-page ${
                  currentPage === pages ? "disabled" : ""
                }`}
              >
                <FiArrowRight color="#333" size={16} />
              </button>
            </li>
          </div>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
}
