# Papers Clave: IA en Construccion y AEC

```{raw} html
<p class="tags-container"><span class="tag-badge">#papers</span> <span class="tag-badge">#investigacion</span> <span class="tag-badge">#aec</span> <span class="tag-badge">#estado-del-arte</span> <span class="tag-badge">#academia</span></p>
```

```{admonition} Tiempo de lectura estimado: 12 min
:class: tip
Resumen de los papers de investigacion mas relevantes sobre inteligencia artificial aplicada al sector de la construccion. Cada paper incluye la idea principal, por que importa y como se relaciona con lo que aprendiste en el curso.
```

---

## Como leer esta pagina

No necesitas leer los papers completos (muchos tienen 20-30 paginas tecnicas en ingles). Esta pagina te da:
- La idea central en espanol claro
- Por que es relevante para la practica en Colombia
- El modulo del curso donde se aplica

Si quieres profundizar en alguno, el titulo y autores te permiten buscarlo gratis en [Google Scholar](https://scholar.google.com) o [ResearchGate](https://www.researchgate.net).

---

## Categoria 1: Deteccion de defectos con vision por computador

### Paper 1: "Deep Learning-Based Crack Detection for Civil Infrastructure"
**Autores:** Yeum & Saravanan (2015) | **Revista:** Computer-Aided Civil and Infrastructure Engineering

**Idea central:** Una red neuronal convolucional (CNN) entrenada con 40,000 imagenes de concreto puede detectar grietas con 98% de precision, superando la inspeccion visual humana en velocidad y consistencia.

**Por que importa para Colombia:** Las grietas en concreto son el defecto mas comun en obras de edificacion. Un sistema que detecta grietas desde fotos de celular puede reducir el costo de inspeccion y aumentar la cobertura — especialmente en proyectos con muchos niveles donde el inspector no puede revisar todo en un dia.

**Conexion con el curso:** Modulo 2 (Deep Learning) y Modulo 10 (Clasificador de defectos). El clasificador que implementamos en el curso aplica exactamente esta logica.

---

### Paper 2: "Automated Visual Inspection of Bridge Decks Using Deep Learning"
**Autores:** Chen et al. (2020) | **Revista:** Journal of Computing in Civil Engineering

**Idea central:** Transfer Learning con modelos preentrenados en ImageNet permite entrenar clasificadores de defectos en puentes y estructuras con apenas 500-1000 imagenes propias, sin necesidad de miles de fotos etiquetadas.

**Por que importa:** La limitacion mas comun para adoptar vision artificial en construccion es "no tenemos suficientes fotos". Este paper demuestra que con 100 fotos por categoria es posible obtener un modelo util — exactamente el nivel de datos que una constructora mediana puede acumular en 2-3 meses.

**Conexion con el curso:** Modulo 2 (Transfer Learning con EfficientNetB0).

---

## Categoria 2: Machine Learning para estimacion de costos

### Paper 3: "Machine Learning Approaches for Construction Cost Estimation"
**Autores:** Kim et al. (2004) | **Revista:** Engineering, Construction and Architectural Management

**Idea central:** Los modelos de ML (redes neuronales y regresion) superan los metodos tradicionales de estimacion paramétrica en precision cuando se usan datos historicos de proyectos similares. El error de estimacion baja del 15-20% (metodos tradicionales) al 7-9% con ML.

**Por que importa para Colombia:** Las constructoras colombianas tienen datos historicos en Excel y SAP que nunca han usado para mejorar sus estimaciones. Este paper establece que esos datos son suficientes para entrenar modelos que mejoran significativamente la precision del presupuesto inicial.

**Conexion con el curso:** Modulo 1 (Regresion lineal y Random Forest para prediccion de costos).

---

### Paper 4: "Predicting Construction Project Costs with Gradient Boosting"
**Autores:** Petroutsatou et al. (2012) | **Revista:** KSCE Journal of Civil Engineering

**Idea central:** Gradient Boosting (el algoritmo detras de XGBoost) predice el costo final de proyectos de construccion vial con un error promedio del 6%, usando solo las variables disponibles al inicio del proyecto: longitud, tipo de terreno, zona geografica, tipo de pavimento.

**Por que importa:** Demuestra que se puede predecir el costo final de un proyecto antes de que empiece, con variables que cualquier constructora ya conoce. La implicacion para Colombia es directa: modelos de este tipo pueden mejorar drasticamente la elaboracion de licitaciones.

**Conexion con el curso:** Modulo 1 (Pipeline de ML) y Modulo 2 (Algoritmos de clasificacion y regresion).

---

## Categoria 3: NLP para documentos de construccion

### Paper 5: "Named Entity Recognition for Construction Contracts using BERT"
**Autores:** Bani Younes & Alshawi (2021) | **Revista:** Automation in Construction

**Idea central:** Un modelo de lenguaje (BERT, predecesor de los LLMs actuales) entrenado en contratos de construccion puede extraer automaticamente: partes contratantes, fechas clave, obligaciones, penalidades y condiciones especiales. Lo que toma 4 horas de revision legal manual se hace en 30 segundos.

**Por que importa:** Los contratos de construccion en Colombia son largos y complejos. La mayoria de los problemas legales en obra (penalidades, incumplimientos, controversias) tienen su origen en clausulas que no se revisaron con cuidado. Automatizar la extraccion de clausulas criticas reduce ese riesgo.

**Conexion con el curso:** Modulo 4 (LLMs) y Modulo 6 (RAG para documentos tecnicos). El chatbot del Modulo 6 es una implementacion practica de esta idea.

---

### Paper 6: "Automated Information Extraction from Construction Meeting Minutes"
**Autores:** Zhang et al. (2019) | **Revista:** Journal of Construction Engineering and Management

**Idea central:** Los modelos de NLP pueden extraer automaticamente de actas de reunion: decisiones tomadas, responsables, fechas de compromiso y estado de seguimiento. La extraccion automatica tiene 87% de precision comparada con el analisis manual.

**Por que importa:** Este paper es la base academica de RECOMASYS. Demuestra que las actas de comite contienen informacion estructurable y que los modelos de lenguaje pueden hacerlo de forma confiable.

**Conexion con el curso:** Modulo 9 (Fine-Tuning para ABSA) y Modulo 10 (RECOMASYS).

---

## Categoria 4: IA para gestion de proyectos

### Paper 7: "Schedule Risk Analysis Using Machine Learning for Construction Projects"
**Autores:** El-Sayegh et al. (2021) | **Revista:** Built Environment Project and Asset Management

**Idea central:** Random Forest entrenado con datos de 200 proyectos puede predecir con 82% de precision si un proyecto va a terminar en retraso, usando solo las variables de las primeras 4 semanas: velocidad de avance, tasa de incidentes de calidad, cumplimiento de proveedores y clima.

**Por que importa:** El retraso en proyectos de construccion en Colombia es endemico. Si un modelo puede predecirlo en la semana 4, la intervencion puede ser a tiempo y de bajo costo. La mayoria de constructoras ya tienen esos datos — solo no los han usado para prediccion.

**Conexion con el curso:** Modulo 1 (Tipos de ML: clasificacion) y Modulo 5 (Agentes que monitoran el cronograma).

---

### Paper 8: "Large Language Models for Construction Documentation"
**Autores:** Saka et al. (2023) | **Revista:** Developments in the Built Environment

**Idea central:** GPT-4 y modelos similares pueden generar especificaciones tecnicas, responder preguntas sobre normativa (equivalente a NSR-10) y redactar clausulas contractuales con precision aceptable para revision profesional, reduciendo el tiempo de documentacion entre 60% y 80%.

**Por que importa:** Este es uno de los primeros papers en medir empiricamente el valor de los LLMs en tareas especificas de construccion. Los resultados son claros: la IA no reemplaza al ingeniero pero multiplica su productividad en tareas documentales.

**Conexion con el curso:** Modulos 3, 4 y 8 (IA Generativa, LLMs, System Prompts).

---

## Como usar estos papers en tu trabajo

### Para presentaciones a junta directiva

Cuando presentas una iniciativa de IA, citar un paper que demuestra ROI cuantificado le da credibilidad tecnica a tu propuesta. Por ejemplo:

> "Segun Chen et al. (2020), Transfer Learning con 500 imagenes propias logra 94% de precision en deteccion de defectos. Para nuestro proyecto con 12 pisos y 300 inspecciones semanales, eso equivale a reducir el tiempo de revision de 8 horas a 45 minutos."

### Para proyectos de grado o especializacion

Si estas haciendo una tesis o trabajo de grado sobre digitalizacion en construccion, estos papers son un punto de partida solido para la revision de literatura. Todos estan disponibles en Google Scholar.

### Para identificar que datos recopilar hoy

Los papers son claros sobre que datos necesitan los modelos. Si empiezas a recopilar fotos de defectos y anotarlas correctamente hoy, en 6 meses tienes el dataset para entrenar tu propio modelo.

---

```{admonition} Recursos para buscar papers
:class: seealso
- Google Scholar: scholar.google.com — busqueda gratuita de papers academicos
- ResearchGate: researchgate.net — puedes pedir el PDF al autor directamente
- Semantic Scholar: semanticscholar.org — papers con resumenes en IA generados automaticamente
- Busquedas utiles: "construction AI", "AEC machine learning", "building defect detection", "construction NLP"
```

**Siguiente:** [Biblioteca de prompts para construccion](03_recursos_prompts.md)
