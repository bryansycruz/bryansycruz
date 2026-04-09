# Biblioteca de Prompts para Construccion

```{admonition} Tiempo de lectura estimado: 10 min
:class: tip
Plantillas de prompts listas para copiar y usar con Claude o ChatGPT. Cada plantilla esta disenada para una tarea especifica del sector de la construccion. Solo reemplaza el texto entre corchetes con tu informacion real.
```

---

## Como usar esta biblioteca

1. Abre Claude (claude.ai) o ChatGPT (chatgpt.com)
2. Copia el prompt que necesitas
3. Reemplaza `[TEXTO ENTRE CORCHETES]` con tu informacion
4. Pega y envia

Para mejores resultados, usa Claude Sonnet o ChatGPT-4o. Las versiones gratuitas tambien funcionan pero con respuestas menos detalladas.

---

## Seccion 1: Prompts para presupuestacion

### Prompt 1: Generar APU completo

```text
Eres un presupuestador experto en construccion colombiana con 15 anos de
experiencia en proyectos residenciales y comerciales en [CIUDAD].

Genera un APU completo para la siguiente actividad usando precios CAMACOL 2024:

ACTIVIDAD: [DESCRIBE LA ACTIVIDAD EN DETALLE]
Por ejemplo: "Fundicion de columna de concreto reforzado 40x40cm, f'c=28MPa,
acero 8 barras #6 mas estribos #3 cada 15cm, altura 3.5m"

CIUDAD: [CIUDAD]

Incluye:
- Materiales con cantidades y precios unitarios en COP
- Mano de obra (oficial, ayudante, especialistas)
- Equipos y herramientas
- AIU: 12% administracion, 3% imprevistos, 5% utilidad
- Precio unitario final en COP/unidad
- Notas sobre variaciones de precio segun zona o condiciones
```

---

### Prompt 2: Revisar un presupuesto existente

```text
Eres un revisor experto en presupuestos de construccion colombiana.
Revisa el siguiente presupuesto e identifica:

1. Items con precios atipicos (muy altos o muy bajos para el mercado 2024)
2. Items que probablemente faltan para ejecutar la obra correctamente
3. AIU: verifica si el porcentaje es adecuado para el tipo de proyecto
4. Observaciones sobre la organizacion por capitulos

TIPO DE PROYECTO: [ej. edificio residencial de 8 pisos, Medellin]
PRESUPUESTO:
[PEGA AQUI EL PRESUPUESTO EN TEXTO O TABLA]
```

---

### Prompt 3: Comparar propuestas de proveedores

```text
Tengo tres propuestas de proveedores para [DESCRIPCION DEL ITEM].
Analiza y recomienda cual elegir considerando: precio, condiciones de pago,
experiencia requerida y riesgos.

PROPUESTA 1 - [NOMBRE PROVEEDOR]:
[PEGA LA PROPUESTA]

PROPUESTA 2 - [NOMBRE PROVEEDOR]:
[PEGA LA PROPUESTA]

PROPUESTA 3 - [NOMBRE PROVEEDOR]:
[PEGA LA PROPUESTA]

Dame una tabla comparativa y una recomendacion justificada.
```

---

## Seccion 2: Prompts para documentos tecnicos

### Prompt 4: Redactar acta de comite de obra

```text
Redacta el acta formal de la reunion de comite de obra con la siguiente
informacion. Usa un formato profesional con numeracion de acuerdos.

PROYECTO: [NOMBRE DEL PROYECTO]
FECHA: [FECHA]
LUGAR: [LUGAR]
ASISTENTES: [LISTA DE ASISTENTES CON CARGOS]

PUNTOS TRATADOS:
[ESCRIBE LOS TEMAS DISCUTIDOS EN FORMATO DE NOTAS, NO NECESITAS REDACTAR BIEN]

ACUERDOS ALCANZADOS:
[LISTA LOS ACUERDOS TOMADOS]

COMPROMISOS Y RESPONSABLES:
[QUIEN HACE QUE Y PARA CUANDO]

PROXIMA REUNION: [FECHA Y HORA]

El acta debe tener maximo 1 pagina. Tono formal pero directo.
```

---

### Prompt 5: Generar especificacion tecnica

```text
Eres un ingeniero civil experto en especificaciones tecnicas para construccion
en Colombia. Genera la especificacion tecnica para la siguiente actividad
siguiendo el formato INVIAS/NSR-10 cuando aplique.

ACTIVIDAD: [NOMBRE DE LA ACTIVIDAD]
Ejemplo: "Concreto estructural de columnas f'c = 28 MPa"

PROYECTO: [TIPO DE PROYECTO]
NORMA APLICABLE: [NSR-10 / RETIE / NTC que aplique, o "determina tu"]

La especificacion debe incluir:
1. Alcance
2. Materiales y sus normas de calidad (referencias NTC/ASTM)
3. Equipos requeridos
4. Proceso de ejecucion paso a paso
5. Control de calidad y pruebas
6. Medicion y pago
```

---

### Prompt 6: Analizar un acta de comite

```text
Eres un director de obra experto en proyectos de construccion colombiana.
Analiza el siguiente extracto de acta de comite y dame:

1. Los 3 problemas mas criticos mencionados (ordenados por urgencia)
2. Compromisos que vencen esta semana y responsables
3. Alertas tempranas: temas que podrian escalar si no se atienden
4. Una pregunta clave que deberia hacerse en la proxima reunion

ACTA:
[PEGA EL TEXTO DEL ACTA AQUI]
```

---

## Seccion 3: Prompts para planificacion y cronograma

### Prompt 7: Analizar impacto de un retraso

```text
Soy el director de un proyecto de construccion. Necesito analizar el
impacto de un retraso y proponer opciones de recuperacion.

PROYECTO: [DESCRIPCION BREVE]
DURACION TOTAL: [X] semanas. Semana actual: [X]
ACTIVIDAD RETRASADA: [ACTIVIDAD] — retraso de [X] dias
RUTA CRITICA ACTUAL: [LISTA LAS ACTIVIDADES CRITICAS]
RECURSOS ADICIONALES DISPONIBLES: [PRESUPUESTO O PERSONAL EXTRA DISPONIBLE]
RESTRICCIONES: [LIMITACIONES: no se puede trabajar domingo, etc.]

Dame:
1. Impacto real en la fecha de entrega si no se actua
2. Tres opciones de recuperacion ordenadas por costo
3. La opcion que recomendarias y por que
```

---

### Prompt 8: Planificar actividades de la semana

```text
Eres el residente de obra de [PROYECTO]. Basado en el estado actual,
ayudame a planificar las actividades de la proxima semana.

AVANCE ACTUAL:
- [ACTIVIDAD 1]: [%] completado
- [ACTIVIDAD 2]: [%] completado
- [ACTIVIDAD 3]: [%] completado

RESTRICCIONES PARA LA PROXIMA SEMANA:
- Personal disponible: [X] personas
- Materiales pendientes de llegada: [LISTA]
- Actividades que no pueden iniciar hasta que termine otra: [LISTA]
- Presupuesto para horas extra: [DISPONIBLE / NO DISPONIBLE]

OBJETIVO: [QUE QUIERES LOGRAR AL FINAL DE LA SEMANA]

Genera un programa de actividades diario (lunes a sabado) con responsables.
```

---

## Seccion 4: Prompts para informes y comunicaciones

### Prompt 9: Informe de avance semanal

```text
Redacta el informe de avance de obra para la semana [NUMERO].
El informe es para la junta directiva. Tono: tecnico pero ejecutivo.
Maximo 1 pagina.

PROYECTO: [NOMBRE]
PERIODO: [FECHAS]
AVANCE GENERAL: [%] (programado: [%])

LOGROS DE LA SEMANA:
[LISTA DE ACTIVIDADES COMPLETADAS]

PROBLEMAS Y ESTADO:
[LISTA DE PROBLEMAS CON SU ESTADO ACTUAL: resuelto / en gestion / pendiente]

PLAN PROXIMA SEMANA:
[ACTIVIDADES PRINCIPALES PARA LA SEMANA SIGUIENTE]

INDICADORES CLAVE:
- Asistencia de personal: [%]
- Incidentes de seguridad: [NUMERO]
- No conformidades de calidad: [NUMERO]
- Variacion de presupuesto acumulada: [+/-]%
```

---

### Prompt 10: Comunicacion a proveedor por incumplimiento

```text
Redacta una comunicacion formal (carta o correo) a un proveedor
por incumplimiento en la entrega. Tono: firme pero profesional,
sin cerrar la relacion comercial.

DESTINATARIO: [NOMBRE Y CARGO DEL CONTACTO EN EL PROVEEDOR]
EMPRESA PROVEEDORA: [NOMBRE]
ITEM INCUMPLIDO: [DESCRIPCION DEL MATERIAL O SERVICIO]
FECHA PACTADA: [FECHA]
FECHA ACTUAL: [FECHA]
DIAS DE RETRASO: [X]
IMPACTO EN OBRA: [COMO AFECTA EL RETRASO AL PROYECTO]
ACCION REQUERIDA: [QUE ESPERAS DEL PROVEEDOR: fecha comprometida, compensacion, etc.]
CONSECUENCIAS SI NO CUMPLE: [DESCUENTO / SUSPENSION / OTRO]
```

---

## Seccion 5: Prompts para normativa y consultas tecnicas

### Prompt 11: Consultar normativa NSR-10

```text
Eres un ingeniero estructural experto en la Norma Sismorresistente NSR-10
de Colombia. Responde la siguiente consulta de forma clara y precisa,
citando el capitulo y articulo especifico de la NSR-10.

CONSULTA: [ESCRIBE TU PREGUNTA TECNICA]

Ejemplos de consultas validas:
"¿Cual es la separacion maxima entre estribos en columnas de zona sismica alta?"
"¿Que requisitos tiene la junta de construccion entre la placa y la viga?"
"¿Cuando se requiere estudio de suelos para un edificio de 3 pisos?"

Nota: Siempre verifica las respuestas con el texto oficial de la NSR-10.
La IA puede cometer errores en referencias normativas especificas.
```

---

### Prompt 12: Generar lista de chequeo de inspeccion

```text
Genera una lista de chequeo de inspeccion de calidad para la siguiente
actividad de construccion. Incluye los puntos de control criticos segun
la NSR-10 y las buenas practicas del sector.

ACTIVIDAD: [NOMBRE DE LA ACTIVIDAD]
Ejemplos:
- "Inspeccion previa a fundicion de columnas de concreto"
- "Recepcion de materiales de acero de refuerzo"
- "Inspeccion de instalacion de mamposteria"

FORMATO: tabla con columnas: Item / Criterio de aceptacion / Resultado (OK/NO OK) / Observaciones
```

---

## Consejos para obtener mejores resultados

### Da contexto especifico

Malo: "¿Cuanto cuesta una columna?"
Bueno: "¿Cuanto cuesta fundir una columna de 40x40cm, f'c=28MPa, con acero 8#6 + estribos #3@15cm, altura 3.5m, en Bogota, con precios del segundo semestre de 2024?"

### Pide el formato que necesitas

Agrega al final del prompt:
- "Responde en formato de tabla"
- "Maximo 200 palabras"
- "Responde en formato de correo formal"
- "Dame una lista numerada de pasos"

### Itera y mejora

Si la primera respuesta no es exactamente lo que necesitas, no empieces de cero. Agrega:
- "Hazla mas corta / mas detallada"
- "Agrega precios especificos"
- "Cambia el tono a mas formal / mas directo"

### Verifica la informacion critica

La IA puede equivocarse en:
- Precios especificos (usa CAMACOL o tus proveedores para validar)
- Referencias normativas exactas (verifica en el texto oficial de NSR-10)
- Cantidades de obra (siempre calcula tu o pide al residente que verifique)

```{admonition} Regla de oro
:class: note
Trata la IA como un asistente muy capaz pero sin experiencia en tu proyecto especifico. Te ahorra tiempo en la redaccion y estructura, pero tu conocimiento del proyecto es irreemplazable para validar lo que genera.
```
