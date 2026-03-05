---
layout: default
title: "Entanglement Optimization"
---

# Entanglement Optimization

*Maximizing topological entanglement in rod configurations via gradient-based optimization — in both C++ and JAX.*

[GitHub: entanglement-optimization-cpp](https://github.com/yeonsu-jung/entanglement-optimization-combined) &nbsp;|&nbsp; [GitHub: entanglement-optimization (JAX)](https://github.com/yeonsu-jung/entanglement-optimization-combined)

---

## What is the problem?

Given a collection of rigid rods in 3D, what configuration maximizes their mutual entanglement? This is an **inverse design** problem: instead of simulating a physical process and observing the outcome, we directly search for configurations that optimize a chosen entanglement metric.

The natural metric is the **linking number** $$Lk$$, which counts (with sign) how many times two curves wind around each other. For a pair of rods $$i$$ and $$j$$, this is computed via the Gauss linking integral:

$$Lk(i, j) = \frac{1}{4\pi} \oint \oint \frac{(d\mathbf{r}_i \times d\mathbf{r}_j) \cdot (\mathbf{r}_i - \mathbf{r}_j)}{|\mathbf{r}_i - \mathbf{r}_j|^3}$$

Maximizing the total $$\sum_{i < j} |Lk(i,j)|$$ subject to constraints (no rod overlap, bounded domain) gives the maximally entangled packing.

## Two implementations

### C++ version (`entanglement-optimization-cpp`)

The C++ implementation uses a gradient ascent approach with several protocols:

- **`lk`** — Headless maximization of $$|Lk|$$ from random initializations
- **`packing`** — Packing optimization with linking number as the objective
- **`angles`** — Maximize the minimum inter-rod angle (geometric diversity)
- **`sweep`** — Batch experiments driven by JSON parameter files
- **`small`** — Small-scale demo with overlapping rods for debugging and visualization

The build system uses CMake with auto-build capability, and a Python helper `protocols.py` standardizes headless execution and metric parsing. Experiments are logged with timestamps for reproducibility.

### JAX version (`entanglement-optimization`)

The JAX implementation brings automatic differentiation to the same problem. Because JAX can differentiate through the Gauss integral numerically, we get exact gradients without manual derivation. This enables:

- Rapid prototyping of new objective functions
- GPU acceleration for large ensembles
- Clean composition of constraints (e.g., fixed endpoints, excluded volume)

The JAX version also serves as a reference implementation against which the C++ code is validated.

## Optimization strategy

Both implementations use gradient-based methods. The objective landscape is non-convex and has many local maxima — configurations that are "locally entangled" but not globally optimal. To escape local optima, we use:

- Random restarts (multiple initializations)
- Jitter in no-constraint mode (controlled noise injection)
- Simulated annealing schedules

## What we found

The maximally entangled configurations found by optimization are structurally distinct from random packings. They exhibit a particular orientation distribution and spatial correlation. Importantly, the **caging number** — a metric we developed — is a better predictor of mechanical stability than $$Lk$$ alone. High $$Lk$$ does not guarantee stability; what matters is whether each rod is geometrically constrained by its neighbors in all directions.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
