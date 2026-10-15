import { useEffect, useRef, useState } from "react";
import {
  getSteamApiKeyStatus,
  registerSteamApiKey,
} from "../services/steamApiKeyService";
import { useLanguage } from "../contexts/LanguageContext";

function SteamApiKeyPanel({
  children,
  description = "프로필과 친구 정보를 조회하려면 API 키를 등록해 주세요.",
}) {
  const { t } = useLanguage();
  const [loadStatus, setLoadStatus] = useState("loading");
  const [usable, setUsable] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const submitRequest = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoadStatus("loading");
    setError("");

    getSteamApiKeyStatus({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;

        setUsable(data.usable === true);
        setLoadStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;

        setError(error.message || "등록 상태를 확인하지 못했습니다.");
        setLoadStatus("error");
      });

    return () => {
      controller.abort();
      submitRequest.current?.abort();
    };
  }, [retry]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 연속 클릭으로 중복 등록 요청을 보내지 않음
    if (submitRequest.current) return;

    const controller = new AbortController();
    submitRequest.current = controller;
    setSaving(true);
    setError("");

    try {
      const data = await registerSteamApiKey(apiKey, {
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (data.usable !== true) {
        throw new Error("API 키 등록 결과를 확인해 주세요.");
      }

      setApiKey("");
      setUsable(true);
    } catch (error) {
      if (controller.signal.aborted) return;

      setError(error.message || "API 키를 등록하지 못했습니다.");
    } finally {
      if (submitRequest.current === controller) {
        submitRequest.current = null;
      }

      if (!controller.signal.aborted) {
        setSaving(false);
      }
    }
  };

  if (loadStatus === "loading") {
    return (
      <section className="steam-api-key-panel">
        <p role="status">{t("API 키 등록 상태를 확인하는 중입니다.")}</p>
      </section>
    );
  }

  if (loadStatus === "error") {
    return (
      <section className="steam-api-key-panel">
        <p className="steam-api-key-error" role="alert">{t(error)}</p>
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
        >
          {t("다시 확인")}
        </button>
      </section>
    );
  }

    if (usable) {
      return (
        <>
          <section className="steam-api-key-panel">
            <h2>{t("Steam API 연결")}</h2>
            <p className="steam-api-key-success" role="status">
              {t("사용 가능한 API 키가 등록되어 있습니다.")}
            </p>
          </section>

          {children}
        </>
      );
    }

  return (
    <section
      className="steam-api-key-panel"
      aria-labelledby="steam_api_key_title"
    >
      <h2 id="steam_api_key_title">{t("Steam API 키 등록")}</h2>
      <p>{t(description)}</p>

      <a
        href="https://steamcommunity.com/dev/apikey"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("Steam에서 API 키 확인하기")}
      </a>

      <form onSubmit={handleSubmit} aria-busy={saving}>
        <label htmlFor="steam_api_key_input">{t("Steam API 키")}</label>
        <input
          id="steam_api_key_input"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          autoComplete="new-password"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={t("32자리 API 키")}
          disabled={saving}
          required
        />

        <button
          type="submit"
          disabled={saving || !apiKey.trim()}
        >
          {t(saving ? "검증 및 등록 중…" : "API 키 등록")}
        </button>

        {error && (
          <p className="steam-api-key-error" role="alert">
            {t(error)}
          </p>
        )}
      </form>
    </section>
  );
}

export default SteamApiKeyPanel;
