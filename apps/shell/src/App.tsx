import { useEffect, useRef } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router';
import { IssueDetails, IssueFeed, ReportIssue } from '@ecocivic/issues-mfe';

export function App() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    main.current?.focus();
    window.scrollTo(0, 0);
    document.title =
      pathname === '/issues/new' ? 'Report an issue · EcoCivic' : 'Community issues · EcoCivic';
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/issues" aria-label="EcoCivic home">
            <span className="brand-mark" aria-hidden="true">
              ↗
            </span>
            Eco<span>Civic</span>
            <span className="brand-dot">.</span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/issues" end>
              Community reports
            </NavLink>
            <NavLink to="/about">Our mission</NavLink>
          </nav>
          <Link className="button header-cta" to="/issues/new">
            <span aria-hidden="true">＋</span> Report an issue
          </Link>
        </div>
      </header>
      <div className="demo-strip">
        <span className="demo-pill">DEMO</span>
        <span>
          A little local action, a lot of possibility.{' '}
          <strong>Sample data · reports saved on this browser.</strong>
        </span>
      </div>
      <main id="main" ref={main} tabIndex={-1} className="main-container">
        <Routes>
          <Route path="/" element={<Navigate replace to="/issues" />} />
          <Route path="/issues" element={<IssueFeed />} />
          <Route path="/issues/new" element={<ReportIssue />} />
          <Route path="/issues/:issueId" element={<IssueDetails />} />
          <Route
            path="/about"
            element={
              <section className="mission panel">
                <p className="eyebrow">OUR SHARED HOME</p>
                <h1>
                  Better places.
                  <br />
                  Built together.
                </h1>
                <p>
                  EcoCivic helps neighbours bring environmental and civic issues into the open,
                  follow their progress, and make local action easier.
                </p>
                <h2>Notice. Report. Follow through.</h2>
                <p>
                  Start with a clear report about a public place. Over time, community
                  confirmations, volunteering, and verified impact will help turn observations into
                  lasting improvements.
                </p>
                <p className="demo-note">
                  This early demo uses fictional reports and browser storage. It is not connected to
                  a civic authority.
                </p>
                <Link className="button" to="/issues">
                  Explore community reports →
                </Link>
              </section>
            }
          />
          <Route
            path="*"
            element={
              <section className="state-panel">
                <h1>This page isn’t here</h1>
                <p>Let’s get you back to your community.</p>
                <Link className="button" to="/issues">
                  Back to reports
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">EcoCivic.</span>
        <p>Better neighbourhoods begin with people who care.</p>
        <span>
          Built for a greener tomorrow <span aria-hidden="true">↗</span>
        </span>
      </footer>
    </>
  );
}
