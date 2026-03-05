---
layout: default
---

I am a postdoctoral researcher in [Applied Mathematics at Harvard](https://seas.harvard.edu/applied-mathematics), working with [Prof. L. Mahadevan](https://softmath.seas.harvard.edu/). Previously, I completed my Ph.D. in Mechanical Engineering at Seoul National University under the supervision of [Prof. Ho-Young Kim](https://fluids.snu.ac.kr/).

My research program, **Controlling disordered soft-matter systems with nonsmooth interactions**, aims to turn mechanical complexity due to disorder and nonsmoothness into a predictive and designable resource through a strongly computational lens. I develop **physics-based, computational tools** for soft and active matter that combine reduced-order modeling and optimization with tightly coupled experiments. A central theme is using computation to close the loop between **experiment, model, and inverse design**, so that simulations are not just descriptive but actively guide what we build and measure and, in the longer term, interface naturally with emerging data-driven approaches.

On the computational side, I focus on:

- **Discrete differential geometry (DDG) and reduced-order models** for filament elasticity, contact, friction, and topological constraints  
- **Nonsmooth mechanics and complementarity-based contact solvers** for disordered, contact-rich media
- **Inverse design and control as inference**, formulating high-level objectives (entanglement, force transmission, dissipation, robustness) and solving constrained optimization problems in physical parameter spaces  
- **Reconstruction and coarse-graining of complex configurations**, using 3D imaging and geometric analysis to identify minimal, predictive state variables and laying the groundwork for future data-driven modeling  
- **Computational soft materials and high-performance simulation tools**, with an emphasis on reproducible, open workflows that can be shared across physics and engineering communities

These computational methods are tightly integrated with custom experiments and fabrication to study and solve **inverse problems in soft matter**:

- **Entangled filament ensembles and contact-rich soft robotic grasping**  
- **Disordered soft and active materials**, where geometry, friction, and topology organize macroscopic behavior  
- Extensions to **viscoelastic liquids, multiphase flows, and biological networks**, where predictive, simulation-ready coarse-grained descriptions are still missing.

More broadly, my work sits at the interface of **physics, engineering, and computation**, bridging nonlinear dynamics, nonequilibrium mechanics, materials science, architecture, and soft robotics.

<!-- [Research statement](./research-statement.html) -->

## Works

### Entanglement and packing

- [Rod Dynamics Simulation in 3D](./works/rod-dynamics-3d.html) — C++ simulation of rod ensembles with contact and friction
- [Entanglement Optimization](./works/entanglement-optimization.html) — Maximize linking number in rod configurations (C++ and JAX)
- [Random Sequential Adsorption of 3D Rods](./works/rod-placement.html) — RSA packings and the entanglement transition

### Control and inverse design

- [Snake Control](./works/snake-control.html) — Topology-guided trajectory optimization for hyper-redundant robots
- [Snake Lattice](./works/snake-lattice.html) — Inverse design of elastic curve networks

### Simulation infrastructure

- [DER Python](./works/der-python.html) — Discrete Elastic Rods in Python/JAX with inextensibility plugin
- [3D Segmentation of Rods from X-Ray Scans](./works/matlab-image-processing.html) — MATLAB pipeline for CT-based rod reconstruction

### Active matter

- [Active Billiards](./works/active-billiards-multi.html) — Work extraction from active AR(1) particles via a ratcheted wheel

## Publications

*: Co-first authors

**Morphogenesis and morphometry of brain folding patterns across species**
Sifan Yin, Chunzi Liu, Gary PT Choi, Yeonsu Jung, Katja Heuer, Roberto Toro, L. Mahadevan
[eLife 14, RP107138 (2025)](https://doi.org/10.7554/eLife.107138.2)

**Phase transitions in rolling of irregular cylinders and spheres**  
Daoyuan Qian, **YJ**, L. Mahadevan  
[Proceedings of the National Academy of Sciences 122, e2417161122 (2025)](https://www.pnas.org/doi/10.1073/pnas.2417161122)

**Entanglement transition in rod packings**  
**YJ**, Thomas Plumb-Reyes, Hao-Yu Greg Lin, L. Mahadevan  
[Proceedings of the National Academy of Sciences 122, e2401868122 (2025)](https://www.pnas.org/doi/10.1073/pnas.2401868122)  

**Active entanglement enables stochastic, topological grasping**  
Kaitlyn Becker, Clark Teeple, Nicholas Charles, **YJ**, Daniel Baum,  
James C. Weaver, L. Mahadevan, Robert Wood  
[Proceedings of the National Academy of Sciences 119, e2209819119 (2022)](https://www.pnas.org/doi/10.1073/pnas.2209819119)

**Thermodynamics of hygroresponsive soft engines: Cycle analysis and work ratio**  
Beomjune Shin, **YJ**, Munkyeong Choi, Ho-Young Kim  
[Physical Review Applied 18, 044061 (2022)](https://doi.org/10.1103/PhysRevApplied.18.044061)

**Evaporative capillary rise**  
Jungtaek Kim, **YJ**, Ho-Young Kim  
[Physical Review Fluids 7, L032001 (2022)](https://doi.org/10.1103/PhysRevFluids.7.L032001)

**Soft artificial electroreceptors for non-contact spatial perception**  
W. J. Song*, Y. Lee*, **YJ***, Y.-W. Kang, J. Kim, J.-M. Park, Y.-L. Park, H.-Y. Kim, J.-Y. Sun  
[Science Advances 7, sciadv.abg9203 (2021)](https://www.science.org/doi/10.1126/sciadv.abg9203)

**Avian mud nest architecture by self-secreted saliva**  
**YJ**, Sohyun Jung, Sang-im Lee, Wongjung Kim, Ho-Young Kim  
[Proceedings of the National Academy of Sciences 118, e2018509118 (2021)](https://www.pnas.org/doi/10.1073/pnas.2018509118)

**Ionic spiderwebs**  
Y. Lee*, W. J. Song*, **YJ**, H. You, M.-Y. Kim, H.-Y. Kim, J.-Y. Sun  
[Science Robotics 5, eaaz5405 (2020)](https://www.science.org/doi/10.1126/scirobotics.aaz5405)

**Optimal diameter reduction ratio of acinar airways in human lungs**  
K. Park*, **YJ**, T. Son, Y.-J. Cho, N. L. Jeon, W. Kim, H.-Y. Kim  
[PLOS ONE 14, e0218947 (2019)](https://doi.org/10.1371/journal.pone.0204191)

**Poro-elasto-capillary wicking of cellulose sponges**  
J. Ha, J. Kim, **YJ**, G. Yun, D.-N. Kim, H.-Y. Kim  
[Science Advances 4, eaao7051 (2018)](https://www.science.org/doi/10.1126/sciadv.aao7051)

**Capillarity ion concentration polarization as spontaneous desalting mechanism**  
S. Park*, **YJ***, S. Y. Son, I. Cho, Y. Cho, H. Lee, H.-Y. Kim, S. J. Kim  
[Nature Communications 7, 11223 (2016)](https://doi.org/10.1038/ncomms11223)

**Three-dimensional point spread function of surface plasmon-coupled emission microscopy**  
**YJ**, Euiheon Chung  
[Proceedings of SPIE, Nano-Bio Sensing, Imaging, and Spectroscopy, 88790D (2013)](https://astronomicaltelescopes.spiedigitallibrary.org/conference-proceedings-of-spie/8879/88790D/Three-dimensional-point-spread-function-of-surface-plasmon-coupled-emission/10.1117/12.2018695.short)


## Media

🪺 [How do bird nests stay together?](https://seas.harvard.edu/news/2025/04/how-do-bird-nests-stay-together)  
🏀 [Getting the ball rolling.](https://seas.harvard.edu/news/2025/03/getting-ball-rolling)  
🦑 [This robotic tentacle gripper is gentle, practical, and terrifying.](https://www.theverge.com/2022/10/26/23424420/robot-tentacle-gripper-rubber-filaments-mr-jelly-hands)  
🦑 [Bizarre Tentacle Robot Looks Like It Emerged From 'The Matrix'.](https://www.cnet.com/science/bizarre-tentacle-robot-looks-like-it-emerged-from-the-matrix/)  
🦑 [This spooky robot uses inflatable tentacles to grab delicate items.](https://www.popsci.com/technology/harvard-tentacle-robot/)  
🌲 [New Models Expand Thermodynamics to Humidity-Driven Engines That Mimic Plants.](https://www.aps.org/publications/apsnews/202212/plants.cfm)  
🐟 [가오리 피부가 '힌트'… 눈 감고도 사물 감지하는 센서 개발](https://www.chosun.com/economy/science/2021/12/01/YCCVX5EYWVGRPD4TESISP3JZDA/?utm_source=naver&utm_medium=referral&utm_campaign=naver-news.html)  
🛖 [제비 무게 100배 견디는 제비집의 비밀은 '침'](https://www.chosun.com/economy/science/2021/01/14/ISP4PIJBRBAKVCYKA4N773HM2A/)  
🕸️ [Artificial spider web gets an ionic boost](https://physicsworld.com/a/artificial-spider-web-gets-an-ionic-boost/)  
🧽 [An absorbing study on the maths of sponges](https://www.nature.com/articles/d41586-018-04010-w)



## Experience

**2021-Present**. Postdoctoral Fellow.  
Harvard School of Engineering and Applied sciences, Cambridge, MA, USA.  
Research: Control/design of soft matter under topological/frictional constraints.  
Supervisor: Prof. Lakshminarayanan Mahadevan

**2020-2021**. Postdoctoral Fellow.  
Rowland institute, Harvard University, Cambridge, MA, USA.  
Research: Fluid dynamics of textured surfaces (e.g., shark skin) for drag reduction.  
Supervisor: Dr. Shabnam Raayai-Ardakani

**2019-2020**. Postdoctoral Fellow.  
Department of Mechanical Engineering, Seoul National University, Seoul, South Korea.  
Research: Structural optimization in animal architectures.  
Supervisor: Prof. Ho-Young Kim

## Education

**2014-2019**	PhD in Mechanical Engineering.  
Seoul National University, Seoul, South Korea.  
Thesis: Optimal control/design principles in biological transport systems.
Supervisor: Prof. Ho-Young Kim

**2012-2014**	MS in Biomedical Engineering.  
Gwangju Institute of Science and Technology, Gwangju, South Korea.  
Thesis: Statistical optics for biomedical applications.  
Supervisor: Prof. Euiheon Chung

**2008-2012**	BS in Mechanical engineering.  
Pohang university of Science and Technology, Pohang, South Korea.  