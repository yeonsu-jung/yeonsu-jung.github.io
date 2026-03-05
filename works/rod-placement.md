---
layout: default
title: "Random Sequential Adsorption of 3D Rods"
---

# Random Sequential Adsorption of 3D Rods

*A computational study of how rods pack under sequential, irreversible placement — and what that reveals about entanglement transitions.*

[GitHub: rod-placement](https://github.com/yeonsu-jung/rod-placement)

---

## Background

**Random Sequential Adsorption (RSA)** is a classical model for irreversible deposition: objects are placed one at a time, uniformly at random, and accepted only if they do not overlap with previously placed objects. For spheres in 2D and 3D, RSA is well-studied. For **elongated rods in 3D with periodic boundary conditions**, the problem is richer — aspect ratio, orientation distribution, and density all interact to determine whether the packing becomes entangled.

This project implements an RSA simulation for 3D rods inside a periodic box, with the goal of measuring how packing statistics depend on rod geometry and density.

## Simulation setup

Rods are modeled as line segments (spherocylinders) with a given aspect ratio $$\ell / d$$. A rod is placed by:

1. Sampling a random center position uniformly in the periodic box
2. Sampling a random orientation from the unit sphere
3. Checking overlap with all previously placed rods
4. Accepting if no overlap; rejecting and retrying otherwise

The simulation tracks the **number of attempts per successful placement**, which diverges as the packing approaches jamming. The distribution of attempt counts is a sensitive probe of the local geometry and correlations.

## Key metrics

- **Attempts per rod**: How many random trials are needed to place each successive rod? This grows rapidly near the jamming density.
- **Attempts distribution**: The full histogram of attempts reveals the heterogeneity of available space.
- **Normalized cumulative analysis**: Comparing multiple runs with different random seeds or parameters.
- **Entanglement onset**: At what density does the packing first exhibit macroscopic entanglement?

## Workflow

The project is designed for high-throughput parametric studies on HPC clusters:

- `submit_from_parameter_sets.py` — Generates and submits SLURM jobs across a parameter grid (aspect ratio $$\times$$ target density)
- `post_analyze_attempts.py` — Analyzes a single completed run
- `combined_analysis.py` — Aggregates statistics across an ensemble of runs
- `process_collection.py` — Main tool for batch processing result collections

Large simulation outputs (`runs/`) are kept separate from lightweight analysis results (`analysis/`) to facilitate sharing and archiving.

## Findings in context

The RSA simulations feed into a larger picture of the **entanglement transition**. By varying aspect ratio and density, we map out the boundary between jammed-but-unentangled and jammed-and-entangled phases. The onset of entanglement in RSA packings correlates with the caging number crossing a threshold — a result consistent with equilibrium simulations and experiments on physical rod packings.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
