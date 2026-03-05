# Improvement plan

## Detailed description on my works as a blog

Instruction: create each page for items below as if I posted on a blog.

- Rod dynamics simulation to study entanglement (rod-dynamics-3d)
  - /Users/yeonsu/GitHub/rod-dynamics-3d
- Entanglement optimization (entanglement-optimization-cpp and entanglement-optimization (jax implementation))
  - /Users/yeonsu/GitHub/entanglement-optimization-combined/entanglement-optimization-cpp
  - /Users/yeonsu/GitHub/entanglement-optimization-combined/entanglement-optimization
- Random Sequential Adsorption of 3D rods (rod-placement)
  - /Users/yeonsu/GitHub/rod-placement
- Snake control (snake-control)
  - /Users/yeonsu/GitHub/snake-control
- Snake lattice (one of dismech's examples)
  - /Users/yeonsu/GitHub/snake-lattice
- DER Python -- implementation of DER with python.
  - /Users/yeonsu/GitHub/der-python
  - /Users/yeonsu/GitHub/icd-sap
    - Will be plugged in to the der-python repo - to enforce inextensibility.
- Active billiards multi - a nonequilibrium process that extract work. AR1 process.
  - /Users/yeonsu/GitHub/active-billiards-multi
- 3D segementation of rods from x-ray scan
  - /Users/yeonsu/GitHub/matlab-image-processing

## Overview of entanglement phenoemenon

Instruction: create one page discussing below

- Meaning of embracing each other with repulsive potential
- Pairwise metrics (average crossing number e.g.) are good but cannot capture multi-agent (higher order) interaction between rods.
- With higher number of entanglement, you still cannot have enough stability - woven rod case.
- What is the proper predictor metric of stability associated with entanglement?
- Caging number that I came up with does a very good job.
- With friction, this caging number serves as a precise predictor of dynamic stability.
- rod-dynamics-3d, entanglement-optimization, entanglement-optimization-cpp, rod-placement

## Overview of inverse problems

Instruction: create one page discussing below

- How we get a configuration of optimizing "something"
  - Something can be, of course, the free energy, entanglement, cost (e.g., control effort), target shape (cost of being away from the target shape), etc.
  - Snake control - can we control hyper-redundant object? (Linear)
  - Snake lattice - can we control (or design) even more complicated object? (grid or any topology)
  - Rod packing - can we design the maximally entangled packing?
  - Forward problems are straight-forward (even though they are difficult).
  - Inverse problems (control and design) are complex.
  - Adjoint methods. Differentiable physics.
  - (Other things that people are recently interested in?)

## Overview of discrete elastic rods (DER)

Instruction: create one page discussing below

And more broadly about discrete differential geometry.

- Pretty much about what Keenan said:
  - Quote: /Users/yeonsu/GitHub/yeonsu-jung.github.io/Crane_on_ddg.txt
- Fast and stable, but still accurate.
- My contribution - making jax version (still on going).
  - /Users/yeonsu/GitHub/der-python
  - /Users/yeonsu/GitHub/icd-sap

