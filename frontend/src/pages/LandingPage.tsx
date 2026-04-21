import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stoxly.css";

type LandingTheme = "dark" | "light";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function inv(a: number, b: number, v: number) {
  return clamp((v - a) / (b - a), 0, 1);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function ease(t: number) {
  // Smooth cubic-bezier easing curve: cubic-bezier(0.25, 0.46, 0.45, 0.94)
  return t < 0.5
    ? 2 * t * t * (3 - 2 * t)
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function quantize(v: number, step: number) {
  return Math.round(v / step) * step;
}

function setStyle(
  el: HTMLElement,
  prop: "opacity" | "top" | "left" | "fontSize" | "transform" | "background",
  value: string
) {
  if (el.style[prop] !== value) {
    el.style[prop] = value;
  }
}

function getBaseFS() {
  return Math.min(window.innerWidth * 0.16, 200);
}

export function LandingPage() {
  const navigate = useNavigate();
  const theme: LandingTheme = "light";
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimerRef = useRef<number | null>(null);

  const goToAuthSmooth = () => {
    if (isLeaving) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      navigate("/auth");
      return;
    }

    setIsLeaving(true);
    leaveTimerRef.current = window.setTimeout(() => {
      navigate("/auth");
    }, 520);
  };

  useEffect(() => {
    const ht = document.getElementById("htitle");
    const htag = document.getElementById("htagline");
    const shint = document.getElementById("shint");
    const nav = document.getElementById("nav");
    const nlogo = document.getElementById("nav-logo");
    const vdim = document.getElementById("vbg-dim");
    const bgvid = document.getElementById("bgvid") as HTMLVideoElement | null;

    if (!ht || !htag || !shint || !nav || !nlogo || !vdim || !bgvid) {
      return;
    }

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let lowPowerMode =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth <= 920 ||
      connection?.saveData === true;

    let raf = false;

    const run = () => {
      raf = false;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const p1 = vh * 0.45;
      const p2 = vh * 0.95;
      const bfs = getBaseFS();

      if (!lowPowerMode) {
        const d = inv(0, p2, sy);
        const dimAlpha = quantize(lerp(0.52, 0.64, d), 0.005);
        setStyle(vdim, "background", `rgba(6,6,10,${dimAlpha})`);
      } else {
        setStyle(vdim, "background", "rgba(6,6,10,0.58)");
      }

      if (sy <= 0) {
        setStyle(ht, "opacity", "1");
        setStyle(ht, "top", "50%");
        setStyle(ht, "left", "50%");
        setStyle(ht, "fontSize", `${bfs}px`);
        setStyle(ht, "transform", "translate(-50%,-50%)");
        setStyle(htag, "opacity", "1");
        setStyle(shint, "opacity", "1");
        setStyle(nlogo, "opacity", "0");
        nlogo.classList.remove("show");
        nav.classList.remove("glass");
        return;
      }

      if (sy <= p1) {
        const t = quantize(ease(inv(0, p1, sy)), 0.01);
        setStyle(htag, "opacity", `${1 - t}`);
        setStyle(shint, "opacity", `${1 - t}`);
        setStyle(ht, "opacity", "1");
        setStyle(nlogo, "opacity", "0");
        nlogo.classList.remove("show");
        nav.classList.remove("glass");
        return;
      }

      if (sy <= p2) {
        const t = quantize(ease(inv(p1, p2, sy)), 0.01);
        setStyle(htag, "opacity", "0");
        setStyle(shint, "opacity", "0");

        setStyle(ht, "top", `${lerp(vh * 0.5, 34, t)}px`);
        setStyle(ht, "left", "50%");
        setStyle(ht, "fontSize", `${lerp(bfs, 38, t)}px`);
        setStyle(ht, "transform", "translate(-50%,-50%)");
        setStyle(ht, "opacity", `${1 - t}`);

        setStyle(nlogo, "opacity", `${t}`);
        if (t > 0.96) {
          nlogo.classList.add("show");
        }
        if (t > 0.16) {
          nav.classList.add("glass");
        }
        return;
      }

      setStyle(ht, "opacity", "0");
      setStyle(nlogo, "opacity", "1");
      nlogo.classList.add("show");
      nav.classList.add("glass");
    };

    const onScroll = () => {
      if (!raf) {
        raf = true;
        window.requestAnimationFrame(run);
      }
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      lowPowerMode =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.innerWidth <= 920 ||
        connection?.saveData === true;
      run();
    };

    window.addEventListener("resize", onResize);
    run();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      revealObserver.disconnect();
      if (leaveTimerRef.current !== null) {
        window.clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`stx theme-${theme} ${isLeaving ? "route-leaving" : ""}`}>
      <div id="vbg">
        <video id="bgvid" autoPlay muted loop playsInline preload="metadata">
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/Video_Generation_Without_Bitcoin.mp4" type="video/mp4" />
        </video>
        <div id="vbg-dim" />
      </div>

      <nav id="nav">
        <div className="nav-side">
          <button className="nlnk btn-reset" onClick={goToAuthSmooth}>Login</button>
          <a className="nlnk" href="#feat-card">Features</a>
        </div>
        <a href="#" id="nav-logo">STOXLY<span className="g">.</span></a>
        <div className="nav-side r">
          <a className="nlnk" href="#how-card">How it Works</a>
          <button className="nbtn btn-reset" onClick={goToAuthSmooth}>Get Started</button>
        </div>
      </nav>

      <div id="page">
        <div id="hero-spacer" />

        <div className="tstrip">
          <div className="ttrack">
            {["AAPL +1.42%", "NVDA +2.88%", "TSLA -0.74%", "MSFT +0.95%", "GOOGL +0.64%", "AMZN +1.18%"]
              .concat(["AAPL +1.42%", "NVDA +2.88%", "TSLA -0.74%", "MSFT +0.95%", "GOOGL +0.64%", "AMZN +1.18%"]) 
              .map((item, i) => (
                <span key={i} className="ti">{item}<span className="sep">|</span></span>
              ))}
          </div>
        </div>

        <div className="vgap" />

        <div className="fcard rv" id="feat-card">
          <section className="sec">
            <p className="eyebrow">Features</p>
            <h2 className="sh">Precision Intelligence For <em>Serious Growth</em></h2>
            <div className="feat-grid">
              <article className="fc-card rv d1">
                <div className="fc-num">01</div>
                <h3 className="fc-title">Signal-Rich Analytics</h3>
                <p className="fc-body">Glass charts surface momentum, sentiment, and volatility in a single high-clarity view.</p>
                <div className="mock-wrap"><div className="mock"><div className="mock-bar"><span className="md mr" /><span className="md my" /><span className="md mg" /></div><div className="mock-body"><div className="chart-header"><span className="chart-title">Growth Pulse</span><span className="chart-val">$12,840</span></div><div className="chart-area"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0,26 L14,24 L22,17 L34,19 L44,14 L58,11 L66,13 L78,8 L90,9 L100,4" fill="none" stroke="#4DA2FF" strokeWidth="1.7" /></svg></div><div className="chart-labels"><span className="chart-label">MON</span><span className="chart-label">WED</span><span className="chart-label">FRI</span></div></div></div></div>
              </article>
              <article className="fc-card rv d2">
                <div className="fc-num">02</div>
                <h3 className="fc-title">Dark Portfolio Board</h3>
                <p className="fc-body">Track silver, stocks, and tech allocations in a premium Bloomberg-inspired interface.</p>
                <div className="mock-wrap"><div className="mock"><div className="mock-bar"><span className="md mr" /><span className="md my" /><span className="md mg" /></div><div className="mock-body"><div className="port-header"><span className="port-title">Asset Mix</span><span className="port-total">$84,200</span></div>{[["Silver", "24%", "+1.2%", "#94A3B8"], ["Stocks", "52%", "+3.4%", "#60A5FA"], ["Tech", "24%", "+4.1%", "#818CF8"]].map(([name, alloc, change, dot]) => (<div key={name} className="port-row"><span className="port-dot" style={{ background: dot }} /><span className="port-name">{name}</span><span className="port-alloc">{alloc}</span><div className="port-meta"><span className="port-val">$21.2k</span><span className="port-chg ug">{change}</span></div></div>))}</div></div></div>
              </article>
              <article className="fc-card rv d3">
                <div className="fc-num">03</div>
                <h3 className="fc-title">Why This Move?</h3>
                <p className="fc-body">Event-grade reasons behind each signal with market context, confidence, and source quality.</p>
                <div className="mock-wrap"><div className="mock"><div className="mock-bar"><span className="md mr" /><span className="md my" /><span className="md mg" /></div><div className="mock-body"><div className="why-tag">High Conviction</div><div className="why-item"><div className="why-item-top"><span className="why-ticker">NVDA</span><span className="why-chg-up">+2.8%</span></div><p className="why-news">Institutional flow increased in semiconductor basket.</p><p className="why-source">Source: Market Wire</p></div><div className="why-item"><div className="why-item-top"><span className="why-ticker">TSLA</span><span className="why-chg-dn">-0.7%</span></div><p className="why-news">Delivery guidance revised lower for current quarter.</p><p className="why-source">Source: Earnings Call</p></div></div></div></div>
              </article>
            </div>
          </section>
        </div>

        <div className="vgap" />

        <div className="fcard last rv" id="how-card">
          <section className="sec-sm">
            <p className="eyebrow">How It Works</p>
            <h2 className="sh">Clarity In Three Steps</h2>
            <div className="how-grid">
              <div className="steps">
                <article className="step"><span className="snum">01</span><div className="stxt"><h4>Set your profile</h4><p>Answer quick onboarding prompts on salary, savings, and horizon.</p></div></article>
                <article className="step"><span className="snum">02</span><div className="stxt"><h4>Build your watchlist</h4><p>Track only relevant stocks while suppressing broad market noise.</p></div></article>
                <article className="step"><span className="snum">03</span><div className="stxt"><h4>Act with confidence</h4><p>Use sentiment, activity spikes, and execution prompts in one flow.</p></div></article>
              </div>
              <aside className="dash-sticky"><div className="dmock"><div className="dm-bar"><span className="md mr" /><span className="md my" /><span className="md mg" /><span className="dm-url">stoxly.app/dashboard</span></div><div className="dm-nav"><span className="dm-brand">STOXLY</span><div className="dm-tabs"><span>Watchlist</span><span className="act">Signals</span><span>Allocation</span></div></div><div className="dm-body"><div className="dm-row"><div className="dmc"><p className="dmc-l">Portfolio</p><p className="dmc-v">$128,420</p><p className="dmc-c ug">+4.6%</p></div><div className="dmc"><p className="dmc-l">Risk</p><p className="dmc-v">Moderate</p><p className="dmc-c dg">-0.8%</p></div></div><div className="dig"><p className="dig-t">Today Signal</p><p className="dig-b">70% traders bullish on NVDA with unusual buy-side momentum.</p></div><div className="dmc"><div className="alr"><span className="aln">Sentiment</span><span className="alt"><span className="alf" style={{ width: "72%", background: "#4CAF79" }} /></span><span className="alp">72%</span></div><div className="alr"><span className="aln">Momentum</span><span className="alt"><span className="alf" style={{ width: "64%", background: "#60A5FA" }} /></span><span className="alp">64%</span></div></div></div></div></aside>
            </div>
          </section>

          <section className="cta-wrap" id="get-started">
            <h3 className="cta-h">Build Wealth With <em>Signal, Not Noise</em></h3>
            <p className="cta-sub">Join early access and get a personalized investment intelligence dashboard.</p>
            <button className="nbtn btn-reset" onClick={goToAuthSmooth}>Start Onboarding</button>
            <p className="cta-note">Educational use only. Not financial advice.</p>
          </section>
        </div>

        <footer>
          <div className="fb">STOXLY</div>
          <p className="fc">© 2026 Stoxly. All rights reserved.</p>
          <div className="fl"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </footer>
      </div>

      <div id="htitle">STOXLY<span className="gold">.</span></div>
      <div id="htagline">Know why markets move</div>
      <div id="shint"><div className="sline" /><span>Scroll</span></div>
    </div>
  );
}