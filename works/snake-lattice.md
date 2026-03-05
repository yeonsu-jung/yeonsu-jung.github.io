---
layout: default
title: "Snake Lattice: Inverse Design of Curve Networks"
---

# Snake Lattice: Inverse Design of Curve Networks

*What happens when the robot is not a single chain, but a whole network? Can we design (or control) the topology of an elastic lattice?*

[GitHub: snake-lattice](https://github.com/yeonsu-jung/snake-lattice)

---

## From chains to networks

The snake-control project asks how to control a single hyper-redundant chain. Snake lattice asks a harder question: what if the "robot" is a **network** of interconnected elastic rods — a grid, a lattice, or an arbitrary graph?

This problem arises naturally in:
- Woven and knitted textiles (where filaments intersect at many nodes)
- Elastic metamaterials (where the network topology determines mechanical response)
- Soft robotic skins and grippers with distributed actuation

## What the code does

Snake lattice is built around the **Discrete Mechanics** (DisMech) framework, and this project is one of DisMech's canonical examples. It simulates and analyzes curve networks with:

- **JAX-based automatic differentiation** for computing elastic energies and gradients
- **Polyscope** for 3D visualization of network configurations
- **Topology analysis**: tracking the graph structure (nodes, edges, edge pairs) as the network deforms

Configurations are stored as `.npy` files containing node positions and edge connectivity, making it easy to save, reload, and compare configurations.

The analysis scripts cover:

- `analysis.py` — In-plane deformation and force response
<!-- - `analysis2.py` — Extended analysis with multiple loading scenarios -->
- `analysis_out_of_plane.py` — Out-of-plane buckling and topology changes

## Inverse design perspective

The forward problem is: given a network topology and applied forces/displacements, what is the equilibrium configuration? This is standard structural mechanics.

The **inverse problem** is: given a desired shape or mechanical response, what network topology and rest-state configuration achieves it? This is a design problem. By differentiating through the elastic energy with JAX, we can compute gradients with respect to node positions, rest lengths, or cross-sectional properties, and use gradient descent to find designs that meet a target.

## Out-of-plane behavior

A particularly interesting regime is when the network buckles out of plane. In-plane deformations are relatively tractable, but out-of-plane buckling introduces new topological degrees of freedom: overcrossings and undercrossings that change the linking structure of the network. Analyzing these transitions is one of the goals of this project.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
