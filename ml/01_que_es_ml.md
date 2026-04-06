# 🤖 ¿Qué es Machine Learning?

```{admonition} ¿Para qué sirve este módulo?
:class: tip
Al terminar este módulo podrás identificar qué problemas de tu obra o proyecto se pueden resolver con Machine Learning, y entenderás cómo las máquinas "aprenden" de datos reales.
```

## Definición

**Machine Learning** (Aprendizaje Automático) es el diseño y estudio de herramientas informáticas que utilizan la **experiencia pasada** para tomar **decisiones futuras**.

En lugar de escribir reglas manualmente (`si grieta > 5mm → alerta`), le damos **ejemplos** al modelo y él encuentra los patrones por sí solo.

> *"El objetivo del ML es generalizar: inducir una regla desconocida a partir de ejemplos donde esa regla ya fue aplicada."*

---

## Analogía para la construcción

```{admonition} 🏗️ ML es como un residente de obra experimentado
Un residente nuevo necesita instrucciones para cada situación. Pero después de 100 proyectos, cuando ve nubes negras en el cielo **automáticamente sabe** que debe proteger el acero, avisar a las cuadrillas y reprogramar las fundidas.

No necesita que nadie le diga las reglas — **aprendió los patrones** de sus experiencias pasadas. Machine Learning hace exactamente lo mismo con datos.
```

---

## Casos de uso en el sector AEC

| Problema | ¿Cómo ayuda el ML? |
|----------|-------------------|
| Estimación de costos | Predice el costo final basado en proyectos históricos similares |
| Retrasos en obra | Predice demoras según condiciones históricas (clima, proveedores) |
| Detección de defectos | Identifica grietas o fisuras en fotos de inspección |
| Gestión de inventario | Predice cuánto material se necesitará y cuándo |
| Productividad | Detecta patrones en el rendimiento de cuadrillas |
| Análisis de actas | Detecta problemas en actas de comité antes de que escalen |

---

## Ejemplo práctico: Predicción de consumo de concreto

**Problema:** ¿Cuántas toneladas de concreto necesitaremos la próxima semana?

```python
# Datos históricos de obra
semana_1 = {"clima": "soleado", "pisos_fundidos": 3, "toneladas": 45}
semana_2 = {"clima": "lluvioso", "pisos_fundidos": 2, "toneladas": 30}
semana_3 = {"clima": "soleado", "pisos_fundidos": 4, "toneladas": 52}

# El modelo aprende:
# - Clima soleado → mayor consumo
# - Más pisos    → mayor consumo
# - Lluvia       → menor consumo

# Predicción para semana 4 (soleado, 3 pisos):
prediccion = 47  # toneladas
```

El modelo no fue programado con estas reglas — las **descubrió solo** a partir de los datos históricos.

---

## ¿Cómo se relacionan IA, ML y Deep Learning?

```
┌──────────────────────────────────────────────┐
│           Inteligencia Artificial             │
│  ┌────────────────────────────────────────┐  │
│  │         Machine Learning               │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │        Deep Learning             │  │  │
│  │  │  ┌────────────────────────────┐  │  │  │
│  │  │  │     IA Generativa          │  │  │  │
│  │  │  │  (LLMs, Difusión, etc.)    │  │  │  │
│  │  │  └────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

| Etapa | En construcción | En IA |
|-------|----------------|-------|
| Manual | Cálculos a mano, planos en papel | Reglas escritas por programadores |
| Asistida | AutoCAD, Excel con fórmulas | Machine Learning supervisado |
| Automatizada | BIM, análisis FEM | Deep Learning, redes neuronales |
| Generativa | Diseño generativo | LLMs, IA generativa |

---

```{admonition} 💡 Para reflexionar
:class: note
No necesitas ser experto en matemáticas para usar ML. Necesitas entender bien **tus datos** y **tu problema**. El ML es una herramienta más — como Revit o un teodolito.
```

**Siguiente:** [Tipos de Machine Learning →](02_tipos_ml.md)
