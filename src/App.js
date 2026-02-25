import { useState, useEffect, useRef } from "react";

const WEEKENDS = [
  { id: "aug14", label: "August 14–16", short: "Aug 14–16" },
  { id: "aug21", label: "August 21–23", short: "Aug 21–23" },
  { id: "aug28", label: "August 28–30", short: "Aug 28–30" },
  { id: "sep4", label: "September 4–6", short: "Sep 4–6" },
];

const CITIES = [
  {
    id: "cleveland",
    label: "Cleveland",
    subtitle: "Cleveland Electric Company Hosted",
  },
  {
    id: "indianapolis",
    label: "Indianapolis",
    subtitle: "Fast cars and fast women",
  },
  {
    id: "seattle",
    label: "Seattle",
    subtitle: "A promised feast on draft day",
  },
  { id: "denver", label: "Denver", subtitle: "Where Tony quit golf" },
  {
    id: "philadelphia",
    label: "Philadelphia",
    subtitle: "Maybe, just maybe X comes",
  },
];

const REACTIONS = ["😂", "🔥", "🐍"];

const C = {
  bg: "#f4f3f0",
  surface: "#ffffff",
  card: "#f9f8f6",
  cardHover: "#f0eeea",
  cardActive: "#faf5e8",
  border: "#ddd9d2",
  borderLight: "#e8e5df",
  gold: "#b8860b",
  goldLight: "#a0780a",
  goldDark: "#7a5a08",
  brown: "#5c3d1a",
  brownLight: "#8a7259",
  white: "#1a1a1a",
  muted: "#6b6960",
  mutedLight: "#8a877f",
  danger: "#c0392b",
};

function RankList({ items, onReorder, renderItem }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const dragNode = useRef(null);

  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    dragNode.current = e.target;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = "0.4";
    }, 0);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIdx !== idx) setOverIdx(idx);
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const next = [...items];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(overIdx, 0, moved);
      onReorder(next);
    }
    setDragIdx(null);
    setOverIdx(null);
    dragNode.current = null;
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onReorder(next);
  };

  const moveDown = (idx) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onReorder(next);
  };

  const getStyle = (idx) => {
    const isDrag = dragIdx === idx;
    const isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx;
    return {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 16px",
      background: isDrag ? C.cardActive : isOver ? C.cardHover : C.card,
      border: `1.5px solid ${isOver ? C.gold : C.border}`,
      borderRadius: 12,
      cursor: "grab",
      transition:
        "background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s",
      transform: isOver ? "scale(1.02)" : "scale(1)",
      boxShadow: isOver ? `0 0 12px ${C.gold}30` : "none",
      userSelect: "none",
      WebkitUserSelect: "none",
    };
  };

  const rankColors = [C.gold, "#7a7a7a", "#a0652a", C.mutedLight, C.muted];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={handleDragEnd}
          style={getStyle(idx)}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: idx === 0 ? 20 : 16,
              color: rankColors[idx] || C.muted,
              minWidth: 32,
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            {idx === 0 ? "👑" : `${idx + 1}`}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>{renderItem(item, idx)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveUp(idx);
              }}
              disabled={idx === 0}
              style={{
                background: "none",
                border: "none",
                color: idx === 0 ? C.border : C.mutedLight,
                cursor: idx === 0 ? "default" : "pointer",
                fontSize: 16,
                padding: "4px 8px",
                lineHeight: 1,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => idx > 0 && (e.target.style.color = C.gold)}
              onMouseLeave={(e) =>
                idx > 0 && (e.target.style.color = C.mutedLight)
              }
            >
              ▲
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveDown(idx);
              }}
              disabled={idx === items.length - 1}
              style={{
                background: "none",
                border: "none",
                color: idx === items.length - 1 ? C.border : C.mutedLight,
                cursor: idx === items.length - 1 ? "default" : "pointer",
                fontSize: 16,
                padding: "4px 8px",
                lineHeight: 1,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                idx < items.length - 1 && (e.target.style.color = C.gold)
              }
              onMouseLeave={(e) =>
                idx < items.length - 1 && (e.target.style.color = C.mutedLight)
              }
            >
              ▼
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

async function load(key, shared = false) {
  try {
    const r = await window.storage.get(key, shared);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
}
async function save(key, val, shared = false) {
  try {
    await window.storage.set(key, JSON.stringify(val), shared);
  } catch (e) {
    console.error("Storage:", e);
  }
}

function StandingsSection({ title, items }) {
  const maxScore = items[0]?.score || 1;
  return (
    <div>
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: C.brownLight,
          letterSpacing: 1.5,
          margin: "0 0 10px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h3>
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            marginBottom: 5,
            background: i === 0 ? `${C.gold}18` : "transparent",
            borderRadius: 8,
            borderLeft:
              i === 0 ? `3px solid ${C.gold}` : "3px solid transparent",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${(item.score / maxScore) * 100}%`,
              background: `${C.gold}0a`,
              transition: "width 0.5s ease",
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              position: "relative",
              color: i === 0 ? C.gold : C.white,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {i === 0 ? "👑" : `#${i + 1}`}
          </span>
          <span
            style={{
              flex: 1,
              fontWeight: 600,
              fontSize: 15,
              position: "relative",
              color: i === 0 ? C.gold : C.white,
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              background: C.card,
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: 12,
              color: C.mutedLight,
              fontWeight: 700,
              position: "relative",
              border: `1px solid ${C.border}`,
            }}
          >
            {item.score} pts
          </span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("vote");
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [weekends, setWeekends] = useState(WEEKENDS);
  const [cities, setCities] = useState(CITIES);
  const [submitted, setSubmitted] = useState(false);
  const [feed, setFeed] = useState([]);
  const [votes, setVotes] = useState({});
  const [chat, setChat] = useState([]);
  const [chatMsg, setChatMsg] = useState("");
  const [chatPhoto, setChatPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitAnim, setSubmitAnim] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    (async () => {
      const user = await load("delfl-user");
      if (user) {
        setSavedName(user.name);
        setName(user.name);
        if (user.photo) setPhoto(user.photo);
        if (user.weekends) setWeekends(user.weekends);
        if (user.cities) setCities(user.cities);
        if (user.submitted) setSubmitted(true);
      }
      await refresh();
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  const refresh = async () => {
    const [f, v, c] = await Promise.all([
      load("delfl-feed", true),
      load("delfl-votes", true),
      load("delfl-chat", true),
    ]);
    if (f) setFeed(f);
    if (v) setVotes(v);
    if (c) setChat(c);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 80;
        canvas.getContext("2d").drawImage(img, 0, 0, 80, 80);
        setPhoto(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const QUIPS = [
    "just dropped their rankings. Bold.",
    "thinks they know something we don't.",
    "voted with supreme confidence.",
    "has entered the arena.",
    "submitted. No take-backs. (Just kidding.)",
    "has spoken. The prophecy unfolds.",
  ];
  const CHANGE_QUIPS = [
    "just changed their mind. Shocking.",
    "is flip-flopping harder than a politician.",
    "updated their vote. Trust issues?",
    "reconsidered. Growth? Or panic?",
  ];

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const n = name.trim();
    setSavedName(n);
    setSubmitted(true);
    setSubmitAnim(true);
    setTimeout(() => setSubmitAnim(false), 1200);
    const isChange = submitted;
    setConfirmMsg(
      isChange
        ? `✓ Vote updated, ${n}. The league sees your indecision.`
        : `✓ Vote recorded. The league thanks you, ${n}.`
    );
    setTimeout(() => setConfirmMsg(""), 5000);
    await save("delfl-user", {
      name: n,
      photo,
      weekends,
      cities,
      submitted: true,
    });
    const curVotes = (await load("delfl-votes", true)) || {};
    curVotes[n] = {
      weekends: weekends.map((w) => w.id),
      cities: cities.map((c) => c.id),
      photo,
      time: Date.now(),
    };
    await save("delfl-votes", curVotes, true);
    const curFeed = (await load("delfl-feed", true)) || [];
    const quips = isChange ? CHANGE_QUIPS : QUIPS;
    const quip = quips[Math.floor(Math.random() * quips.length)];
    const items = [
      {
        id: Date.now(),
        text: `${n} ${quip}`,
        time: Date.now(),
        type: "vote",
        voter: n,
      },
      {
        id: Date.now() + 1,
        text: `${n} ranked ${weekends[0].short} #1 weekend, ${cities[0].label} #1 city.`,
        time: Date.now(),
        type: "detail",
        voter: n,
      },
    ];
    if (cities[cities.length - 1].id === "denver")
      items.push({
        id: Date.now() + 2,
        text: `${n} just moved Denver to last. Again.`,
        time: Date.now(),
        type: "meme",
        voter: n,
      });
    await save("delfl-feed", [...items, ...curFeed].slice(0, 50), true);
    await refresh();
  };

  const sendChat = async () => {
    if ((!chatMsg.trim() && !chatPhoto) || !savedName) return;
    const cur = (await load("delfl-chat", true)) || [];
    await save(
      "delfl-chat",
      [
        ...cur,
        {
          id: Date.now(),
          name: savedName,
          photo,
          text: chatMsg.trim(),
          image: chatPhoto,
          time: Date.now(),
          reactions: {},
        },
      ].slice(-100),
      true
    );
    setChatMsg("");
    setChatPhoto(null);
    await refresh();
  };

  const addReaction = async (msgId, emoji) => {
    const cur = (await load("delfl-chat", true)) || [];
    const idx = cur.findIndex((m) => m.id === msgId);
    if (idx === -1) return;
    const msg = cur[idx];
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
    const rn = savedName || "Anon";
    msg.reactions[emoji] = msg.reactions[emoji].includes(rn)
      ? msg.reactions[emoji].filter((x) => x !== rn)
      : [...msg.reactions[emoji], rn];
    cur[idx] = msg;
    await save("delfl-chat", cur, true);
    await refresh();
  };

  const handleChatPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const s = Math.min(400 / img.width, 400 / img.height, 1);
        canvas.width = img.width * s;
        canvas.height = img.height * s;
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        setChatPhoto(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getTally = (type) => {
    const base = type === "weekends" ? WEEKENDS : CITIES;
    const scores = {};
    base.forEach((i) => {
      scores[i.id] = 0;
    });
    Object.values(votes).forEach((v) => {
      const r = v[type];
      if (!r) return;
      r.forEach((id, idx) => {
        scores[id] = (scores[id] || 0) + (r.length - idx);
      });
    });
    return base
      .map((i) => ({ ...i, score: scores[i.id] || 0 }))
      .sort((a, b) => b.score - a.score);
  };

  const timeAgo = (ts) => {
    const d = Date.now() - ts;
    if (d < 60000) return "just now";
    if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
    if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
    return `${Math.floor(d / 86400000)}d ago`;
  };

  const voterCount = Object.keys(votes).length;

  if (loading)
    return (
      <div
        style={{
          background: C.bg,
          color: C.white,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, color: C.gold, letterSpacing: 3 }}>
            LOADING...
          </div>
        </div>
      </div>
    );

  return (
    <div
      style={{
        background: C.bg,
        color: C.white,
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input::placeholder { color: ${C.muted}; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .fade-in { animation: slideUp 0.3s ease forwards; }
        .pulse { animation: pulse 0.6s ease; }
      `}</style>

      {/* Header */}
      <header
        style={{
          background: `linear-gradient(160deg, #8b6914 0%, #5c3d1a 100%)`,
          borderBottom: `3px solid ${C.gold}`,
          padding: "20px 20px 18px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 4,
            color: "#fff",
            margin: 0,
            textTransform: "uppercase",
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          BUNNATHON 2026
        </h1>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: "#d4c4a0",
            letterSpacing: 2,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Golf · Draft · Good Times · Bad Decisions
        </p>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${C.border}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: C.bg,
        }}
      >
        {[
          { id: "vote", label: "✅  Vote" },
          { id: "chaos", label: "📊  Feedback" },
          { id: "chat", label: "💬  Chat" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "14px 8px",
              background: tab === t.id ? C.surface : "transparent",
              color: tab === t.id ? C.goldLight : C.muted,
              border: "none",
              borderBottom:
                tab === t.id ? `3px solid ${C.gold}` : "3px solid transparent",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 2,
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 16px 120px" }}>
        {tab === "vote" && (
          <div className="fade-in">
            {/* Identity */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 22,
                marginTop: 22,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label style={{ cursor: "pointer", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: photo
                        ? `url(${photo}) center/cover`
                        : `linear-gradient(135deg, ${C.brown}, ${C.goldDark})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2.5px solid ${C.gold}`,
                      fontSize: 22,
                      transition: "transform 0.2s",
                      boxShadow: `0 0 16px ${C.gold}25`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {!photo && "📷"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    style={{ display: "none" }}
                  />
                </label>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.goldLight,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Enter Your DelFL Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tony, Big Dave, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      background: C.card,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.white,
                      fontSize: 16,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = C.gold)}
                    onBlur={(e) => (e.target.style.borderColor = C.border)}
                  />
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 15,
                      color: C.muted,
                      lineHeight: 1.4,
                    }}
                  >
                    Required to vote. Your name will be visible to all league
                    members.
                  </p>
                </div>
              </div>
            </div>

            {/* Weekends */}
            <div style={{ marginTop: 28 }}>
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.goldLight,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  margin: "0 0 4px",
                }}
              >
                📅 Rank Your Weekends
              </h2>
              <p style={{ color: C.muted, fontSize: 15, margin: "0 0 14px" }}>
                Drag to rank Best → Worst.
              </p>
              <RankList
                items={weekends}
                onReorder={setWeekends}
                renderItem={(item) => (
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 16,
                      color: C.white,
                    }}
                  >
                    {item.label}
                  </span>
                )}
              />
            </div>

            {/* Cities */}
            <div style={{ marginTop: 30 }}>
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.goldLight,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  margin: "0 0 4px",
                }}
              >
                🌐 Rank Your Cities
              </h2>
              <p style={{ color: C.muted, fontSize: 15, margin: "0 0 14px" }}>
                Drag to rank Most Wanted → Least Wanted.
              </p>
              <RankList
                items={cities}
                onReorder={setCities}
                renderItem={(item) => (
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 16,
                        color: C.white,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: C.brownLight,
                        marginTop: 2,
                      }}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className={submitAnim ? "pulse" : ""}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: 28,
                background: name.trim()
                  ? `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`
                  : C.card,
                color: name.trim() ? "#fff" : C.muted,
                border: name.trim() ? "none" : `1px solid ${C.border}`,
                borderRadius: 12,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                cursor: name.trim() ? "pointer" : "not-allowed",
                transition: "all 0.25s",
                boxShadow: name.trim() ? `0 4px 20px ${C.gold}40` : "none",
              }}
            >
              {submitted ? "🔄  UPDATE YOUR VOTE" : "🗳  SUBMIT YOUR VOTE"}
            </button>
            {confirmMsg && (
              <p
                className="fade-in"
                style={{
                  textAlign: "center",
                  color: C.gold,
                  fontSize: 14,
                  marginTop: 12,
                  fontWeight: 600,
                }}
              >
                {confirmMsg}
              </p>
            )}
          </div>
        )}

        {tab === "chaos" && (
          <div className="fade-in">
            {/* Standings */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 22,
                marginTop: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: C.goldLight,
                    letterSpacing: 1.5,
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  🏆 Current Standings
                </h2>
                <span
                  style={{
                    background: C.card,
                    padding: "5px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    color: C.mutedLight,
                    fontWeight: 700,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {voterCount} vote{voterCount !== 1 ? "s" : ""}
                </span>
              </div>
              {voterCount === 0 ? (
                <p
                  style={{
                    color: C.muted,
                    textAlign: "center",
                    padding: 24,
                    fontStyle: "italic",
                  }}
                >
                  No votes yet. Be the first to decide the league's fate.
                </p>
              ) : (
                <>
                  <StandingsSection
                    title="Weekend Leader"
                    items={getTally("weekends")}
                  />
                  <div style={{ height: 16 }} />
                  <StandingsSection
                    title="City Leader"
                    items={getTally("cities")}
                  />
                </>
              )}
              {voterCount > 0 && (
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 16,
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: C.brownLight,
                      letterSpacing: 1.5,
                      margin: "0 0 10px",
                      textTransform: "uppercase",
                    }}
                  >
                    Who's Voted
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {Object.entries(votes).map(([vn, v]) => (
                      <div
                        key={vn}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: C.card,
                          padding: "6px 12px",
                          borderRadius: 20,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {v.photo ? (
                          <img
                            src={v.photo}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                        ) : (
                          <span style={{ fontSize: 13 }}>🏈</span>
                        )}
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.white,
                          }}
                        >
                          {vn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feed */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 22,
                marginTop: 20,
              }}
            >
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.goldLight,
                  letterSpacing: 1.5,
                  margin: "0 0 16px",
                  textTransform: "uppercase",
                }}
              >
                📡 Live Feed
              </h2>
              {feed.length === 0 ? (
                <p
                  style={{
                    color: C.muted,
                    textAlign: "center",
                    padding: 24,
                    fontStyle: "italic",
                  }}
                >
                  The feed is quiet... too quiet.
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {feed.slice(0, 20).map((item, i) => {
                    const voterPhoto = item.voter && votes[item.voter]?.photo;
                    return (
                      <div
                        key={item.id}
                        className="fade-in"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "10px 14px",
                          background:
                            item.type === "meme" ? `${C.danger}15` : C.card,
                          borderRadius: 10,
                          borderLeft: `3px solid ${
                            item.type === "meme"
                              ? C.danger
                              : item.type === "detail"
                              ? C.brownLight
                              : C.gold
                          }`,
                          animationDelay: `${i * 0.03}s`,
                        }}
                      >
                        {voterPhoto ? (
                          <img
                            src={voterPhoto}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              objectFit: "cover",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                            alt=""
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 18,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {item.type === "meme"
                              ? "🔥"
                              : item.type === "detail"
                              ? "📊"
                              : "🗳"}
                          </span>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              color: C.white,
                              lineHeight: 1.5,
                            }}
                          >
                            {item.text}
                          </p>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: 11,
                              color: C.muted,
                            }}
                          >
                            {timeAgo(item.time)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "chat" && (
          <div className="fade-in">
            {/* Chat */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 22,
                marginTop: 22,
              }}
            >
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.goldLight,
                  letterSpacing: 1.5,
                  margin: "0 0 16px",
                  textTransform: "uppercase",
                }}
              >
                💬 League Chat
              </h2>
              <div
                style={{
                  maxHeight: 420,
                  overflowY: "auto",
                  marginBottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {chat.length === 0 && (
                  <p
                    style={{
                      color: C.muted,
                      textAlign: "center",
                      padding: 24,
                      fontStyle: "italic",
                    }}
                  >
                    Someone break the ice. Trash talk is encouraged.
                  </p>
                )}
                {chat.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      background: C.card,
                      borderRadius: 12,
                      padding: 14,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      {msg.photo ? (
                        <img
                          src={msg.photo}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                      ) : (
                        <span style={{ fontSize: 16 }}>🏈</span>
                      )}
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: C.goldLight,
                        }}
                      >
                        {msg.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: C.muted,
                          marginLeft: "auto",
                        }}
                      >
                        {timeAgo(msg.time)}
                      </span>
                    </div>
                    {msg.text && (
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 14,
                          color: C.white,
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.text}
                      </p>
                    )}
                    {msg.image && (
                      <img
                        src={msg.image}
                        style={{
                          maxWidth: "100%",
                          maxHeight: 200,
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                        alt=""
                      />
                    )}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {REACTIONS.map((emoji) => {
                        const count = msg.reactions?.[emoji]?.length || 0;
                        const mine =
                          msg.reactions?.[emoji]?.includes(savedName);
                        return (
                          <button
                            key={emoji}
                            onClick={() => addReaction(msg.id, emoji)}
                            style={{
                              background: mine ? `${C.gold}25` : C.surface,
                              border: `1px solid ${mine ? C.gold : C.border}`,
                              borderRadius: 16,
                              padding: "4px 10px",
                              cursor: "pointer",
                              fontSize: 14,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: C.white,
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.borderColor = C.gold)
                            }
                            onMouseLeave={(e) =>
                              !mine &&
                              (e.currentTarget.style.borderColor = C.border)
                            }
                          >
                            {emoji}
                            {count > 0 && (
                              <span style={{ fontSize: 11, fontWeight: 700 }}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {!savedName ? (
                <p
                  style={{
                    color: C.muted,
                    fontSize: 13,
                    textAlign: "center",
                    fontStyle: "italic",
                    padding: "8px 0",
                  }}
                >
                  Submit your vote first to unlock chat.
                </p>
              ) : (
                <div>
                  {chatPhoto && (
                    <div
                      style={{
                        position: "relative",
                        marginBottom: 10,
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={chatPhoto}
                        style={{ maxHeight: 80, borderRadius: 8 }}
                        alt=""
                      />
                      <button
                        onClick={() => setChatPhoto(null)}
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: C.danger,
                          border: "none",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          color: "#fff",
                          fontSize: 13,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <label
                      style={{
                        cursor: "pointer",
                        fontSize: 20,
                        padding: "9px 10px",
                        background: C.card,
                        borderRadius: 10,
                        border: `1px solid ${C.border}`,
                        transition: "border-color 0.15s",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = C.gold)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = C.border)
                      }
                    >
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleChatPhoto}
                        style={{ display: "none" }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Talk your talk..."
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      style={{
                        flex: 1,
                        padding: "11px 14px",
                        background: C.card,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 10,
                        color: C.white,
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = C.gold)}
                      onBlur={(e) => (e.target.style.borderColor = C.border)}
                    />
                    <button
                      onClick={sendChat}
                      style={{
                        padding: "11px 18px",
                        background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        letterSpacing: 1,
                        transition: "box-shadow 0.2s",
                        boxShadow: `0 2px 10px ${C.gold}30`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow = `0 4px 16px ${C.gold}50`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = `0 2px 10px ${C.gold}30`)
                      }
                    >
                      SEND
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
