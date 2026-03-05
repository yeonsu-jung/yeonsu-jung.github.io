---
layout: default
title: "Snake Control: Trajectory Optimization for Hyper-Redundant Robots"
---

# Snake Control: Trajectory Optimization for Hyper-Redundant Robots

*Can we steer a long, flexible, many-jointed robot to grasp objects using topology rather than precision?*

[GitHub: snake-control](https://github.com/yeonsu-jung/snake-control)

---

## The problem

A **hyper-redundant robot** — a robot with many more degrees of freedom than the minimum needed for a task — is both a blessing and a curse. The extra DOFs provide redundancy and flexibility, but they make control vastly harder. Classical inverse kinematics struggles when the configuration space is high-dimensional and the relationship between joint angles and end-effector pose is highly nonlinear.

For soft robots in particular, the challenge is compounded: the robot's body can deform, wrap around objects, and form topological linkages with its environment. Can we exploit this topology to achieve robust grasping without requiring precise position control?

## Approach: topology-guided trajectory optimization

The key idea is to use the **Gauss linking integral** as a control objective. Instead of asking "bring the end-effector to position $$\mathbf{x}^*$$," we ask "wrap the robot's body around the target object so that the linking number $$Lk \neq 0$$."

A nonzero linking number means the robot is **topologically entangled** with the object — it cannot be removed without cutting the robot or passing through the object. This provides a form of grasping that is robust to small positional errors and doesn't require tight tolerances.

## Implementation

The simulation and optimization are implemented in **JAX** for automatic differentiation:

- The robot is modeled as a chain of rigid links with fixed lengths, whose configuration is parameterized by joint angles
- Fixed link lengths are enforced via unit-sphere projection at each step
- The objective combines end-effector tracking (IK) and the Gauss linking integral (grasp security)
- Optimization uses `optax` with the Adam optimizer

Two control modes:

1. **End-effector IK**: Minimize distance between end-effector and target position
2. **Grasp control**: Maximize $$|Lk|$$ between robot body and a target object, guiding the robot to wrap around and entangle with the object

## Why JAX?

Differentiating through the Gauss integral analytically is tedious. JAX handles this automatically, and the same code runs on CPU or GPU. The functional style also makes it easy to compose multiple objectives (reach + grasp + avoid obstacles) without rewriting gradient computations.

## Results

The optimizer successfully finds trajectories that:

- Guide the robot's body to wrap around a target object
- Achieve $$|Lk| \geq 1$$ (topological grasping)
- Maintain link-length constraints throughout the motion

The grasping is qualitatively robust: small perturbations to the target position do not break the topological constraint, unlike precision-based grasping strategies.

## Connection to active entanglement grasping

This project is directly inspired by our experimental work on **active entanglement grasping** ([PNAS 2022](https://www.pnas.org/doi/10.1073/pnas.2209819119)), where a soft robotic gripper made of flexible filaments grasps objects stochastically through entanglement. The snake-control project asks: can we make this process controllable and intentional, rather than stochastic?

---

[back to works](../works.html) &nbsp;|&nbsp; [home](./../)
