import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  const fetchRecentLinks = async () => {
    try {
      const response = await axios.get(`${API_BASE}/links`);
      setLinks(response.data);
    } catch {
      setLinks([]);
    }
  };

  useEffect(() => {
    fetchRecentLinks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    setCopyStatus("");

    try {
      const payload = { originalUrl };
      if (customAlias.trim()) {
        payload.customAlias = customAlias.trim();
      }
      if (expiresInDays !== "") {
        payload.expiresInDays = Number(expiresInDays);
      }

      const response = await axios.post(`${API_BASE}/shorten`, payload);
      setShortUrl(response.data.shortUrl);
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresInDays("");
      await fetchRecentLinks();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Failed to shorten URL";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1200);
    } catch {
      setCopyStatus("Copy failed");
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Smart URL Shortener</h1>
        <p className="subtitle">Simple, fast and portfolio-ready project</p>

        <form onSubmit={handleSubmit} className="shorten-form">
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Custom alias (optional)"
            value={customAlias}
            onChange={(event) => setCustomAlias(event.target.value)}
          />
          <input
            type="number"
            min="1"
            max="365"
            placeholder="Expires in days (optional)"
            value={expiresInDays}
            onChange={(event) => setExpiresInDays(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && <p className="message error">{error}</p>}

        {shortUrl && (
          <div className="result">
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
            <button type="button" onClick={handleCopy}>
              Copy
            </button>
            {copyStatus && <span className="copy-status">{copyStatus}</span>}
            <img
              className="qr-preview"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(shortUrl)}`}
              alt="QR code for short URL"
            />
          </div>
        )}
      </section>

      <section className="card">
        <h2>Recent Links</h2>
        {links.length === 0 ? (
          <p className="empty">No links yet. Create your first short link.</p>
        ) : (
          <ul className="links-list">
            {links.map((item) => (
              <li key={item.id}>
                <div>
                  <p className="original">{item.originalUrl}</p>
                  <a href={item.shortUrl} target="_blank" rel="noreferrer">
                    {item.shortCode}
                  </a>
                  {item.customAlias && <p className="meta">Custom alias</p>}
                  {item.expiresAt && (
                    <p className="meta">
                      {item.isExpired
                        ? "Expired"
                        : `Expires: ${new Date(item.expiresAt).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <span>{item.clicks} clicks</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
