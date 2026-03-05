---
layout: default
title: "Discrete Differential Geometry: A Computational Perspective"
---

# Discrete Differential Geometry: A Computational Perspective

*On the philosophy and practice of treating discrete objects as first-class geometric entities — not just approximations of smooth ones.*

---

## What is DDG?

Keenan Crane describes the field as well as anyone:

> *The emerging field of discrete differential geometry (DDG) studies discrete analogues of smooth geometric objects, providing an essential link between analytical descriptions and computation. The basic philosophy of discrete differential geometry is that a discrete object like a polyhedron is not merely an approximation of a smooth one, but rather a differential geometric object in its own right.*

> *In contrast to traditional numerical analysis, which focuses on eliminating approximation error in the limit of refinement (e.g., by taking smaller and smaller finite differences), DDG places an emphasis on the so-called "mimetic" viewpoint, where key properties of a system are preserved exactly, independent of how large or small the elements of a mesh might be.*

This distinction — **approximation vs. mimesis** — is the heart of DDG. A classical finite-element method tries to approximate smooth quantities with small elements. A DDG method instead asks: what discrete objects have exactly the right geometric properties, and how do they naturally interact?

The payoff is striking: DDG-based simulations are often more stable, more accurate at coarse discretizations, and geometrically faithful in ways that matter for physical correctness.

## The game

The procedure for developing DDG analogs of smooth objects follows a "game," as Crane describes it:

1. Write down several equivalent definitions of the smooth object (e.g., curvature can be defined via the shape operator, the Gauss map, the first and second fundamental forms, or the angle deficit)
2. Apply each smooth definition to the discrete setting
3. See which properties are preserved by each discrete analog

Most of the time, no single discrete object preserves all the properties of the smooth one — a "no free lunch" scenario. But the properties that *are* preserved often turn out to be exactly the ones needed for a particular application.

For instance, the discrete analog of mean curvature based on the cotangent formula naturally satisfies a discrete Gauss-Bonnet theorem. The discrete analog based on angle deficits naturally gives the correct integrated curvature for surfaces with boundaries. Each is "right" in a different sense.

## Why it matters for rod mechanics

For elastic rods — thin filaments whose behavior is dominated by bending and twisting — the DDG perspective is especially powerful. The **Discrete Elastic Rods (DER)** method uses:

- **Discrete curvature** defined as the angle between consecutive edge tangents (the "turning angle")
- **Discrete twist** defined as the holonomy of the material frame along the rod
- **Discrete elastic energy** as a sum of squared curvatures and twists

These definitions are not approximations of the smooth Kirchhoff rod model: they are discrete analogs that preserve key variational properties. The resulting simulation is:

- **Fast**: O(N) per timestep for a rod with N edges
- **Stable**: The discrete energy is well-behaved even at large deformations
- **Accurate**: Reproduces known analytic solutions (helices, writhing instabilities, Euler elastica) without needing fine meshes

## Geometry is neither smooth nor discrete

One of the deepest insights in Crane's notes is that geometry is neither inherently smooth nor discrete:

> *Geometry is neither inherently smooth nor discrete; rather, it is comprised of all the ideas that persist independent of the particular language used to write them down.*

This is a useful philosophical anchor for computational mechanics. The "true" elastic rod is not the smooth Kirchhoff rod; it is the set of physical behaviors (force-extension, bending stiffness, writhe-twist coupling) that any good model should reproduce. The smooth and discrete descriptions are two languages for expressing the same underlying reality.

## My contributions

I am developing a **Python/JAX implementation of DER** ([der-python](../works/der-python.html)) with two goals:

1. **Accessibility**: Python lowers the barrier for using DER in research workflows that already use Python for analysis and visualization.

2. **Differentiability**: JAX makes the entire simulation differentiable, enabling gradient-based inverse design (see [inverse problems overview](./inverse-problems-overview.html)).

The `icd-sap` plugin adds inextensibility constraints via a smooth approximation projection, extending the standard DER framework to applications where edge-length preservation is essential.

## Further reading

- Bergou, M., Wardetzky, M., Robinson, S., Audoly, B., & Grinspun, E. (2008). *Discrete elastic rods.* ACM SIGGRAPH.
- Bergou, M., Audoly, B., Vouga, E., Wardetzky, M., & Grinspun, E. (2010). *Discrete viscous threads.* ACM SIGGRAPH.
- Crane, K. (course notes). *Discrete Differential Geometry.* CMU.
- Crane, K., & Wardetzky, M. (2017). *A glimpse into discrete differential geometry.* Notices of the AMS.

---

[back to notes](../notes.html) &nbsp;|&nbsp; [home](./../)
