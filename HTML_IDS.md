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

## 인기 게임 목록 — src/pages/HotGames.jsx

| ID | 역할 |
| --- | --- |
| hot_games_content | main: Hot game 목록 페이지 본문 |
| hot_genre_select | select: 장르 필터 |
| hot_platform_select | select: 플랫폼 필터 |
| hot_sort_select | select: 추천 수 정렬 방식 |
| hot_games_loading | p: 목록 로딩 상태 안내 |
| hot_games_error | div: 목록 조회 실패 상태 |
| hot_games_retry_button | button: 목록 조회 재시도 |
| hot_games_empty | div: 필터 결과 없음 상태 |
| hot_filters_reset_button | button: 필터 초기화 |
| hot_game_list | table: 게임 목록 |
| hot_game_item_${game.id} | tr: 게임별 목록 행 식별자 |
| hot_game_pagination | nav: 페이지 이동 영역 |
| hot_page_prev_button | button: 이전 페이지 이동 |
| hot_page_next_button | button: 다음 페이지 이동 |

`hot_game_item_${game.id}`에서 `${game.id}`는 현재 목업 게임의 식별자이며, API 연결 후 서버의 Steam appId로 바꿉니다.

## 신작 게임 목록 — src/pages/NewGames.jsx

신작 목록도 Hot game과 같은 목록·필터 구조를 사용하며, 출시일을 기준으로 정렬합니다.

신작 목록 본문: `new_games_content`
장르 필터 선택창: `new_genre_select`
플랫폼 필터 선택창: `new_platform_select`
출시일 정렬 선택창: `new_sort_select`
신작 목록 로딩 안내: `new_games_loading`
신작 목록 조회 실패 영역: `new_games_error`
신작 목록 다시 시도 버튼: `new_games_retry_button`
신작 검색 결과 없음 영역: `new_games_empty`
필터 초기화 버튼: `new_filters_reset_button`
신작 게임 목록 테이블: `new_game_list`
신작 게임별 목록 행: `new_game_item_${game.id}`
신작 목록 페이지 이동 영역: `new_game_pagination`
신작 이전 페이지 버튼: `new_page_prev_button`
신작 다음 페이지 버튼: `new_page_next_button`

## 출시 예정 게임 목록 — src/pages/UpcomingGames.jsx

출시 예정 목업 게임을 표시하며, 장르·플랫폼 필터와 출시일 정렬을 제공합니다.

출시 예정 게임 목록 본문: `upcoming_games_content`
장르 필터 선택창: `upcoming_genre_select`
플랫폼 필터 선택창: `upcoming_platform_select`
출시일 정렬 선택창: `upcoming_sort_select`
출시 예정 목록 로딩 안내: `upcoming_games_loading`
출시 예정 목록 조회 실패 영역: `upcoming_games_error`
출시 예정 목록 다시 시도 버튼: `upcoming_games_retry_button`
출시 예정 검색 결과 없음 영역: `upcoming_games_empty`
출시 예정 필터 초기화 버튼: `upcoming_filters_reset_button`
출시 예정 게임 목록 테이블: `upcoming_game_list`
출시 예정 게임별 목록 행: `upcoming_game_item_${game.id}`
출시 예정 목록 페이지 이동 영역: `upcoming_game_pagination`
출시 예정 이전 페이지 버튼: `upcoming_page_prev_button`
출시 예정 다음 페이지 버튼: `upcoming_page_next_button`

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
| nav_new_game_button | src/components/Sidebar.jsx / button / New game 메뉴 |
| nav_pay_to_play_button | src/components/Sidebar.jsx / button / Pay-to-play 메뉴 |
| nav_free_game_button | src/components/Sidebar.jsx / button / Free game 메뉴 |
| nav_discount_button | src/components/Sidebar.jsx / button / Discount 메뉴 |
| nav_genre_button | src/components/Sidebar.jsx / button / Genre 메뉴 |
| nav_upcoming_button | src/components/Sidebar.jsx / button / Upcoming 메뉴 |

## 유료·무료 게임 목록 — src/pages/PriceGames.jsx

`PriceGames`는 `mode="paid"`일 때 유료 게임만, `mode="free"`일 때 무료 게임만 표시합니다. 따라서 아래 ID의 `paid`와 `free`는 각각 페이지에 따라 달라집니다.

유료·무료 게임 목록 본문: `paid_games_content` / `free_games_content`
장르 필터 선택창: `paid_genre_select` / `free_genre_select`
플랫폼 필터 선택창: `paid_platform_select` / `free_platform_select`
정렬 선택창: `paid_sort_select` / `free_sort_select`
목록 로딩 안내: `paid_games_loading` / `free_games_loading`
목록 조회 실패 영역: `paid_games_error` / `free_games_error`
목록 다시 시도 버튼: `paid_games_retry_button` / `free_games_retry_button`
검색 결과 없음 영역: `paid_games_empty` / `free_games_empty`
필터 초기화 버튼: `paid_filters_reset_button` / `free_filters_reset_button`
게임 목록 테이블: `paid_game_list` / `free_game_list`
게임별 목록 행: `paid_game_item_${game.id}` / `free_game_item_${game.id}`
목록 페이지 이동 영역: `paid_game_pagination` / `free_game_pagination`
이전 페이지 버튼: `paid_page_prev_button` / `free_page_prev_button`
다음 페이지 버튼: `paid_page_next_button` / `free_page_next_button`

## 할인 게임 목록 — src/pages/PriceGames.jsx

`PriceGames`가 `mode="discount"`일 때 할인율이 있는 유료 게임만 표시합니다.

할인 게임 목록 본문: `discount_games_content`
장르 필터 선택창: `discount_genre_select`
플랫폼 필터 선택창: `discount_platform_select`
할인 정렬 선택창: `discount_sort_select`
할인 목록 로딩 안내: `discount_games_loading`
할인 목록 조회 실패 영역: `discount_games_error`
할인 목록 다시 시도 버튼: `discount_games_retry_button`
할인 검색 결과 없음 영역: `discount_games_empty`
할인 필터 초기화 버튼: `discount_filters_reset_button`
할인 게임 목록 테이블: `discount_game_list`
할인 게임별 목록 행: `discount_game_item_${game.id}`
할인 목록 페이지 이동 영역: `discount_game_pagination`
할인 이전 페이지 버튼: `discount_page_prev_button`
할인 다음 페이지 버튼: `discount_page_next_button`

## 장르 게임 목록 — src/pages/GenreGames.jsx

`GenreGames`가 장르별 게임을 표시합니다. 장르를 선택하지 않으면 전체 장르가 표시됩니다.

장르 게임 목록 본문: `genre_games_content`
장르 필터 선택창: `genre_genre_select`
플랫폼 필터 선택창: `genre_platform_select`
장르 목록 정렬 선택창: `genre_sort_select`
장르 목록 로딩 안내: `genre_games_loading`
장르 목록 조회 실패 영역: `genre_games_error`
장르 목록 다시 시도 버튼: `genre_games_retry_button`
장르 검색 결과 없음 영역: `genre_games_empty`
장르 필터 초기화 버튼: `genre_filters_reset_button`
장르 게임 목록 테이블: `genre_game_list`
장르 게임별 목록 행: `genre_game_item_${game.id}`
장르 목록 페이지 이동 영역: `genre_game_pagination`
장르 이전 페이지 버튼: `genre_page_prev_button`
장르 다음 페이지 버튼: `genre_page_next_button`

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
