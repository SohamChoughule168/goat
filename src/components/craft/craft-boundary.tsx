"use client";

import { Component, type ReactNode } from "react";

interface CraftBoundaryProps {
  index: string;
  title: string;
  children: ReactNode;
}

interface CraftBoundaryState {
  failed: boolean;
}

/**
 * A station may fail; the page may not. Each bench gets its own boundary so a
 * broken renderer leaves the other ten runnable.
 */
export default class CraftBoundary extends Component<CraftBoundaryProps, CraftBoundaryState> {
  state: CraftBoundaryState = { failed: false };

  static getDerivedStateFromError(): CraftBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error(`[craft] station ${this.props.index} failed`, error);
  }

  render() {
    if (this.state.failed) {
      return (
        <article
          className="craft-station craft-station-failed"
          id={`station-${this.props.index}`}
          data-span="half"
          data-status="error"
        >
          <header className="craft-station-head">
            <span className="craft-station-index" aria-hidden="true">
              {this.props.index}
            </span>
            <div className="craft-station-heading">
              <p className="craft-station-skill">Station unavailable</p>
              <h2 className="craft-station-title">{this.props.title}</h2>
            </div>
            <span className="craft-station-badge" data-state="error">
              Failed
            </span>
          </header>
          <div className="craft-stage" data-live="false">
            <div className="craft-failed-panel">
              <p>This station failed independently. The other ten are unaffected.</p>
              <p className="craft-failed-note">Reload the page to try again.</p>
            </div>
          </div>
          <p className="craft-figure">
            <span>Fig. {this.props.index}</span>
            Poster unavailable after a render failure.
          </p>
        </article>
      );
    }

    return this.props.children;
  }
}
