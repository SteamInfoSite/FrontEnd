# 현재 HTML ID 목록

ID는 DOM 요소 식별자이며 게임 데이터의 id/appId 및 localStorage 키와 별개입니다.
동일한 공통 컴포넌트는 각 페이지에서 재사용됩니다. 위치는 파일과 요소 기준입니다.

## 게임 상세 — src/pages/GameDetail.jsx

| ID | 위치 / 용도 |
| --- | --- |
| game_detail_content | main: 상세 페이지 본문 |
| steam_store_link | 정보 카드 a: Steam 스토어 또는 제목 검색 이동 |
| game_wishlist_button | 정보 카드 button: Steam 공식 로그인 화면 이동 |
| game_wishlist_note | 버튼 아래 p: 로그인 필요 안내, aria-describedby 연결 |
| game_introduction | section: 게임 소개, 메뉴 앵커 |
| game_information | section: 플랫폼·지원 언어·추천 수 |
| game_reviews | section: 유저 평가, 메뉴 앵커 |
| game_requirements | section: 최소·권장 사양, 메뉴 앵커 |
| game_video_section | section: 영상, 메뉴 앵커 |

## 공통

| ID | 파일 / 위치 / 용도 |
| --- | --- |
| root | index.html / div / React 마운트 지점 |
| site_header | src/components/Header.jsx / header / 공통 헤더 |
| game_search_input | src/components/Header.jsx / input / 게임 검색 입력 |
| steam_login_button | src/components/Header.jsx / button / Steam 로그인 버튼 |
| site_sidebar | src/components/Sidebar.jsx / aside / 공통 사이드바 |
| nav_home_button | src/components/Sidebar.jsx / button / Home 메뉴 |
| nav_game_button | src/components/Sidebar.jsx / button / Game 하위 메뉴 열기·닫기 |
| nav_library_button | src/components/Sidebar.jsx / button / Library 메뉴 |
| nav_social_button | src/components/Sidebar.jsx / button / Social 메뉴 |
| nav_board_button | src/components/Sidebar.jsx / button / Board 메뉴 |
| nav_setting_button | src/components/Sidebar.jsx / button / Setting 메뉴 |

ID 존재 자체가 검색·로그인·각 메뉴의 기능 구현 완료를 뜻하지는 않습니다.

## 게시판·댓글

| ID | 파일 / 위치 / 용도 |
| --- | --- |
| board_post_${post.id} | src/components/BoardTable.jsx / 게시글 행 / 게시글별 식별 |
| comment_item_${comment.id} | src/components/CommentList.jsx / 댓글 항목 / 댓글별 식별 |
| comment_nickname_input | src/components/CommentForm.jsx / input / 댓글 닉네임 |
| comment_content_input | src/components/CommentForm.jsx / 입력 요소 / 댓글 본문 |
| comment_submit_button | src/components/CommentForm.jsx / button / 댓글 등록 |
| post_write_form | src/pages/BoardWrite.jsx / form / 글쓰기 폼 |
| board_nickname | src/pages/BoardWrite.jsx / input / 작성자 닉네임 |
| post_title_input | src/pages/BoardWrite.jsx / input / 글 제목 |
| editor_font_select | src/pages/BoardWrite.jsx / select / 본문 글꼴 선택 |
| editor_text_color_select | src/pages/BoardWrite.jsx / select / 본문 글자색 선택 |
| post_content_editor | src/pages/BoardWrite.jsx / 편집 영역 / 글 본문 |

## 로그인 컴포넌트 — src/pages/Login.jsx

| ID | 위치 / 용도 |
| --- | --- |
| accountName | input / 계정명 입력 |
| password | input / 비밀번호 입력 |

Login 컴포넌트는 현재 App.jsx 라우트에 연결되어 있지 않습니다.

## 찜 버튼 동작

- 클릭하면 https://store.steampowered.com/login/ 으로 이동합니다.
- localStorage 찜 읽기·저장·삭제 동작은 제거했습니다. 기존 저장 값은 사용하지 않습니다.
- 현재는 로그인 화면 이동까지만 구현되어 있으며 사이트 인증 연동 및 로그인 후 찜 저장은 미구현입니다.
- game_wishlist_status ID와 상태 문구는 제거했습니다.
