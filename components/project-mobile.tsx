import { ArrowDownToLine, Navigation, Smartphone, Check } from "lucide-react";
import { cryptofolioCaptures } from "../lib/project-media";
import { ProjectCapture } from "./project-capture";

export function ProjectMobile() {
  return (
    <section className="case-mobile-section" id="mobile">
      <div className="case-mobile-copy">
        <span className="case-kicker">03 / BEYOND THE DESKTOP</span>
        <span className="pwa-badge">
          <Smartphone size={14} aria-hidden /> MOBILE & PWA
        </span>
        <h2>
          Your portfolio.
          <br />
          In your <em>pocket.</em>
        </h2>
        <p>
          The same workspace, rethought for a smaller screen. Portfolio cards
          stack naturally, actions stay within reach, and navigation is one tap
          away.
        </p>
        <ul className="mobile-capabilities">
          <li>
            <ArrowDownToLine size={19} aria-hidden />
            <div>
              <h3>An installable experience</h3>
              <p>
                Install prompts and standalone-mode detection are part of the
                app.
              </p>
            </div>
          </li>
          <li>
            <Navigation size={19} aria-hidden />
            <div>
              <h3>Navigation, within reach</h3>
              <p>
                A floating menu connects the dashboard, portfolios, markets,
                analysis, and alerts.
              </p>
            </div>
          </li>
          <li>
            <Check size={19} aria-hidden />
            <div>
              <h3>Designed to adapt</h3>
              <p>
                Responsive cards and controls keep the core experience usable on
                a phone.
              </p>
            </div>
          </li>
        </ul>
        <p className="mobile-validation-note">
          Captured in Edge at a fixed 440 × 956 CSS-pixel viewport. These are
          mobile browser views; standalone installation and offline operation
          have not been verified.
        </p>
      </div>
      <div className="case-mobile-devices">
        <div className="mobile-device mobile-device-one">
          <span className="device-speaker" aria-hidden />
          <ProjectCapture capture={cryptofolioCaptures.mobile} framed={false} />
        </div>
        <div className="mobile-device mobile-device-two">
          <span className="device-speaker" aria-hidden />
          <ProjectCapture
            capture={cryptofolioCaptures.navigation}
            framed={false}
          />
        </div>
        <span className="mobile-device-caption">
          ONE PRODUCT. MORE WAYS TO USE IT.
        </span>
      </div>
    </section>
  );
}
