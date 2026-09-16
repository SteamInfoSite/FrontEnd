import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { createPost } from "../mocks/boardPostMock";
import { cleanBoardContent } from "../mocks/boardContent";

import "../styles/BoardWrite.css";

function BoardWrite() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("잡담");
  const [nickname, setNickname] = useState("User");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const [formats, setFormats] = useState({});
  const [fontName, setFontName] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [textColor, setTextColor] = useState("");
  const [highlightColor, setHighlightColor] = useState("");
  const imageInputRef = useRef(null);
  const imageBusyRef = useRef(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // 화면 동작 확인용 이미지 제한: 최대 3장, 원본 5MB까지 받습니다.
  const insertImages = async (files) => {
    if (imageBusyRef.current || !files.length) return;
    const editor = editorRef.current;
    if (editor.querySelectorAll("img").length + files.length > 3) {
      setMessage("사진은 게시글당 최대 3장까지 넣을 수 있습니다.");
      return;
    }
    imageBusyRef.current = true;
    setIsImageLoading(true);
    setMessage("사진을 불러오는 중입니다.");
    try {
      const images = [];
      for (const file of files) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
          throw new Error("사진은 5MB 이하의 JPG, PNG, WebP 파일을 선택해 주세요.");
        }
        const url = URL.createObjectURL(file);
        try {
          const image = new Image();
          image.src = url;
          await image.decode();
          const ratio = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          const src = canvas.toDataURL("image/webp", 0.8);
          if (src.length > 700000) throw new Error("사진 용량이 큽니다. 크기를 줄인 뒤 다시 넣어 주세요.");
          const element = document.createElement("img");
          element.src = src;
          element.alt = file.name || "첨부 사진";
          images.push(element.outerHTML + "<br>");
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      // 읽는 동안 본문을 잠가 선택 범위가 바뀌지 않도록 합니다.
      editor.contentEditable = "true";
      applyFormat("insertHTML", images.join(""));
      setMessage("");
    } catch (error) {
      setMessage(error.message.startsWith("사진") ? error.message : "사진을 불러오지 못했습니다. 다른 파일을 선택해 주세요.");
    } finally {
      imageBusyRef.current = false;
      setIsImageLoading(false);
    }
  };

  // 도구를 누르는 동안에도 본문에서 선택했던 범위를 유지합니다.
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || !editorRef.current.contains(selection.anchorNode) || !editorRef.current.contains(selection.focusNode)) return;
    selectionRef.current = selection.getRangeAt(0).cloneRange();
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      list: document.queryCommandState("insertUnorderedList"),
    });
    const selectedFont = document.queryCommandValue("fontName").replace(/["']/g, "");
    const selectedSize = document.queryCommandValue("fontSize");
    if (["Malgun Gothic", "Arial", "Georgia"].some((font) => font.toLowerCase() === selectedFont.toLowerCase())) {
      setFontName(["Malgun Gothic", "Arial", "Georgia"].find((font) => font.toLowerCase() === selectedFont.toLowerCase()));
    }
    if (/^[1-7]$/.test(selectedSize)) setFontSize(selectedSize);
  };

  const applyFormat = (command, value = null) => {
    if (imageBusyRef.current && command !== "insertHTML") return;
    const editor = editorRef.current;
    editor.focus();
    const selection = window.getSelection();
    if (selectionRef.current && editor.contains(selectionRef.current.commonAncestorContainer)) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
    // 브라우저의 편집 명령을 사용해 실행 취소 기록을 유지합니다.
    // 브라우저에 따라 글자 배경색 명령 이름이 달라 두 명령을 순서대로 시도합니다.
    if (command === "foreColor" || command === "hiliteColor") {
      document.execCommand("styleWithCSS", false, true);
    }
    if (command === "hiliteColor") {
      const applied = document.execCommand("hiliteColor", false, value);
      if (!applied) document.execCommand("backColor", false, value);
    } else {
      document.execCommand(command, false, value);
    }
    setContent(editor.innerText);
    rememberSelection();
  };

  const handleLink = () => {
    const url = window.prompt("연결할 주소를 입력해 주세요. (https:// 또는 http://)");
    if (!url) return;
    if (!/^https?:\/\//i.test(url.trim())) {
      setMessage("링크는 https:// 또는 http://로 시작해야 합니다.");
      return;
    }
    if (!selectionRef.current || selectionRef.current.collapsed) {
      setMessage("링크를 연결할 글자를 먼저 선택해 주세요.");
      return;
    }
    applyFormat("createLink", url.trim());
    setMessage("");
  };

  const handleCancel = () => {
    if ((title.trim() || content.trim() || editorRef.current.querySelector("img")) && !window.confirm("작성 중인 내용을 취소할까요?")) return;
    navigate("/board");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (imageBusyRef.current) return;
    const plainContent = editorRef.current.innerText;
    if (!title.trim() || (!plainContent.trim() && !editorRef.current.querySelector("img"))) {
      setMessage("제목과 본문 내용 또는 사진을 입력해 주세요.");
      return;
    }

    if (plainContent.length > 20000) {
      setMessage("본문은 20,000자 이내로 작성해 주세요.");
      return;
    }
    // 백엔드 연결 후 createPost를 게시글 등록 API 호출로 교체합니다.
    try {
      const post = createPost({
        category, nickname, title, content: plainContent,
        contentHtml: cleanBoardContent(editorRef.current.innerHTML),
      });
      navigate(`/board/${post.id}`);
    } catch {
      // API 연동 시 서버 오류 메시지 처리로 변경합니다.
      setMessage("글 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="board-write-page">
      <Sidebar />
      <div className="board-write-main-area">
        <Header />
        <main className="board-write-content">
          <div className="board-write-heading">
            <h1>Community Board</h1>
          </div>

          <form className="board-write-form" onSubmit={handleSubmit}>
            <div className="board-write-categories" role="group" aria-label="말머리 선택">
              <div className="board-write-category-side">
                <span className="board-write-category-label">말머리</span>
                {["잡담", "소식"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`board-category-button ${category === item ? "active" : ""}`}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="board-write-nickname-side">
                <label htmlFor="board-nickname">닉네임</label>
                <input
                  id="board-nickname"
                  className="board-write-nickname"
                  aria-label="닉네임"
                  placeholder="닉네임을 입력해 주세요."
                  maxLength={20}
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                />
              </div>
            </div>

            <input
              className="board-write-title"
              aria-label="게시글 제목"
              placeholder="제목을 입력해 주세요."
              maxLength={150}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <div className="board-write-editor">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={(event) => {
                  insertImages(Array.from(event.target.files));
                  event.target.value = "";
                }}
              />
              <div className="board-write-toolbar" role="group" aria-label="본문 서식 도구">
                <button type="button" disabled={isImageLoading} onMouseDown={(event) => event.preventDefault()} onClick={() => imageInputRef.current.click()}>이미지</button>
                <button type="button" disabled title="준비 중">동영상</button>
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={handleLink}>링크</button>
                <select aria-label="글꼴" value={fontName} onChange={(event) => { setFontName(event.target.value); applyFormat("fontName", event.target.value); }}>
                  <option value="" disabled>글꼴</option>
                  <option value="Malgun Gothic">맑은 고딕</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                </select>
                <select aria-label="글자 크기" value={fontSize} onChange={(event) => { setFontSize(event.target.value); applyFormat("fontSize", event.target.value); }}>
                  <option value="" disabled>크기</option>
                  <option value="1">10</option><option value="2">13</option>
                  <option value="3">16</option><option value="4">18</option>
                  <option value="5">24</option><option value="6">32</option>
                  <option value="7">48</option>
                </select>
                <button type="button" aria-label="굵게" aria-pressed={!!formats.bold} onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("bold")}><b>B</b></button>
                <button type="button" aria-label="기울임" aria-pressed={!!formats.italic} onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("italic")}><i>I</i></button>
                <button type="button" aria-label="밑줄" aria-pressed={!!formats.underline} onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("underline")}><u>U</u></button>
                <select aria-label="글자색" value={textColor} onChange={(event) => { setTextColor(event.target.value); applyFormat("foreColor", event.target.value); }}>
                  <option value="" disabled>글자색</option>
                  <option value="#222222">기본 검정</option>
                  <option value="#dc2626">빨강</option>
                  <option value="#ea580c">주황</option>
                  <option value="#15803d">초록</option>
                  <option value="#2563eb">파랑</option>
                  <option value="#7c3aed">보라</option>
                </select>
                <select aria-label="글자 배경색" value={highlightColor} onChange={(event) => { setHighlightColor(event.target.value); applyFormat("hiliteColor", event.target.value); }}>
                  <option value="" disabled>글자 배경색</option>
                  <option value="transparent">배경색 없음</option>
                  <option value="#fef08a">노랑</option>
                  <option value="#fecdd3">분홍</option>
                  <option value="#bbf7d0">연두</option>
                  <option value="#bfdbfe">하늘</option>
                  <option value="#e9d5ff">연보라</option>
                </select>
                <button type="button" aria-pressed={!!formats.list} onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("insertUnorderedList")}>목록</button>
                <span className="board-write-tool-hint">사진 최대 3장 · 장당 5MB · Ctrl+V 가능</span>
              </div>
              <div
                ref={editorRef}
                className="board-write-body"
                contentEditable={!isImageLoading}
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="게시글 내용"
                data-placeholder="내용을 입력해 주세요."
                onInput={() => { setContent(editorRef.current.innerText); rememberSelection(); }}
                onMouseUp={rememberSelection}
                onKeyUp={rememberSelection}
                onBlur={rememberSelection}
                onPaste={(event) => {
                  event.preventDefault();
                  rememberSelection();
                  const files = Array.from(event.clipboardData.files);
                  if (files.length) {
                    insertImages(files);
                  } else {
                    applyFormat("insertText", event.clipboardData.getData("text/plain"));
                  }
                }}
                onDrop={(event) => event.preventDefault()}
              />
            </div>

            <p className="board-write-message" role="status">{message}</p>
            <div className="board-write-actions">
              <button type="button" className="board-write-cancel" disabled={isImageLoading} onClick={handleCancel}>취소</button>
              <button type="submit" className="board-write-submit" disabled={isImageLoading}>등록</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default BoardWrite;
