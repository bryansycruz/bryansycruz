# Casos de Uso de IA para Arquitectos y Constructores

```{raw} html
<p class="tags-container"><span class="tag-badge">#casos-uso</span> <span class="tag-badge">#sin-codigo</span> <span class="tag-badge">#roi</span> <span class="tag-badge">#construccion</span> <span class="tag-badge">#practica</span></p>
```

```{admonition} Tiempo de lectura estimado: 12 min
:class: tip
Cinco aplicaciones reales de IA en obra colombiana. Cada caso explica el problema, la solucion, lo que necesitas para implementarlo y el ahorro real en tiempo o costo. Sin codigo. Sin tecnicismos innecesarios.
```

---

## Como leer esta pagina

Cada caso sigue el mismo formato:
- **El problema:** que situacion resuelve
- **Como funciona la IA:** la logica sin tecnicismos
- **Lo que necesitas:** requisitos reales (equipo, datos, costo)
- **Tiempo de implementacion:** desde cero hasta funcionando
- **Valor concreto:** tiempo o dinero ahorrado

---

## Caso 1: Deteccion automatica de defectos en fotos de inspeccion

### El problema

El inspector toma 200 fotos por semana de la obra. Revisarlas manualmente toma horas y la calificacion es subjetiva: lo que un inspector llama "fisura superficial" otro lo llama "grieta estructural". Si el inspector tiene un mal dia o esta apurado, puede pasar algo grave por alto.

### Como funciona la IA

Un modelo de vision entrenado con fotos de obra aprende a distinguir entre tipos de defectos: grieta estructural, fisura superficial, corrosion de acero, humedad/filtracion, sin defecto. Cuando le mandas una foto nueva, la clasifica en menos de un segundo con un porcentaje de confianza.

```text
Inspector toma foto con celular
          |
          v
La sube a la aplicacion
          |
          v
La IA analiza: "Grieta estructural - 91% de confianza"
          |
          v
Alerta automatica al residente si la confianza > 80% en defecto critico
```

### Lo que necesitas

- **Datos:** 100 fotos por tipo de defecto (500 fotos en total) tomadas en obra real
- **Herramienta:** Google Colab o Hugging Face (gratuito) para entrenar el modelo
- **Tiempo de un profesional:** 2-3 dias para preparar datos + 1 dia de entrenamiento
- **Costo:** $0 si usas plataformas gratuitas

### Valor concreto

| Sin IA | Con IA |
| ------ | ------ |
| 3 horas de revision manual por 200 fotos | 15 minutos de supervision de alertas |
| Criterio subjetivo del inspector | Clasificacion consistente 24/7 |
| Defecto critico detectado en reunion semanal | Alerta el mismo dia que se toma la foto |

### Limitaciones importantes

La IA no reemplaza al ingeniero estructural. Si el modelo detecta una grieta estructural, un profesional debe verificar en sitio y tomar la decision. La IA es el primer filtro, no el juicio final.

---

## Caso 2: Generador automatico de APUs

### El problema

Preparar un Analisis de Precios Unitarios (APU) para una actividad toma entre 30 minutos y 2 horas dependiendo de la complejidad. En un proyecto de 500 items, eso son cientos de horas solo en presupuestacion. El riesgo de error en cantidades o precios es alto cuando se trabaja bajo presion.

### Como funciona la IA

Le describes la actividad al modelo en lenguaje natural — exactamente como se lo describiras a un presupuestador — y el genera el APU completo con materiales, mano de obra, equipos, AIU y precio unitario. Usa precios de referencia CAMACOL 2024 para la ciudad que indiques.

```text
Tu escribes:
"Fundicion de columna de concreto reforzado 40x40cm, f'c=28MPa,
acero 8 barras #6 mas estribos #3 cada 15cm, altura 3.5m, Medellin"

La IA genera:
- Materiales: concreto premezclado, acero de refuerzo, formaleta, aditivos
- Mano de obra: oficial, ayudante, vibrador
- Equipos: mezcladora, vibrador
- AIU: 12% administracion, 3% imprevistos, 5% utilidad
- Precio unitario: $512,000 COP/m
```

### Lo que necesitas

- Acceso a Claude o ChatGPT (hay versiones gratuitas)
- Descripcion clara de la actividad (igual que como la escribirias en el pliego)
- Verificacion de precios locales (la IA da una referencia, tu validas)

### Tiempo de implementacion

Puedes usar esto **hoy mismo** con Claude o ChatGPT sin ninguna configuracion adicional. El prompt del modulo Teorico (Sistema de Prompts Avanzados) te da exactamente como estructurar la solicitud.

### Valor concreto

| Sin IA | Con IA |
| ------ | ------ |
| 1 hora por APU complejo | 5 minutos + 10 minutos de revision |
| 500 APUs = 500 horas = $15M en salarios | 500 APUs = 125 horas = $3.75M |
| Ahorro por proyecto mediano | **$11.25M COP** |

---

## Caso 3: Analisis automatico de actas de comite (RECOMASYS)

### El problema

Todas las semanas se escribe un acta de comite de obra. Ese documento tiene informacion critica: acuerdos incumplidos, alertas de calidad, retrasos de proveedores, problemas de diseno. Pero nadie tiene tiempo de leer todas las actas de los ultimos 3 meses y detectar si hay un patron de deterioro en algun aspecto del proyecto.

El resultado: los problemas se escalan en la reunion de junta cuando ya es tarde para actuar a bajo costo.

### Como funciona la IA

RECOMASYS es un sistema que lee cada acta nueva en PDF, le asigna un puntaje del 1 al 5 a siete aspectos del proyecto (calidad, cronograma, costos, seguridad, proveedores, diseno, comunicacion) y detecta tres tipos de patrones de riesgo:

```text
Patron 1 - Caida abrupta:
  Cronograma pasa de 4 a 2 en una sola acta
  → Alerta ALTA: algo grave ocurrio esta semana

Patron 2 - Deterioro progresivo:
  Calidad: 4 → 3 → 2 en tres actas consecutivas
  → Alerta MEDIA: hay una tendencia que no se ha resuelto

Patron 3 - Bajo sostenido:
  Proveedores con puntaje 1-2 por cuatro semanas seguidas
  → Alerta ALTA: el proveedor esta fallando sistematicamente
```

Cuando detecta una alerta, genera automaticamente un plan de accion: causa probable, accion inmediata, responsable y seguimiento sugerido.

### Lo que necesitas

- PDFs de las actas de comite (las que ya tienes)
- Un computador con conexion a internet
- El codigo del modulo Teorico (Casos Practicos) para instalarlo

### Valor concreto

Un defecto estructural detectado en la semana 8 cuesta $3M resolverlo. El mismo defecto detectado en la semana 20 (cuando ya esta cubierto) puede costar $50M o mas en demolicion y refundicion. RECOMASYS detecta la tendencia en la semana 10 cuando el costo de intervencion todavia es bajo.

```{admonition} Analogia
:class: note
Es como el medico que revisa los examenes de laboratorio del paciente cada semana y llama cuando ve que la hemoglobina viene bajando, antes de que el paciente llegue a urgencias.

El residente de obra es el medico. RECOMASYS son los examenes automaticos.
```

---

## Caso 4: Chatbot para consulta de documentos tecnicos

### El problema

Un proyecto mediano maneja 300-500 documentos: contratos, planos, especificaciones tecnicas, fichas tecnicas de materiales, actas de entrega, garantias de proveedores. Cuando el residente necesita verificar una especificacion en campo, buscar el documento correcto toma 15-30 minutos. Muchas veces simplemente se toma la decision sin verificar.

### Como funciona la IA

El sistema convierte todos los PDFs del proyecto en una "memoria consultable". Luego puedes hacerle preguntas en lenguaje natural y el sistema busca en todos los documentos y responde citando exactamente el documento y la pagina.

```text
Residente pregunta desde el celular:
"¿Cual es la resistencia especificada del concreto para las columnas del sotano?"

Sistema responde:
"Segun las Especificaciones Tecnicas de Estructura, pagina 12:
'Las columnas del sotano y nivel 1 tendran concreto de resistencia
a la compresion f'c = 28 MPa (280 kg/cm2). La dosificacion sera
verificada por el laboratorio de materiales antes de cada fundicion.'"
```

### Lo que necesitas

- Los PDFs del proyecto en una carpeta organizada
- El codigo del modulo Teorico (RAG) para indexarlos
- Acceso a Groq (gratuito) para el modelo de lenguaje

### Valor concreto

| Situacion | Sin chatbot | Con chatbot |
| --------- | ----------- | ----------- |
| Verificar una especificacion en campo | 20 min buscando en carpetas | 30 segundos |
| Saber si hay garantia de un equipo instalado | Llamar a la oficina | Preguntar al chatbot |
| Encontrar el plano de revision aprobado | Buscar en correo + Drive | Preguntar al chatbot |

---

## Caso 5: Asistente de planificacion y cronograma

### El problema

Cuando hay un retraso en una actividad critica, el director necesita saber rapidamente: ¿cuanto impacta al cronograma general? ¿que actividades puedo acelerar para compensar? ¿que recursos adicionales necesito? Hacer ese analisis manualmente en MS Project o Primavera toma horas.

### Como funciona la IA

Describes la situacion al asistente de IA y el analiza el impacto y propone alternativas de recuperacion:

```text
Tu escribes:
"Tenemos un retraso de 5 dias en la fundicion de la losa del nivel 8 por lluvia.
El proyecto vence en 120 dias. La ruta critica pasa por estructura y
mamposteria nivel 8. Tenemos presupuesto para un turno adicional.

¿Que opciones tenemos para recuperar el tiempo sin afectar la entrega?"

La IA responde:
"Con el retraso de 5 dias en la ruta critica, tienes tres opciones:

Opcion 1 (Recuperacion rapida): 
  Turno nocturno en estructura niveles 9-10 la proxima semana.
  Costo adicional: ~$8M. Recuperas 4 de los 5 dias.

Opcion 2 (Reorganizacion): 
  Adelantar mamposteria niveles 1-4 (no esta en ruta critica)
  con el mismo personal, sin costo adicional.
  No recuperas tiempo en ruta critica pero mejoras el avance general.

Opcion 3 (Combinada): 
  1 dia de turno nocturno en nivel 8 + adelantar instalaciones
  hidrosanitarias nivel 6. Costo: $1.5M. Recuperas 2 dias en critica."
```

### Lo que necesitas

- Claude o ChatGPT (version gratuita o de pago)
- La informacion del cronograma resumida (no necesitas exportar el archivo completo)
- El prompt adecuado (ver modulo de System Prompts Avanzados)

---

## Resumen: por donde empezar segun tu situacion

| Si tienes... | Empieza por... | Tiempo hasta primer resultado |
| ------------ | -------------- | ----------------------------- |
| 0 experiencia con IA | APU Generator con Claude gratis | Esta semana |
| Excel de avance organizado | PowerBI + dashboard basico | 1-2 dias |
| Actas de comite en PDF | RECOMASYS (requiere instalacion) | 1 semana |
| PDFs de especificaciones | Chatbot RAG (requiere instalacion) | 1 semana |
| Fotos de inspecciones | Clasificador de defectos | 2-4 semanas |

```{admonition} Recomendacion para empezar
:class: tip
Antes de instalar cualquier sistema, pasa una semana usando Claude o ChatGPT directamente en el navegador para: redactar actas, generar APUs, analizar retrasos y escribir informes. Con eso solo ya recuperas 3-5 horas semanales sin ninguna configuracion tecnica.
```
