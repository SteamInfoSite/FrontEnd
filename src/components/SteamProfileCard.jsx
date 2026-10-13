import { useEffect, useState } from "react";
import { getMySteamProfile } from "../services/socialService";

function SteamProfileCard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    getMySteamProfile({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;

        setProfile(data);
        setImageFailed(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;

        setError(error.message || "내 프로필을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [retry]);

  return (
    <section
      className="social-my-profile"
      aria-labelledby="social_my_profile_title"
      aria-busy={loading}
    >
      <h2 id="social_my_profile_title">내 프로필</h2>

      {loading ? (
        <p role="status">내 프로필을 불러오는 중입니다.</p>
      ) : error ? (
        <div>
          <p className="social-profile-error" role="alert">
            {error}
          </p>
          <button
            className="social-profile-button"
            type="button"
            onClick={() => setRetry((value) => value + 1)}
          >
            다시 불러오기
          </button>
        </div>
      ) : profile ? (
        <div className="social-my-profile-content">
          {profile.avatarUrl && !imageFailed ? (
            <img
              className="social-my-profile-avatar"
              src={profile.avatarUrl}
              alt={`${profile.nickname || "Steam 사용자"}의 프로필 사진`}
              width="80"
              height="80"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span
              className="social-my-profile-avatar social-my-profile-placeholder"
              aria-label="프로필 사진 없음"
            >
              {(profile.nickname || "?").slice(0, 1)}
            </span>
          )}

          <strong className="social-my-profile-name">
            {profile.nickname || "Steam 사용자"}
          </strong>

          {profile.profileUrl && (
            <a
              className="social-profile-button social-profile-link"
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Steam 프로필로 이동 ↗
            </a>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default SteamProfileCard;