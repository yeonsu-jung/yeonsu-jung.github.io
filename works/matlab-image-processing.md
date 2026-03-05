---
layout: default
title: "3D Segmentation of Rods from X-Ray Scans"
---

# 3D Segmentation of Rods from X-Ray Scans

*Reconstructing individual rod positions and orientations from volumetric X-ray imaging of dense packings.*

[GitHub: matlab-image-processing](https://github.com/yeonsu-jung/matlab-image-processing)

---

## Motivation

To study entanglement experimentally, we need to measure the actual 3D configuration of rods in a packing — not just macroscopic quantities like total density or mechanical response. **X-ray computed tomography (CT)** provides volumetric images of opaque packings, but extracting individual rod geometries from these images is a non-trivial image analysis problem.

The challenge: in a dense packing, rods overlap in 2D projections, their X-ray contrast is similar, and artifacts from the reconstruction can blur boundaries. We need a pipeline that robustly segments individual rods in 3D and extracts their centerlines, orientations, and contact points.

## What the toolkit does

The `matlab-image-processing` toolkit provides a MATLAB-based pipeline for this segmentation task. Key components:

- **Preprocessing**: Noise filtering, contrast enhancement, and thresholding to binarize the volume
- **Individual rod segmentation**: Separation of touching rods using morphological operations and watershed algorithms
- **Centerline extraction**: Skeletonization of each segmented rod to extract its 3D centerline
- **Orientation analysis**: Fitting a line to each centerline to extract rod orientation vector
- **Group analysis**: `SCRIPT_checkEveryGroup.m` and `SCRIPT_assessEveryGroup.m` automate the analysis across multiple sample groups

The toolkit is organized with:
- `functions/` — Core analysis functions
- `scripts/` — High-level automation scripts
- `mex/` — Compiled MATLAB extensions for performance-critical steps
- Data stored as `.mat` files for efficient I/O

## Downstream use

The extracted rod configurations feed directly into the computational analyses:

- **Caging number computation**: Given the 3D positions and orientations of all rods, compute how many rods cage each rod (see [entanglement overview](../notes/entanglement-overview.html))
- **Linking number measurement**: Compute pairwise $$Lk$$ for all rod pairs to quantify topological entanglement
- **Comparison with simulation**: The experimentally measured configurations can be directly compared with configurations from `rod-dynamics-3d` and `rod-placement`

## Technical notes

Rod segmentation in 3D is fundamentally harder than in 2D because contact surfaces between rods in a dense packing are difficult to resolve with finite voxel resolution. The toolkit addresses this by:

- Using anisotropic filtering that preserves rod-shaped features
- Performing clustering analysis to group voxels into individual rod candidates
- Applying geometric constraints (rod length, aspect ratio) to validate candidates

The result is a list of $$N$$ rods with positions, orientations, and estimated uncertainties — a compact geometric description of the packing that can be analyzed with all the other tools in this research program.

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
