function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pages = [];

  const startPage = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - 4)
  );

  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          className={`page-button ${
            currentPage === page ? "active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
