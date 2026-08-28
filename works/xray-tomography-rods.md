---
layout: default
title: "X-Ray Tomography of Entangled Rod Packings"
---

# X-Ray Tomography of Entangled Rod Packings

*Volumetric imaging experiments that reveal the hidden three-dimensional architecture of entangled fiber assemblies.*

---

## Motivation

The mechanical behavior of an entangled rod packing is set by geometry that is invisible from the outside: how each filament curves, who touches whom, and which rods cage which. To test our theory of the **entanglement transition** ([PNAS 2025](https://www.pnas.org/doi/10.1073/pnas.2401868122)) against reality, we needed the full 3D configuration of real packings — so we imaged them with X-ray micro-computed tomography.

## What we did

- Prepared random packings of flexible rods across a range of aspect ratios and packing fractions
- Acquired micro-CT scans of each packing at the Harvard Center for Nanoscale Systems
- Reconstructed every individual rod centerline from the volumetric data using a custom [segmentation pipeline](./matlab-image-processing.html)
- Extracted contact networks, crossing numbers, and caging statistics directly from the reconstructed geometry

## Why it matters

The reconstructed configurations let us validate simulations against experiments *state by state*, not just through bulk averages. The same experimental geometry seeded our simulations and our topological analysis, closing the loop between fabrication, imaging, and modeling — and confirming that the onset of collective rigidity coincides with the geometric caging predicted by theory.

## Related

- [3D Segmentation of Rods from X-Ray Scans](./matlab-image-processing.html)
- [Rod Dynamics Simulation in 3D](./rod-dynamics-3d.html)
