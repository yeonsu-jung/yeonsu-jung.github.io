---
layout: default
title: "DER Python: Discrete Elastic Rods in Python"
---

# DER Python: Discrete Elastic Rods in Python

*A Python/JAX implementation of the Discrete Elastic Rods (DER) framework, with an inextensibility plugin.*

[GitHub: der-python](https://github.com/yeonsu-jung/der-python) &nbsp;|&nbsp; [GitHub: icd-sap](https://github.com/yeonsu-jung/icd-sap)

---

## What is DER?

**Discrete Elastic Rods (DER)** is a computational method for simulating the mechanics of thin, flexible filaments — rods whose length is much greater than their cross-sectional diameter. Originally introduced by Bergou et al. (2008, 2010), DER represents a rod as a sequence of nodes and edges, with discrete analogs of curvature and twist defined on the edges. The elastic energy is then a sum of bending and twisting terms over all edges.

DER has become a standard tool in computer graphics (hair, cloth) and in physics/engineering (DNA, cilia, soft robots). It is fast, stable, and geometrically accurate — it preserves key differential-geometric invariants exactly on the discrete mesh, rather than merely approximating them in a limiting sense.

For more on the mathematical foundations, see the [overview of Discrete Differential Geometry](../notes/ddg-overview.html).

## This implementation

The `der-python` repository is an ongoing effort to bring DER to Python, with two goals:

1. **Accessibility**: Python is the lingua franca of scientific computing. Having DER in Python (rather than only C++ or MATLAB) lowers the barrier for researchers who want to prototype, visualize, and analyze filament mechanics without writing C++.

2. **Differentiability**: By implementing DER in **JAX**, the entire simulation becomes differentiable. This opens the door to gradient-based inverse design: given a target shape, find the rest configuration, material parameters, or boundary conditions that produce it.

### Core features

- Node-based rod representation with edges and material frames
- Discrete curvature and twist computation
- Bending and twisting elastic energy (Kirchhoff rod model)
- FIRE optimization (Fast Inertial Relaxation Engine) for finding equilibria
- **Per-DOF adaptive timestep FIRE**: each degree of freedom gets its own adaptive timestep, controlled by a median-based constraint (limiting timestep variation to 10× the median). This significantly improves convergence for rods with heterogeneous stiffness.
- YAML configuration for easy parameter sweeps
- Shape morphing (inverse): given a target shape, optimize the rest state

### The FIRE optimizer

Standard FIRE uses a single global timestep. For rods with spatially varying properties (e.g., a stiff section connected to a floppy one), a global timestep is either too large for the stiff part or too small for the floppy part. The per-DOF variant solves this by giving each DOF its own timestep, subject to a global power check for stability.

## Inextensibility plugin: `icd-sap`

The `icd-sap` repository implements **Incremental Constraint Dynamics with Smooth Approximation Projection (ICD-SAP)**, a method for enforcing inextensibility constraints (fixed edge lengths) in DER.

In the standard DER formulation, edges can stretch slightly under large forces. For problems where inextensibility is essential (e.g., textile modeling, DNA mechanics), this is unacceptable. `icd-sap` adds a projection step after each dynamics update to enforce edge length constraints without sacrificing stability.

The plan is to integrate `icd-sap` as a plugin into `der-python`, providing a complete, inextensible DER implementation in Python/JAX.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
