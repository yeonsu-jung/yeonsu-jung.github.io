---
layout: default
title: "Inverse Problems in Soft Matter and Soft Robotics"
---

# Inverse Problems in Soft Matter and Soft Robotics

*How do we find configurations that optimize something? And why are inverse problems so much harder than forward ones?*

---

## What are we optimizing?

In any physical system, the **forward problem** asks: given the current state and the equations of motion, what happens next? Forward problems are often hard (nonlinear, multi-scale, stochastic), but they are at least conceptually clear — just evolve the system.

The **inverse problem** asks instead: given a desired outcome, what inputs or configurations produce it? The "something" being optimized might be:

- **Free energy** (the system settles into its thermodynamic ground state)
- **Entanglement** (maximize the topological constraint between components)
- **Control effort** (minimize the energy needed to steer the system to a target)
- **Target shape** (minimize the distance from the current configuration to a desired shape)
- **Mechanical response** (achieve a target stiffness or compliance)

Each of these gives a different optimization problem, but they share a common structure: a high-dimensional configuration space, a scalar objective, and (usually) nonlinear constraints.

## Forward vs. inverse: a fundamental asymmetry

Forward problems in soft matter are already difficult. Simulating a dense rod packing, computing the elastic equilibrium of a network, or predicting the trajectory of a hyper-redundant robot all require careful numerics and significant computation.

Why are inverse problems *so much harder*?

The core reason is **non-uniqueness and non-convexity**. For most forward problems, the state at time $$t+dt$$ is uniquely determined by the state at time $$t$$ (given the equations of motion). But for inverse problems, many configurations may achieve the same objective — or the landscape may have many local optima that are easy to find but far from the global optimum. Gradient descent finds a local solution, not necessarily the best one.

Additionally, inverse problems often involve **implicit constraints** that are hard to differentiate through (contact, topology, inextensibility), and the forward model may be expensive to evaluate, limiting the number of gradient steps we can take.

## Examples from my work

### Snake control: hyper-redundant inverse kinematics

A snake-like robot with $$N$$ joints has $$N$$ degrees of freedom, but the task (e.g., "grasp this object") may only require controlling a few end-effector coordinates. The extra DOFs are redundant — there is a whole manifold of solutions. The question is: which solution on this manifold is best (safest, most energy-efficient, most robust)?

In [snake-control](../works/snake-control.html), I use the Gauss linking integral as an objective to guide the robot body to *topologically* grasp a target — achieving a form of robust grasping that doesn't require precise positioning.

### Snake lattice: inverse design of networks

A network of elastic rods (a lattice) has a mechanical response determined by its topology and rest state. Given a desired response (e.g., "deform in this specific pattern when loaded"), find the rest state and connectivity that achieves it. This is an inverse design problem with topological degrees of freedom.

[snake-lattice](../works/snake-lattice.html) explores this by differentiating through the elastic energy of a curve network.

### Rod packing: maximally entangled design

Given a set of rods in a box, can we find an arrangement that maximizes total entanglement? This is an inverse design problem where the "target" is not a shape but a topological property. The answer requires searching over the space of all valid (non-overlapping) configurations.

[entanglement-optimization](../works/entanglement-optimization.html) addresses this using gradient ascent on the linking number sum.

## Adjoint methods and differentiable physics

The most powerful tool for solving inverse problems in physics is the **adjoint method**. Instead of computing gradients of the objective with respect to every parameter (which requires as many forward solves as there are parameters), the adjoint method computes the gradient using just *two* solves: one forward and one "adjoint" (a modified backward solve).

For time-dependent problems, the adjoint method is essentially **backpropagation through time** — the same algorithm used to train recurrent neural networks. In the physics context, this is called **differentiable physics** or **differentiable simulation**.

The emergence of **JAX** and similar frameworks (PyTorch, Jax, Enzyme) has made differentiable physics much more accessible. In my work, JAX is used in:
- [entanglement-optimization](../works/entanglement-optimization.html) — differentiating through the Gauss integral
- [snake-control](../works/snake-control.html) — differentiating through forward kinematics and topology
- [der-python](../works/der-python.html) — differentiating through elastic rod energies

## Open questions

The field of differentiable physics for soft matter is rapidly evolving. Some open questions I find particularly interesting:

- **Contact and friction**: These involve non-smooth events (stick-slip transitions, impact) that are hard to differentiate through. Smooth approximations exist but introduce bias.
- **Topology changes**: When rods cross (in a simulation that allows it) or entanglement changes, the objective has discontinuities. How do we handle these?
- **Scalability**: Gradient-based methods work well for $$N \sim 10^2$$ rods. Can they scale to $$N \sim 10^4$$ or $$10^6$$?
- **Integration with data-driven methods**: Can differentiable simulators be combined with learned models to solve inverse problems more efficiently?

---

[back to notes](../notes.html) &nbsp;|&nbsp; [home](./../)
