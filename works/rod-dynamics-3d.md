---
layout: default
title: "Rod Dynamics Simulation in 3D"
---

# Rod Dynamics Simulation in 3D

*A C++ simulation framework for studying the mechanics and entanglement of flexible rods.*

[GitHub: rod-dynamics-3d](https://github.com/yeonsu-jung/rod-dynamics-3d)

---

## Motivation

Understanding how flexible rods interact, tangle, and stabilize is central to problems ranging from robotic grasping to the structural integrity of bird nests and fiber packings. To study these phenomena computationally, I built a 3D rod dynamics simulation in C++ that can handle large ensembles of rods with repulsive contact and frictional interactions.

## What it does

The simulator evolves rod configurations forward in time using a discrete elastic rod (DER) framework. Each rod is discretized as a chain of nodes and edges, and interactions between rods are handled through short-range repulsive potentials. The simulation can track:

- Positional and orientational dynamics of each rod
- Contact and entanglement events
- Topological metrics such as the average crossing number and the caging number

A key feature is the ability to decompose the motion of rods into components — for instance, separating translational drift from local orientational fluctuations — which helps isolate the geometric signature of entanglement.

## Key features

- Written in C++ with CMake for portability and performance
- Supports large ensembles ($$N \sim 10^4$$ rods) at physically relevant densities
- Timestamped output directories for reproducible runs
- Postprocessing and analysis scripts in Python
- Detailed optimization and rollback documentation for long simulation campaigns

## Relationship to the entanglement project

This simulator is the primary tool for generating data used in our study of the **entanglement transition in rod packings** ([PNAS 2025](https://www.pnas.org/doi/10.1073/pnas.2401868122)). By sweeping rod aspect ratio and packing fraction, we were able to map out the phase boundary between loose (unentangled) and entangled states, and measure how the caging number predicts dynamic stability.

## What I learned

Building this simulator taught me a great deal about the subtleties of contact mechanics at finite rod density. Naive repulsive potentials can lead to catastrophic overlap at high density; careful choice of potential stiffness and integration timestep is essential. I also learned the value of decomposing rod motion — treating the system not as $$N$$ independent particles but as a collective geometrical object.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
