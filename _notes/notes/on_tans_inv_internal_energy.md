# Centroid Invariance Under Gradient Flow of Internal Energy

This note summarizes the key theorem and derivation we discussed about why the **centroid of a chain is invariant** under gradient descent of any **purely internal, translation-invariant energy**.

---

## 1. Setup

We have positions  
\[
x_0, x_1, \dots, x_n \in \mathbb{R},
\]
and an internal energy  
\[
E(x_0,\dots, x_n).
\]

Assume the gradient flow:
\[
\dot{x}_i(t) = -\frac{\partial E}{\partial x_i}.
\]

Define the centroid:
\[
C(t) = \frac{1}{n+1} \sum_{i=0}^n x_i(t).
\]

---

## 2. Translation Invariance

The key symmetry is:

\[
E(x_0 + a, x_1 + a, \dots, x_n + a) = E(x_0, x_1, \dots, x_n)
\quad \forall a \in \mathbb{R}.
\]

This means the energy depends only on **relative distances** (internal structure), not the absolute placement.

---

## 3. Main Theorem

### Theorem
If a function \(E: \mathbb{R}^{n+1}	o\mathbb{R}\) satisfies

\[
E(\mathbf{x} + a v) = E(\mathbf{x})
\]

for all \(a\) and some nonzero vector \(v\), then

\[

\nabla E(\mathbf{x}) \cdot v = 0
\quad \text{for all } \mathbf{x}.
\]

### Proof
Define

\[
f(a) = E(\mathbf{x} + a v).
\]

By symmetry, \(f\) is constant, so \(f'(0)=0\). Applying the chain rule gives:

\[
0 = f'(0) = 
\nabla E(\mathbf{x})\cdot v.
\]

---

## 4. Corollary: Centroid Invariance

For the chain, choose

\[
v=(1,1,\dots,1).
\]

Translation invariance then gives:

\[
\sum_{i=0}^n \frac{\partial E}{\partial x_i} = 0.
\]

Compute \(\dot{C}\):

\[
\dot{C}(t)
= \frac{1}{n+1}\sum_{i=0}^n \dot{x}_i(t)
= -\frac{1}{n+1}\sum_{i=0}^n \frac{\partial E}{\partial x_i} = 0.
\]

### Conclusion  
\[
C(t) = \text{constant}.
\]

The centroid **does not move** under gradient flow of a translation-invariant internal energy.

---

## 5. Physical Interpretation

Internal forces come in **equal and opposite pairs** (Newton’s third law). When you sum forces over all particles, they cancel:

\[
\sum_i F_i = 0.
\]

In a gradient flow, forces are \(F_i = -\partial E/\partial x_i\). Their sum vanishes, so the average position cannot drift.

---

## 6. When Centroid Is *Not* Conserved

Any external potential breaks translation symmetry:

- Gravity  
- Pinning to a reference point  
- External traps  
- Boundary interactions  

Then:

\[
\sum_i \frac{\partial E}{\partial x_i}
\neq 0,
\]

and the centroid evolves.

---

## 7. Connection to General Symmetry Principles

This is a gradient-flow counterpart of **Noether’s theorem**:

- In Hamiltonian mechanics: translation symmetry ⇒ momentum conservation.  
- In gradient flow: translation symmetry ⇒ centroid invariance.

More generally:

> **For any gradient flow, motion is always orthogonal to symmetry directions.**

---

This file contains all essential theory, proofs, and intuition from our discussion.
