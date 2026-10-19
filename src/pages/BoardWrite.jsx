import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { TextStyleKit } from "@tiptap/extension-text-style";

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

const HTTPS_URL_PATTERN = /https:\/\/[^\s<>"']+/gi;
const TRAILING_PUNCTUATION = /[.,!?;:)\]}]+$/;

function syncHttpsLinks(editor) {
  const { state } = editor;
  const linkType = state.schema.marks.link;
  if (!linkType) return;

  const transaction = state.tr;

  state.doc.descendants((block, blockPosition) => {
    if (!block.isTextblock) return true;

    let text = "";
    const positions = [];
    const currentLinks = [];

    block.forEach((child, offset) => {
      const from = blockPosition + 1 + offset;

      if (!child.isText) {
        for (let index = 0; index < child.nodeSize; index += 1) {
          text += " ";
          positions.push(from + index);
        }
        return;
      }

      const link = child.marks.find((mark) => mark.type === linkType);
      const isCode = child.marks.some((mark) => mark.type.name === "code");

      for (let index = 0; index < child.text.length; index += 1) {
        text += isCode ? " " : child.text[index];
        positions.push(from + index);
      }

      if (link) {
        const previous = currentLinks[currentLinks.length - 1];
        const to = from + child.nodeSize;

        if (previous?.to === from && previous.href === link.attrs.href) {
          previous.to = to;
        } else {
          currentLinks.push({ from, to, href: link.attrs.href });
        }
      }
    });

    const expectedLinks = [];

    for (const match of text.matchAll(HTTPS_URL_PATTERN)) {
      const href = match[0].replace(TRAILING_PUNCTUATION, "");

      try {
        const url = new URL(href);
        if (url.protocol !== "https:" || !url.hostname.includes(".")) {
          continue;
        }
      } catch {
        continue;
      }

      const from = positions[match.index];
      const to = positions[match.index + href.length - 1] + 1;
      expectedLinks.push({ from, to, href });
    }

    const linksMatch =
      currentLinks.length === expectedLinks.length &&
      currentLinks.every(
        (link, index) =>
          link.from === expectedLinks[index].from &&
          link.to === expectedLinks[index].to &&
          link.href === expectedLinks[index].href
      );

    if (!linksMatch) {
      transaction.removeMark(
        blockPosition + 1,
        blockPosition + block.nodeSize - 1,
        linkType
      );

      expectedLinks.forEach(({ from, to, href }) => {
        transaction.addMark(from, to, linkType.create({ href }));
      });
    }

    return false;
  });

  if (transaction.steps.length > 0) {
    editor.view.dispatch(transaction);
  }
}

function readFormats(editor) {
  if (!editor) {
    return {
      bold: false,
      italic: false,
      underline: false,
      list: false,
      fontFamily: "",
      fontSize: "",
      color: "",
      backgroundColor: "",
    };
  }

  const textStyle = editor.getAttributes("textStyle");

  return {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    underline: editor.isActive("underline"),
    list: editor.isActive("bulletList"),
    fontFamily: textStyle.fontFamily || "",
    fontSize: textStyle.fontSize || "",
    color: textStyle.color || "",
    backgroundColor: textStyle.backgroundColor || "",
  };
}

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        horizontalRule: false,
        link: {
          autolink: false,
          linkOnPaste: false,
          openOnClick: false,
          shouldAutoLink: (url) => /^https:\/\//i.test(url),
          isAllowedUri: (url, context) =>
            /^https:\/\//i.test(url) && context.defaultValidate(url),
        },
      }),
      TextStyleKit.configure({
        lineHeight: false,
      }),
      Placeholder.configure({
        placeholder: t("내용을 입력해 주세요."),
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        id: "post_content_editor",
        class: "board-write-body",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": t("게시글 내용"),
      },
      handlePaste: (_view, event) => {
        if (event.clipboardData?.files.length) {
          setMessage("이미지 붙여넣기는 아직 지원하지 않습니다.");
          return true;
        }

        return false;
      },
      handleDrop: () => true,
    },
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getText());
      syncHttpsLinks(currentEditor);
    },
  });

  const formats = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => readFormats(currentEditor),
  });

  useEffect(() => {
    editor?.setEditable(!submitting);
  }, [editor, submitting]);

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

    if (!editor) return;

    const plainContent = editor.getText();

    if (!title.trim() || !plainContent.trim()) {
      setMessage("제목과 본문을 입력해 주세요.");
      return;
    }

    if (plainContent.length > 20000) {
      setMessage("본문은 20,000자 이내로 작성해 주세요.");
      return;
    }

    if (editor.view.dom.querySelector("img, video, iframe")) {
      setMessage("이미지와 동영상은 아직 등록할 수 없습니다.");
      return;
    }

    syncHttpsLinks(editor);

    setSubmitting(true);
    setMessage("");

    try {
      const postId = await createPost({
        category: CATEGORY_VALUES[category],
        title: title.trim(),
        contentHtml: cleanBoardContent(editor.getHTML()),
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
                <span className="board-write-category-label">
                  {t("말머리")}
                </span>

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
                    loggedIn
                      ? t("이름 확인 중")
                      : t("로그인이 필요합니다")
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
                <select
                  id="editor_font_select"
                  aria-label={t("글꼴")}
                  value={formats.fontFamily}
                  disabled={!editor || submitting}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value) {
                      editor.chain().focus().setFontFamily(value).run();
                    } else {
                      editor.chain().focus().unsetFontFamily().run();
                    }
                  }}
                >
                  <option value="">{t("글꼴")}</option>
                  <option value="Malgun Gothic">맑은 고딕</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                </select>

                <select
                  aria-label={t("글자 크기")}
                  value={formats.fontSize}
                  disabled={!editor || submitting}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value) {
                      editor.chain().focus().setFontSize(value).run();
                    } else {
                      editor.chain().focus().unsetFontSize().run();
                    }
                  }}
                >
                  <option value="">{t("크기")}</option>
                  <option value="10px">10</option>
                  <option value="13px">13</option>
                  <option value="16px">16</option>
                  <option value="18px">18</option>
                  <option value="24px">24</option>
                  <option value="32px">32</option>
                  <option value="48px">48</option>
                </select>

                <button
                  type="button"
                  aria-label={t("굵게")}
                  aria-pressed={!!formats.bold}
                  disabled={!editor || submitting}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() =>
                    editor.chain().focus().toggleBold().run()
                  }
                >
                  <b>B</b>
                </button>

                <button
                  type="button"
                  aria-label={t("기울임")}
                  aria-pressed={!!formats.italic}
                  disabled={!editor || submitting}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() =>
                    editor.chain().focus().toggleItalic().run()
                  }
                >
                  <i>I</i>
                </button>

                <button
                  type="button"
                  aria-label={t("밑줄")}
                  aria-pressed={!!formats.underline}
                  disabled={!editor || submitting}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                  }
                >
                  <u>U</u>
                </button>

                <select
                  id="editor_text_color_select"
                  aria-label={t("글자색")}
                  value={formats.color}
                  disabled={!editor || submitting}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value) {
                      editor.chain().focus().setColor(value).run();
                    } else {
                      editor.chain().focus().unsetColor().run();
                    }
                  }}
                >
                  <option value="">{t("기본 검정")}</option>
                  <option value="#dc2626">{t("빨강")}</option>
                  <option value="#ea580c">{t("주황")}</option>
                  <option value="#15803d">{t("초록")}</option>
                  <option value="#2563eb">{t("파랑")}</option>
                  <option value="#7c3aed">{t("보라")}</option>
                </select>

                <select
                  aria-label={t("글자 배경색")}
                  value={formats.backgroundColor}
                  disabled={!editor || submitting}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value) {
                      editor.chain().focus().setBackgroundColor(value).run();
                    } else {
                      editor.chain().focus().unsetBackgroundColor().run();
                    }
                  }}
                >
                  <option value="">{t("배경색 없음")}</option>
                  <option value="#fef08a">{t("노랑")}</option>
                  <option value="#fecdd3">{t("분홍")}</option>
                  <option value="#bbf7d0">{t("연두")}</option>
                  <option value="#bfdbfe">{t("하늘")}</option>
                  <option value="#e9d5ff">{t("연보라")}</option>
                </select>

                <button
                  type="button"
                  aria-pressed={!!formats.list}
                  disabled={!editor || submitting}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  {t("목록")}
                </button>
              </div>

              <EditorContent editor={editor} />
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
                disabled={
                  status !== "ready" ||
                  !loggedIn ||
                  !editor ||
                  submitting
                }
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