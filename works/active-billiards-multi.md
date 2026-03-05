---
layout: default
title: "Active Billiards: Extracting Work from a Nonequilibrium Process"
---

# Active Billiards: Extracting Work from a Nonequilibrium Process

*A simulation of active particles bouncing off a ratcheted wheel — a minimal model for nonequilibrium work extraction.*

[GitHub: active-billiards-multi](https://github.com/yeonsu-jung/active-billiards-multi)

---

## The question

Can a macroscopic object (a rotor) extract net rotational work from a bath of active particles, even when the particles themselves have no preferred direction? This is a question at the heart of **nonequilibrium statistical mechanics** and active matter physics.

The answer, in the right setup, is yes — and the key ingredient is **broken spatial symmetry** (the ratchet) combined with the **non-thermal statistics** of active particles.

## The model

The simulation implements a 2D billiards-like setup:

- **Active particles** move in a bounded domain with quadratic drag. Their velocities follow an **AR(1) process** (a discrete-time autoregressive process), giving them persistent motion with exponentially decaying correlations. This is a minimal model for run-and-tumble bacteria or self-propelled colloids.

- A **central ratcheted wheel** sits at the center of the domain. The wheel has asymmetric teeth — it is easy to rotate in one direction but resists rotation in the other. This breaks the left-right symmetry of the system.

- Collisions between particles and the wheel (and between particles) are **elastic**: momentum is conserved at each collision. The wheel accumulates angular momentum over many collisions, and this net rotation is the extracted work.

## Why AR(1)?

A passive particle in thermal equilibrium at temperature $$T$$ has velocity fluctuations with flat power spectrum (white noise). An AR(1) process, in contrast, has **colored noise** — velocity correlations persist over a characteristic time $$\tau$$. This mimics the persistence length of biological swimmers and distinguishes active from passive fluctuations.

The AR(1) process is parameterized by its correlation time and noise amplitude:

$$v(t+dt) = (1 - dt/\tau) v(t) + \sigma \sqrt{2dt/\tau} \, \xi(t)$$

where $$\xi(t)$$ is white noise. Longer $$\tau$$ means more directed (ballistic) motion; $$\tau \to 0$$ recovers Brownian motion.

## Implementation

- C++ simulation for performance (large particle counts, many collisions per second)
- Python batch analysis (`batch_run.py`) for parameter sweeps
- High-resolution frame export (up to 7200px, 600 DPI) for publication figures
- Velocity time-series logging for computing power spectra and transport coefficients

## Physical picture

At equilibrium (passive particles, $$\tau \to 0$$), detailed balance forbids net rotation: the Second Law wins and the ratchet does not turn. With active particles (finite $$\tau$$), detailed balance is broken and the ratchet can sustain rotation. The rotation rate as a function of $$\tau$$, particle density, and ratchet geometry characterizes the nonequilibrium work extraction.

This setup is a minimal model for understanding how biological molecular motors might extract work from the active fluctuations of the cytoplasm — a question of both fundamental and practical interest.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
