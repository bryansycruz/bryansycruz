# Herramientas IA para Informes y Presentaciones: Speakle y otras

```{raw} html
<p class="tags-container"><span class="tag-badge">#presentaciones</span> <span class="tag-badge">#informes</span> <span class="tag-badge">#speakle</span> <span class="tag-badge">#ia-generativa</span> <span class="tag-badge">#automatizacion</span></p>
```

```{admonition} Tiempo de lectura estimado: 8 min
:class: tip
Aprenderas a usar Speakle y otras herramientas de IA para generar presentaciones, informes de avance y reportes de calidad en minutos, sin necesidad de disenadores ni de construir las diapositivas manualmente.
```

---

## El problema de los informes en obra

Un residente de obra dedica entre 3 y 5 horas semanales a preparar informes: copiar datos del Excel a PowerPoint, actualizar graficos, escribir el texto del resumen, buscar las fotos de la semana y organizarlas. Ese tiempo podria usarse en supervision directa.

Las herramientas de IA para presentaciones resuelven exactamente ese problema: toman tus datos y fotos, y generan la presentacion automaticamente.

---

## 1. Speakle: presentaciones e informes con IA

**Speakle** es una plataforma de IA que convierte texto, datos y descripcion de contenido en presentaciones visuales completas. Esta disenada para profesionales que necesitan comunicar resultados de forma clara y rapida sin ser disenadores graficos.

### Que puede hacer Speakle por una constructora

- Generar el informe semanal de avance a partir de un texto o una lista de puntos
- Crear presentaciones para junta directiva con graficos integrados automaticamente
- Convertir el acta de comite en un resumen visual ejecutivo
- Generar presentaciones de propuestas tecnicas para licitaciones

### Flujo de trabajo tipico

```text
1. Describes el informe que necesitas
   ("Informe de avance semana 12, avance 68%, problema en mamposteria nivel 5")
          |
          v
2. Speakle genera la estructura de la presentacion
   (portada + avance general + problema detectado + proximos pasos)
          |
          v
3. Revisas y ajustas el contenido generado
          |
          v
4. Exportas en PDF o PowerPoint para compartir
```

### Como acceder

- Plataforma web: busca "Speakle AI" en tu navegador
- No requiere instalacion
- Tiene version gratuita para uso basico

---

## 2. Otras herramientas complementarias

### Gamma.app — presentaciones desde texto

Gamma convierte un texto o un outline en una presentacion con diseno profesional. Puedes escribir:

```text
"Presentacion para junta directiva del Edificio Cumbre.
Temas: avance de obra al 68%, desviacion de $45M en estructura,
problema de proveedor en mamposteria, plan de accion para las proximas 2 semanas."
```

Y Gamma genera 8-10 diapositivas con diseno, iconos y estructura logica. Solo tienes que revisar y ajustar.

**Acceso:** gamma.app — version gratuita disponible

### Microsoft Copilot en PowerPoint

Si tu empresa usa Microsoft 365, Copilot puede:

- Crear una presentacion completa desde un documento Word o un texto
- Agregar diseno profesional automaticamente
- Reescribir el texto de las diapositivas en un tono mas ejecutivo
- Crear un resumen de la presentacion en una diapositiva

**Requisito:** Licencia Microsoft 365 con Copilot (disponible en planes empresariales)

### ChatGPT / Claude para el texto

Antes de usar cualquier herramienta de presentacion, puedes usar Claude o ChatGPT para estructurar el contenido:

```text
Prompt ejemplo:
"Necesito preparar el informe mensual de obra para junta directiva.
El proyecto es un edificio de 12 pisos en Medellin, avance actual 68%.
Tuvimos un problema de segregacion en 3 columnas del nivel 5 que ya se resolvio.
El proveedor de mamposteria tiene 2 semanas de retraso acumulado.
Genera una estructura de presentacion de 6 diapositivas con los puntos clave."
```

---

## 3. Generacion automatica de informes escritos

Ademas de presentaciones, la IA puede redactar el texto completo de informes tecnicos:

### Informe de avance semanal

```text
Instruccion para Claude o ChatGPT:

"Eres el asistente del residente de obra del Edificio Cumbre.
Redacta el informe de avance de la semana 14 con la siguiente informacion:
- Avance general: 71% (programado: 74%)
- Actividades completadas: fundida de losa nivel 8, instalacion de red hidraulica niveles 1-3
- Actividades en retraso: mamposteria nivel 6 por faltante de bloque
- Incidentes de calidad: ninguno
- Asistencia de personal: 94%
- Proximo hito: fundida de losa nivel 9 el viernes 15

Formato: informe formal de media pagina, tono tecnico pero directo."
```

### Acta de comite

```text
Instruccion:
"Tengo las notas de la reunion de hoy:
- Asistentes: Director, Residente, Interventor, Proveedor de acero
- Se reporto atraso de 3 dias en entrega de acero
- El proveedor se comprometio a entregar el martes
- Se decidio tener stock de 15 dias como buffer
- Proxima reunion: martes 2pm

Redacta el acta formal de la reunion con numeracion de acuerdos y responsables."
```

---

## 4. Flujo integrado: del dato a la presentacion en 20 minutos

Este flujo combina PowerBI con Speakle o Gamma para generar el informe completo de forma semi-automatica:

```text
Paso 1 (5 min): Actualiza tu Excel de avance con los datos de la semana

Paso 2 (2 min): PowerBI actualiza automaticamente los graficos

Paso 3 (5 min): Exporta los graficos clave como imagen desde PowerBI

Paso 4 (5 min): Pega los graficos en Speakle/Gamma con el texto
               del resumen que ya tienes del paso 2

Paso 5 (3 min): Exporta el PDF para compartir con la junta
```

Tiempo total: 20 minutos vs 3-5 horas del proceso manual.

---

## 5. Casos de uso especificos por rol

| Rol | Herramienta | Uso tipico |
| --- | ----------- | ---------- |
| Residente de obra | Speakle + Claude | Informe semanal de avance |
| Director de proyecto | Gamma + PowerBI | Presentacion mensual a junta |
| Interventoria | Claude | Redaccion de informes de interventoria |
| Gerente comercial | Copilot PowerPoint | Presentaciones de propuestas |
| Departamento tecnico | Claude + Word | Especificaciones tecnicas |

---

```{admonition} Por donde empezar
:class: tip
1. Esta semana: usa Claude o ChatGPT para redactar el texto de tu proximo informe de avance
2. La proxima semana: prueba Gamma.app para convertir ese texto en una presentacion
3. En un mes: conecta PowerBI a tus datos de Excel para automatizar los graficos
```

**Siguiente:** [Casos de uso de IA para constructoras](03_casos_uso_ia.md)
