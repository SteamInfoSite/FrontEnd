const PAGE_GROUP_SIZE = 5;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  groupNavigation = false,
}) {
  if (totalPages < 1) return null;

  const startPage = groupNavigation
    ? Math.floor((currentPage - 1) / PAGE_GROUP_SIZE)
        * PAGE_GROUP_SIZE + 1
    : Math.max(
        1,
        Math.min(
          currentPage - 2,
          totalPages - PAGE_GROUP_SIZE + 1
        )
      );

  const endPage = Math.min(
    totalPages,
    startPage + PAGE_GROUP_SIZE - 1
  );

  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {groupNavigation && (
        <>
          <button
            type="button"
            className="page-button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            맨앞
          </button>

          <button
            type="button"
            className="page-button"
            aria-label="이전 페이지 묶음"
            disabled={startPage === 1}
            onClick={() =>
              onPageChange(
                Math.max(1, startPage - PAGE_GROUP_SIZE)
              )
            }
          >
            이전
          </button>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={
            currentPage === page ? "page" : undefined
          }
          className={`page-button ${
            currentPage === page ? "active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {groupNavigation && (
        <>
          <button
            type="button"
            className="page-button"
            aria-label="다음 페이지 묶음"
            disabled={endPage === totalPages}
            onClick={() => onPageChange(endPage + 1)}
          >
            다음
          </button>

          <button
            type="button"
            className="page-button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            맨끝
          </button>
        </>
      )}
    </div>
  );
}

export default Pagination;