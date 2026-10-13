import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

function GameMovieCard({ movie, index, appId }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState("");

  const title = movie.name || `게임 영상 ${index + 1}`;
  const videoUrl = movie.hlsH264;

  useEffect(() => {
    if (!started) return;

    const video = videoRef.current;
    if (!video) return;

    let hls;

    const showError = () => {
      setError("영상을 재생하지 못했습니다. Steam 스토어에서 확인해 주세요.");
    };

    const tryPlay = () => {
      // 자동 재생이 차단되면 사용자가 재생 버튼을 누를 수 있어요.
      video.play().catch(() => {});
    };

    video.addEventListener("error", showError);

    if (!videoUrl) {
      showError();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      tryPlay();
    } else if (Hls.isSupported()) {
      hls = new Hls();

      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          showError();
          hls.destroy();
        }
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else {
      setError("이 브라우저에서는 해당 영상을 재생할 수 없습니다.");
    }

    return () => {
      video.removeEventListener("error", showError);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [started, videoUrl]);

  return (
    <article className="game-movie-card">
      {!started ? (
        <button
          type="button"
          className="game-movie-thumbnail"
          onClick={() => setStarted(true)}
          aria-label={`${title} 재생`}
        >
          {movie.thumbnail && !imageFailed ? (
            <img
              src={movie.thumbnail}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="game-movie-placeholder">
              미리보기 이미지 없음
            </span>
          )}

          <span className="game-movie-play" aria-hidden="true">
            ▶
          </span>
        </button>
      ) : (
        <video
          ref={videoRef}
          className="game-movie-player"
          controls
          playsInline
          poster={movie.thumbnail || undefined}
          aria-label={title}
        />
      )}

      <h3>{title}</h3>

      {error && (
        <div className="game-movie-error" role="alert">
          <p>{error}</p>
          {appId && (
            <a
              href={`https://store.steampowered.com/app/${appId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Steam 스토어에서 보기
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default GameMovieCard;