# PowerBI para Proyectos de Construccion

```{raw} html
<p class="tags-container"><span class="tag-badge">#powerbi</span> <span class="tag-badge">#dashboards</span> <span class="tag-badge">#datos</span> <span class="tag-badge">#visualizacion</span> <span class="tag-badge">#construccion</span></p>
```

```{admonition} Tiempo de lectura estimado: 10 min
:class: tip
Aprenderas a usar PowerBI para crear dashboards de obra que muestran avance, costos y calidad en tiempo real, con integracion a Excel, SAP o cualquier fuente de datos que ya uses.
```

---

## 1. Que es PowerBI y por que le interesa a una constructora

**PowerBI** es la herramienta de visualizacion de datos de Microsoft. Convierte tablas de Excel, bases de datos y sistemas ERP en tableros interactivos que cualquier persona puede leer sin ser analista de datos.

Para una empresa constructora, el valor concreto es:

- Ver el avance de todos los proyectos en una sola pantalla
- Detectar desviaciones de presupuesto en tiempo real
- Identificar proveedores con retrasos recurrentes
- Comparar rendimiento entre obras o entre periodos

```{admonition} Sin PowerBI vs Con PowerBI
:class: note
**Sin PowerBI:** El director de obra recibe un Excel con 4,000 filas de avance. Le toma 2 horas armar un informe para la junta directiva. La informacion ya tiene 3 dias de retraso cuando llega.

**Con PowerBI:** El mismo Excel se conecta automaticamente al tablero. El informe se actualiza solo cada vez que alguien cambia el archivo. La junta ve los datos del dia anterior en 30 segundos.
```

---

## 2. Los cinco tableros esenciales para una constructora

### Tablero 1: Avance de obra por actividad

Muestra el porcentaje de avance programado vs ejecutado por actividad, nivel o frente de trabajo. Identifica de inmediato que esta atrasado y cuanto.

```text
Actividad               | Programado | Ejecutado | Variacion
------------------------|------------|-----------|----------
Estructura Nivel 1-3    |    100%    |   100%    |    0%
Mamposteria Nivel 4-6   |     85%    |    71%    |  -14%  <- ALERTA
Instalaciones Hidraul.  |     60%    |    58%    |   -2%
Acabados Nivel 1-2      |     40%    |    43%    |   +3%
```

### Tablero 2: Control de presupuesto (CDP)

Presupuesto inicial vs adicionales vs ejecutado por capitulo. Responde a: ¿en que capitulo estamos gastando mas de lo previsto?

### Tablero 3: Control de proveedores

Cumplimiento de entregas, calidad de materiales (rechazos), precio promedio por item. Util para negociaciones y seleccion de proveedores en futuros proyectos.

### Tablero 4: Calidad e inspecciones

Numero de no conformidades por tipo y por nivel. Tendencia de defectos en el tiempo. Inspectores con mayor tasa de hallazgos.

### Tablero 5: Flujo de caja proyectado

Pagos programados vs disponibilidad de caja. Alertas de semanas con tension de liquidez.

---

## 3. Como conectar tus datos a PowerBI

PowerBI puede conectarse a casi cualquier fuente de datos que ya uses:

| Fuente de datos | Como conectar | Frecuencia de actualizacion |
| --------------- | ------------- | --------------------------- |
| Excel en OneDrive/SharePoint | Conexion directa, automatica | Cada hora o al guardar |
| Google Sheets | Conector nativo | Cada 24 horas |
| SAP / Sinco / Opus | Conector ODBC o exportacion programada | Diaria |
| SQL Server / PostgreSQL | Conexion directa | Tiempo real |
| CSV de cualquier sistema | Importacion manual o automatica | Manual o programada |

**El flujo mas comun para una constructora mediana:**

```text
Excel de avance (residente actualiza)
          |
          v
OneDrive / SharePoint (compartido)
          |
          v
PowerBI Desktop (modelo de datos)
          |
          v
PowerBI Service (publicacion en la nube)
          |
          v
Celular / PC de la junta directiva (dashboard en vivo)
```

---

## 4. IA integrada en PowerBI: las funciones que mas ayudan

### Q&A (Preguntas en lenguaje natural)

Puedes escribir en espanol directamente en el tablero preguntas como:

- "¿Cuanto llevamos ejecutado en el capitulo de estructura?"
- "¿Cual es el proveedor con mas rechazos este mes?"
- "Muestra el avance de los ultimos 3 niveles"

PowerBI genera el grafico automaticamente sin que necesites configurar nada.

### Smart Narratives (Narraciones automaticas)

Genera un parrafo en lenguaje natural que resume lo mas importante del tablero. Util para el informe semanal: el texto se escribe solo basado en los datos actuales.

### Copilot en PowerBI (version Premium)

Con la licencia Premium de Microsoft 365, Copilot puede:

- Crear medidas y calculos a partir de instrucciones en espanol
- Sugerir visualizaciones apropiadas para cada tipo de dato
- Generar resumenes ejecutivos automaticos del tablero

---

## 5. Paso a paso: tu primer tablero de obra en 30 minutos

### Paso 1: Descarga PowerBI Desktop (gratuito)

Descarga desde: [powerbi.microsoft.com](https://powerbi.microsoft.com) — la version Desktop es completamente gratuita.

### Paso 2: Prepara tu Excel de avance

Tu Excel necesita al menos estas columnas:

| Fecha | Actividad | Nivel | Programado_% | Ejecutado_% | Responsable |
| ----- | --------- | ----- | ------------ | ----------- | ----------- |
| 2024-01-15 | Estructura | Nivel 3 | 80 | 72 | Ing. Lopez |
| 2024-01-15 | Mamposteria | Nivel 1 | 100 | 100 | Ing. Lopez |

### Paso 3: Conectar en PowerBI

```text
PowerBI Desktop → Obtener datos → Excel → Selecciona tu archivo
→ Selecciona la hoja → Cargar
```

### Paso 4: Crear el grafico de avance

```text
Panel Visualizaciones → Grafico de barras agrupadas
→ Eje X: Actividad
→ Eje Y: Programado_% y Ejecutado_%
→ Colores diferentes para cada serie
```

### Paso 5: Agregar filtro por fecha

```text
Panel Visualizaciones → Segmentacion de datos
→ Campo: Fecha
→ Tipo: Rango de fechas
```

Con eso tienes un dashboard basico funcional. Puedes publicarlo en la nube para que todo el equipo lo vea desde su celular.

---

## 6. Plantillas listas para construccion

Microsoft y la comunidad de PowerBI tienen plantillas especificas para construccion que puedes adaptar:

- **Construction Project Tracker** — seguimiento de actividades, hitos y presupuesto
- **Supplier Performance Dashboard** — evaluacion de proveedores
- **Safety Incident Report** — seguimiento de incidentes de seguridad

Busca "construction PowerBI template" en [community.powerbi.com](https://community.powerbi.com) para encontrar plantillas gratuitas.

---

```{admonition} Recursos
:class: seealso
- PowerBI Desktop: gratuito en powerbi.microsoft.com
- Curso PowerBI en espanol: canal "PowerBI en Espanol" en YouTube
- Plantillas para construccion: community.powerbi.com
- Integracion con SAP y Sinco: consulta al proveedor de tu ERP
```

**Siguiente:** [Speakle y herramientas IA para presentaciones](02_speakle_construccion.md)
