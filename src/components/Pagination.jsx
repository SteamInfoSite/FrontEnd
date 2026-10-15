import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const PAGE_GROUP_SIZE = 5;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  groupNavigation = false,
}) {
  const { t } = useLanguage();
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
            {t("맨앞")}
          </button>

          <button
            type="button"
            className="page-button"
            aria-label={t("이전 페이지 묶음")}
            disabled={startPage === 1}
            onClick={() =>
              onPageChange(
                Math.max(1, startPage - PAGE_GROUP_SIZE)
              )
            }
          >
            {t("이전")}
          </button>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={t("{{page}}페이지", { page })}
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
            aria-label={t("다음 페이지 묶음")}
            disabled={endPage === totalPages}
            onClick={() => onPageChange(endPage + 1)}
          >
            {t("다음")}
          </button>

          <button
            type="button"
            className="page-button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            {t("맨끝")}
          </button>
        </>
      )}
              {groupNavigation && totalPages > 1 && (
                <PageJumpForm
                  key={`${currentPage}-${totalPages}`}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              )}
            </div>
          );
        }

        export default Pagination;

function PageJumpForm({ currentPage, totalPages, onPageChange }) {
  const { t, formatNumber } = useLanguage();
  const [pageInput, setPageInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = pageInput.trim();
    const targetPage = Number(value);

    if (
      !/^[0-9]+$/.test(value) ||
      !Number.isSafeInteger(targetPage) ||
      targetPage < 1 ||
      targetPage > totalPages
    ) {
      setError(true);
      return;
    }

    setError("");
    setPageInput("");

    if (targetPage !== currentPage) {
      onPageChange(targetPage);
    }
  };

  return (
    <form className="page-jump-form" onSubmit={handleSubmit}>
      <label className="page-jump-label">
        <input
          type="text"
          aria-label={t("이동할 페이지 번호")}
          inputMode="numeric"
          autoComplete="off"
          value={pageInput}
          placeholder={t("페이지 번호")}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            setPageInput(event.target.value);
            setError("");
          }}
        />
      </label>

      <span className="page-jump-total">
        / {formatNumber(totalPages)}
      </span>

      <button type="submit">{t("이동")}</button>

      {error && (
        <p className="page-jump-error" role="alert">
          {t("1부터 {{pages}}까지의 페이지 번호를 입력해 주세요.", { pages: formatNumber(totalPages) })}
        </p>
      )}
    </form>
  );
}
