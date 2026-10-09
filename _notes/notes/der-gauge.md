---
layout: default
---

# Thoughts on DER model - Unexplained local Gauge

[Audoly and Pomeau](https://global.oup.com/academic/product/elasticity-and-geometry-9780198506256?cc=us&lang=en&)). Now, what could be the best way to update reference frames from $${\mathbf{t}(0),\mathbf{u}(0),\mathbf{v}(0)}$$ to $${\mathbf{t}(\epsilon),\mathbf{u}(\epsilon),\mathbf{v}(\epsilon)}$$?

This to me was quite baffling because at least two possibilities seem to exist: rigid body rotation and pure twisting.

No it's not a gauge or something; it's a constraint. Because twist propagates so fast, we think twist is zero at every time point; like we assume that stretching has never happened.

A simple thought experiment.

Four rigid rods. Out of plane motion.

## Time stepper

Bending energy:

$$
E_b = \frac{1}{2}\sum_{i=1}^n (\kappa_i - \bar{\kappa}_i)^T B_i (\kappa_i - \bar{\kappa}_i)
$$

Its derivative with respect to $x_i$

$$
\frac{\partial E_b}{\partial x_i} = 2B(\kappa_i - \bar{\kappa}_i) \frac{\partial \kappa_i}{\partial x_i}
$$

What are the properties of this equation derived from gradient flow...?

<!-- not s! -->

## About twist and bending

Each time step, force (gradient of energy) will nudge points to somewhere. This update position coordinates $x_i$ would have tangent vectors. The geometric frame can be found from time parallel between previous one adapting to the new tangent.  

## References

- [Bergou et al.](https://dl.acm.org/doi/10.1145/1399504.1360662)
