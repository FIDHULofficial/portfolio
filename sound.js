/* ================================================================
   FIDHUL KRISHNA — sound.js  (v3 — Premium Edition)
   Web Audio API sound engine. Philosophy: sounds that are FELT,
   not heard. Organic, warm, cinematic. No beeps. No game chirps.

   DESIGN LANGUAGE: Luxury / High-End Interactive
   ─ Inspired by: Apple Spatial Audio, Accenture Motion Design,
     Awwwards SOTD sites, premium fintech & automotive UIs.

   SOUNDS:
   — introBGM()      : 5.5s cinematic score  [kept & refined]
   — softAir()       : hover — micro air-brush on glass
   — softThump()     : btn click — padded luxury press
   — pageBreath()    : nav transition — airy soft whoosh
   — crystalReveal() : scroll reveal — warm bell shimmer [user loves]
   — warmConfirm()   : filter activate — soft single bell tone
   — toggle()        : mute / unmute [silent indicator only]
   ================================================================ */

class SoundEngine {

    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.muted = false;
        this.ready = false;
    }

    // ── Unlock on first user gesture ─────────────────────────────
    unlock() {
        if (this.ready) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.78;
        this.masterGain.connect(this.ctx.destination);
        this.ready = true;
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    get _t() { return this.ctx ? this.ctx.currentTime : 0; }

    // ─────────────────────────────────────────────────────────────
    // LOW-LEVEL PRIMITIVES  (internal — not called directly)
    // ─────────────────────────────────────────────────────────────

    /* Sine/triangle oscillator with soft ADSR */
    _tone(type, freq, start, dur, peakGain, attack, release) {
        if (!this.ready || this.muted) return;
        const atk = attack  || Math.min(0.012, dur * 0.1);
        const rel = release || dur * 0.6;
        const osc = this.ctx.createOscillator();
        const g   = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.0001, start);
        g.gain.linearRampToValueAtTime(peakGain, start + atk);
        g.gain.setValueAtTime(peakGain, start + dur - rel);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + dur + 0.02);
    }

    /* Slow-swell oscillator — for pads & beds */
    _pad(type, freq, start, dur, peak, attack) {
        if (!this.ready || this.muted) return;
        const osc = this.ctx.createOscillator();
        const g   = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(peak, start + attack);
        g.gain.setValueAtTime(peak, start + dur - 0.6);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + dur + 0.05);
    }

    /* Filtered sawtooth — bowed strings / opening swell */
    _saw(freq, start, dur, peak, attack, f0, f1) {
        if (!this.ready || this.muted) return;
        const osc    = this.ctx.createOscillator();
        const filt   = this.ctx.createBiquadFilter();
        const g      = this.ctx.createGain();
        osc.type     = 'sawtooth';
        osc.frequency.value = freq;
        filt.type    = 'lowpass';
        filt.Q.value = 0.5;
        filt.frequency.setValueAtTime(f0, start);
        filt.frequency.exponentialRampToValueAtTime(f1, start + dur - 0.3);
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(peak, start + attack);
        g.gain.setValueAtTime(peak, start + dur - 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + dur + 0.05);
    }

    /* Filtered white noise burst */
    _noise(start, dur, peak, hz, q) {
        if (!this.ready || this.muted) return;
        const len  = Math.ceil(this.ctx.sampleRate * (dur + 0.05));
        const buf  = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d    = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const src  = this.ctx.createBufferSource();
        src.buffer = buf;
        const filt = this.ctx.createBiquadFilter();
        filt.type  = q < 0.8 ? 'lowpass' : 'bandpass';
        filt.frequency.value = hz;
        filt.Q.value = q;
        const g    = this.ctx.createGain();
        g.gain.setValueAtTime(peak, start);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        src.connect(filt);
        filt.connect(g);
        g.connect(this.masterGain);
        src.start(start);
        src.stop(start + dur + 0.05);
    }

    // ─────────────────────────────────────────────────────────────
    // CINEMATIC INTRO BGM
    // Plays for ~5.5 s on first user gesture.
    // Zimmer-class: deep bass + pad swell + string texture + impact.
    // ─────────────────────────────────────────────────────────────
    introBGM() {
        if (!this.ready) return;
        const t = this._t;

        // Sub-bass foundation (E1 = 41.2 Hz) — slow swell
        this._pad('sine', 41.2,  t,       5.2, 0.16, 2.2);
        this._pad('sine', 82.4,  t + 0.2, 4.8, 0.09, 2.5);
        this._pad('sine', 61.74, t + 0.5, 4.5, 0.07, 3.0);

        // Harmonic pad — detuned ensemble warmth
        [165.0, 164.2, 165.8, 247.5, 330.0].forEach((f, i) => {
            this._pad('sine', f, t + 0.8 + i * 0.15, 4.2 - i * 0.1,
                [0.04, 0.035, 0.03, 0.02, 0.018][i], 2.8);
        });

        // String swell — sawtooth opening through lowpass
        this._saw(82.4, t + 1.0, 3.8, 0.045, 2.2, 120, 900);
        this._saw(165,  t + 1.5, 3.2, 0.025, 2.5, 200, 1200);

        // Tension note — ♭VII against E root (Zimmer dread)
        this._pad('triangle', 73.4, t + 2.2, 2.8, 0.022, 1.8);

        // Air texture
        this._noise(t + 1.0, 2.5, 0.015, 200, 0.2);
        this._noise(t + 1.5, 1.5, 0.008, 800, 0.4);

        // Cinematic IMPACT at ~4.3 s — deep BOOM
        this._tone('sine', 80, t + 4.3, 0.75, 0.22, 0.01, 0.6);
        this._pad('sine', 55, t + 4.3, 0.8, 0.12, 0.05);
        this._noise(t + 4.3,  0.35, 0.09, 500,  0.3);
        this._noise(t + 4.4,  0.25, 0.04, 3500, 0.5);
        this._pad('sine', 1600, t + 4.35, 0.6, 0.012, 0.1);
    }

    // ─────────────────────────────────────────────────────────────
    // UI SOUNDS — Premium Edition
    // ─────────────────────────────────────────────────────────────

    /*
     * softAir()  — Hover micro-texture
     * What you hear: Almost nothing. A whisper of filtered air,
     *   like a finger barely touching frosted glass.
     * Design ref: Stripe, Linear, Vercel hover interactions.
     */
    softAir() {
        if (!this.ready || this.muted) return;
        const t = this._t;
        // Ultra-low sine shimmer at 1050 Hz — barely audible warmth
        this._tone('sine', 1050, t, 0.055, 0.014, 0.004, 0.04);
        // Sub-whisper of air below 300 Hz
        this._noise(t, 0.04, 0.005, 280, 0.15);
    }

    /*
     * softThump()  — Button / CTA click
     * What you hear: A padded, weighted press — like a high-end
     *   trackpad click or a luxury key switch. No metallic noise.
     * Design ref: Apple Magic Keyboard, premium automotive UI.
     */
    softThump() {
        if (!this.ready || this.muted) return;
        const t = this._t;
        // Low body — 90 Hz sine drops to 60 Hz = weight & finality
        this._tone('sine', 90, t, 0.12, 0.07, 0.005, 0.09);
        this._tone('sine', 60, t + 0.01, 0.10, 0.04, 0.008, 0.08);
        // Very soft high warmth — 1.8 kHz sine for presence
        this._tone('sine', 1800, t, 0.028, 0.009, 0.003, 0.02);
        // Air — barely any noise, just organic texture
        this._noise(t, 0.06, 0.018, 600, 0.25);
    }

    /*
     * pageBreath()  — Nav link / page-level transition
     * What you hear: A soft breath or whoosh. Like turning a page
     *   in silence — direction, not click.
     * Design ref: Awwwards SOTD sites, Stripe Atlas, Ramp UI.
     */
    pageBreath() {
        if (!this.ready || this.muted) return;
        const t = this._t;
        // Filtered noise swept from low → high = "exhale" sensation
        this._noise(t, 0.12, 0.022, 340, 0.18);
        this._noise(t + 0.04, 0.09, 0.012, 720, 0.22);
        // Subtle low sine anchors the breath
        this._tone('sine', 220, t, 0.09, 0.018, 0.008, 0.07);
    }

    /*
     * crystalReveal()  — Scroll intersection reveal
     * What you hear: A warm, crystalline shimmer — as if something
     *   materialises from light. This is the one the user loves.
     *   Refined: softer attack, longer warm decay, richer harmonics.
     * Design ref: Apple Vision Pro UI, Figma Auto Layout reveal.
     */
    crystalReveal() {
        if (!this.ready || this.muted) return;
        const t = this._t;
        // Root — warm sine at 880 Hz (A5) — soft bell body
        this._tone('sine', 880, t, 0.55, 0.022, 0.008, 0.42);
        // Octave up at 1760 Hz — crystalline shimmer
        this._tone('sine', 1760, t + 0.015, 0.50, 0.012, 0.006, 0.38);
        // Perfect fifth below — 587 Hz (D5) — depth & warmth
        this._tone('sine', 587, t + 0.008, 0.45, 0.014, 0.010, 0.35);
        // Ghost sub — 440 Hz (A4) — ambient warmth under the bell
        this._tone('sine', 440, t, 0.38, 0.010, 0.015, 0.30);
        // Air shimmer burst at reveal moment — like striking glass
        this._noise(t, 0.025, 0.015, 2400, 0.6);
    }

    /*
     * warmConfirm()  — Filter/toggle activate
     * What you hear: A single warm bell tone. Soft confirmation —
     *   not two beeps, not a game "ding-ding". Just presence.
     * Design ref: iOS notification bell, Notion block toggle.
     */
    warmConfirm() {
        if (!this.ready || this.muted) return;
        const t = this._t;
        // Single bell tone — 660 Hz E5 — warm and round
        this._tone('sine', 660, t, 0.40, 0.020, 0.006, 0.32);
        // Subtle harmonic at 990 Hz (perfect 5th overtone) — richness
        this._tone('sine', 990, t + 0.01, 0.35, 0.010, 0.008, 0.28);
        // Sub breath — just body
        this._tone('sine', 220, t, 0.28, 0.008, 0.012, 0.25);
    }

    /*
     * toggle()  — Mute/unmute  (sound indicator only, no UI blip)
     * The visual icon change tells the user — audio feedback is
     * intentionally minimal for this control.
     */
    _muteIndicator(on) {
        if (!this.ready) return;
        const t = this._t;
        // Two-frequency identity tone: up = on, down = off
        if (on) {
            this._tone('sine', 440, t,       0.12, 0.018, 0.006, 0.09);
            this._tone('sine', 660, t + 0.09, 0.10, 0.014, 0.006, 0.08);
        } else {
            this._tone('sine', 440, t,        0.10, 0.016, 0.006, 0.08);
            this._tone('sine', 330, t + 0.07, 0.08, 0.012, 0.006, 0.07);
        }
    }

    toggle() {
        this.muted = !this.muted;
        if (this.muted) {
            this._muteIndicator(false);
            if (this.masterGain)
                this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
        } else {
            if (this.masterGain)
                this.masterGain.gain.setTargetAtTime(0.78, this.ctx.currentTime, 0.06);
            this._muteIndicator(true);
        }
        return this.muted;
    }

    // ── Legacy aliases (wired in script.js — keep them pointing
    //    to the new premium functions so no JS changes needed) ─────
    hoverBlip()      { this.softAir();      }
    btnClick()       { this.softThump();    }
    navClick()       { this.pageBreath();   }
    filterActivate() { this.warmConfirm();  }
    revealPing()     { this.crystalReveal(); }
}

const SE = new SoundEngine();
