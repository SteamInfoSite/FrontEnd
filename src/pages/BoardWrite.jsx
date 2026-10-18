import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  createPost,
  getMyDisplayName,
} from "../services/boardService";
import { cleanBoardContent } from "../mocks/boardContent";

import "../styles/BoardWrite.css";

const CATEGORY_VALUES = {
  잡담: "CHAT",
  소식: "NEWS",
};

function BoardWrite() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loggedIn, status, accessToken } = useAuth();

  const [category, setCategory] = useState("잡담");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formats, setFormats] = useState({});

  const editorRef = useRef(null);
  const selectionRef = useRef(null);

  useEffect(() => {
    if (!loggedIn) {
      setDisplayName("");
      return;
    }

    let active = true;

    getMyDisplayName(accessToken)
      .then((data) => {
        if (active) setDisplayName(data.displayName);
      })
      .catch(() => {
        if (active) setDisplayName("Steam 사용자");
      });

    return () => {
      active = false;
    };
  }, [loggedIn, accessToken]);

  function rememberSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (
      !editor ||
      !selection.rangeCount ||
      !editor.contains(selection.anchorNode) ||
      !editor.contains(selection.focusNode)
    ) {
      return;
    }

    selectionRef.current = selection.getRangeAt(0).cloneRange();

    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      list: document.queryCommandState("insertUnorderedList"),
    });
  }

  function applyFormat(command, value = null) {
    const editor = editorRef.current;
    if (!editor || submitting) return;

    editor.focus();

    const selection = window.getSelection();
    const savedRange = selectionRef.current;

    if (savedRange && editor.contains(savedRange.commonAncestorContainer)) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    document.execCommand(command, false, value);
    setContent(editor.innerText);
    rememberSelection();
  }

  function handleCancel() {
    if (
      (title.trim() || content.trim()) &&
      !window.confirm(t("작성 중인 내용을 취소할까요?"))
    ) {
      return;
    }

    navigate("/board");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (status !== "ready" || !loggedIn) {
      setMessage("로그인 후 글을 작성할 수 있습니다.");
      return;
    }

    const editor = editorRef.current;
    const plainContent = editor.innerText;

    if (!title.trim() || !plainContent.trim()) {
      setMessage("제목과 본문을 입력해 주세요.");
      return;
    }

    if (plainContent.length > 20000) {
      setMessage("본문은 20,000자 이내로 작성해 주세요.");
      return;
    }

    if (editor.querySelector("img, video, iframe")) {
      setMessage("이미지와 동영상은 아직 등록할 수 없습니다.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const postId = await createPost({
        category: CATEGORY_VALUES[category],
        title: title.trim(),
        contentHtml: cleanBoardContent(editor.innerHTML),
      }, accessToken);

      navigate(`/board/${postId}`);
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="board-write-page">
      <Sidebar />

      <div className="board-write-main-area">
        <Header />

        <main className="board-write-content">
          <div className="board-write-heading">
            <h1>{t("Community Board")}</h1>
          </div>

          <form
            id="post_write_form"
            className="board-write-form"
            onSubmit={handleSubmit}
          >
            <div
              className="board-write-categories"
              role="group"
              aria-label={t("말머리 선택")}
            >
              <div className="board-write-category-side">
                <span className="board-write-category-label">{t("말머리")}</span>

                {["잡담", "소식"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`board-category-button ${
                      category === item ? "active" : ""
                    }`}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {t(item)}
                  </button>
                ))}
              </div>

              <div className="board-write-nickname-side">
                <label htmlFor="board_nickname">{t("닉네임")}</label>
                <input
                  id="board_nickname"
                  className="board-write-nickname"
                  aria-label={t("작성자 Steam 이름")}
                  value={loggedIn ? displayName : ""}
                  placeholder={
                    loggedIn ? t("이름 확인 중") : t("로그인이 필요합니다")
                  }
                  readOnly
                />
              </div>
            </div>

            <input
              id="post_title_input"
              className="board-write-title"
              aria-label={t("게시글 제목")}
              placeholder={t("제목을 입력해 주세요.")}
              maxLength={200}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <div className="board-write-editor">
              <div
                className="board-write-toolbar"
                role="group"
                aria-label={t("본문 서식 도구")}
              >
                <button type="button" disabled title={t("준비 중")}>
                  {t("이미지")}
                </button>
                <button type="button" disabled title={t("준비 중")}>
                  {t("동영상")}
                </button>
                <button type="button" disabled title={t("준비 중")}>
                  {t("링크")}
                </button>

                <select
                  id="editor_font_select"
                  aria-label={t("글꼴")}
                  defaultValue=""
                  disabled
                >
                  <option value="">{t("글꼴")}</option>
                </select>

                <select
                  aria-label={t("글자 크기")}
                  defaultValue=""
                  disabled
                >
                  <option value="">{t("크기")}</option>
                </select>

                <button
                  type="button"
                  aria-label={t("굵게")}
                  aria-pressed={!!formats.bold}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyFormat("bold")}
                >
                  <b>B</b>
                </button>

                <button
                  type="button"
                  aria-label={t("기울임")}
                  aria-pressed={!!formats.italic}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyFormat("italic")}
                >
                  <i>I</i>
                </button>

                <button
                  type="button"
                  aria-label={t("밑줄")}
                  aria-pressed={!!formats.underline}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyFormat("underline")}
                >
                  <u>U</u>
                </button>

                <select
                  id="editor_text_color_select"
                  aria-label={t("글자색")}
                  defaultValue=""
                  disabled
                >
                  <option value="">{t("글자색")}</option>
                </select>

                <select
                  aria-label={t("글자 배경색")}
                  defaultValue=""
                  disabled
                >
                  <option value="">{t("글자 배경색")}</option>
                </select>

                <button
                  type="button"
                  aria-pressed={!!formats.list}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyFormat("insertUnorderedList")}
                >
                  {t("목록")}
                </button>

                <span className="board-write-tool-hint">
                  {t("이미지·동영상 업로드 준비 중")}
                </span>
              </div>

              <div
                id="post_content_editor"
                ref={editorRef}
                className="board-write-body"
                contentEditable={!submitting}
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label={t("게시글 내용")}
                data-placeholder={t("내용을 입력해 주세요.")}
                onInput={() => {
                  setContent(editorRef.current.innerText);
                  rememberSelection();
                }}
                onMouseUp={rememberSelection}
                onKeyUp={rememberSelection}
                onBlur={rememberSelection}
                onPaste={(event) => {
                  event.preventDefault();

                  if (event.clipboardData.files.length) {
                    setMessage("이미지 붙여넣기는 아직 지원하지 않습니다.");
                    return;
                  }

                  rememberSelection();
                  applyFormat(
                    "insertText",
                    event.clipboardData.getData("text/plain")
                  );
                }}
                onDrop={(event) => event.preventDefault()}
              />
            </div>

            <p className="board-write-message" role="status">
              {t(message)}
            </p>

            <div className="board-write-actions">
              <button
                type="button"
                className="board-write-cancel"
                disabled={submitting}
                onClick={handleCancel}
              >
                {t("취소")}
              </button>

              <button
                type="submit"
                className="board-write-submit"
                disabled={status !== "ready" || !loggedIn || submitting}
              >
                {submitting ? t("등록 중") : t("등록")}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default BoardWrite;
