# Kaggle y Google Colab: Practica sin Instalar Nada

```{raw} html
<p class="tags-container"><span class="tag-badge">#kaggle</span> <span class="tag-badge">#colab</span> <span class="tag-badge">#gpu-gratis</span> <span class="tag-badge">#practica</span> <span class="tag-badge">#python</span></p>
```

```{admonition} Tiempo de lectura estimado: 10 min
:class: tip
Aprenderas a usar Google Colab para ejecutar los ejemplos de este curso directamente en el navegador, y Kaggle para encontrar datasets de construccion y practicar con machine learning de forma gratuita.
```

---

## El problema de empezar con IA

La barrera mas comun para empezar con IA no es la matematica ni el codigo: es la instalacion. Configurar Python, instalar librerias, resolver conflictos de versiones puede tomar dias y frustrar a cualquiera antes de escribir la primera linea de codigo util.

**La solucion:** Google Colab y Kaggle te dan un entorno listo para usar, con todas las librerias instaladas, sin costo y sin instalacion local. Solo necesitas un navegador web y una cuenta de Google.

---

## 1. Google Colab: el cuaderno en la nube

### Que es

Google Colab es una version de Jupyter Notebook que corre completamente en los servidores de Google. Tu computador solo muestra la interfaz — todo el procesamiento ocurre en la nube.

### Por que es ideal para este curso

- **GPU gratuita:** Google te da acceso a una GPU T4 (15 GB de VRAM) gratis. Es suficiente para correr QLoRA con modelos pequenos.
- **Todo instalado:** TensorFlow, PyTorch, scikit-learn, transformers, pandas — ya estan disponibles sin instalar nada.
- **Comparte como Google Docs:** un cuaderno de Colab se comparte con un link. Tu equipo puede ver y ejecutar el mismo codigo.
- **Conectado a Google Drive:** guardas tus notebooks y datos directamente en tu Drive.

### Como crear tu primera cuenta y abrir un notebook

```text
Paso 1: Ve a colab.research.google.com
Paso 2: Inicia sesion con tu cuenta de Google (la misma del Gmail)
Paso 3: Haz clic en "Nuevo cuaderno"
Paso 4: Escribe en la primera celda:
         print("Hola desde Google Colab")
Paso 5: Presiona Shift + Enter para ejecutar
```

Veras el mensaje "Hola desde Google Colab" debajo de la celda. Ya tienes un entorno Python funcionando.

### Como activar la GPU gratuita

```text
Menu superior → Entorno de ejecucion → Cambiar tipo de entorno de ejecucion
→ Acelerador de hardware → GPU → Guardar
```

La GPU T4 gratuita tiene un limite de uso diario (tipicamente 4-8 horas seguidas). Para los ejemplos de este curso es mas que suficiente.

### Ejecutar los ejemplos de este curso en Colab

Cualquier bloque de codigo de la seccion Teorico puedes copiarlo en Colab y ejecutarlo. El unico paso adicional es instalar las librerias que no vienen por defecto:

```python
# Ejemplo: instalar librerias del modulo de RAG
!pip install sentence-transformers faiss-cpu groq PyPDF2

# Luego importar y usar normalmente
from sentence_transformers import SentenceTransformer
import faiss
```

El signo `!` antes de pip le indica a Colab que ejecute el comando en la terminal del sistema.

### Guardar tu trabajo

```text
Archivo → Guardar una copia en Drive
```

Tu notebook queda guardado en Google Drive y puedes acceder desde cualquier dispositivo.

---

## 2. Kaggle: datasets, notebooks y competencias

### Que es Kaggle

Kaggle es la plataforma de machine learning mas grande del mundo (propiedad de Google). Tiene tres componentes que te interesan:

**Datasets:** mas de 50,000 datasets publicos y gratuitos. Alguien ya recopilo y limpio los datos — tu solo los usas.

**Notebooks:** similar a Colab, pero con datasets ya disponibles en la misma plataforma. Cada notebook puede usar hasta 30 horas de GPU por semana de forma gratuita.

**Competencias:** problemas reales con premios en dinero. No es necesario para este curso, pero si te interesa profundizar es la mejor forma de aprender resolviendo problemas reales.

### Como crear una cuenta

```text
1. Ve a kaggle.com
2. Haz clic en "Register"
3. Puedes registrarte con tu cuenta de Google
4. Verifica tu numero de telefono (necesario para acceder a la GPU)
```

### Datasets relevantes para construccion y AEC

Busca en kaggle.com/datasets estos terminos para encontrar datos del sector:

| Busqueda | Que encontraras |
| -------- | --------------- |
| `construction defect` | Datasets de imagenes de defectos en obras |
| `concrete crack` | Imagenes de grietas en concreto clasificadas |
| `building cost` | Datos de costos de construccion por region |
| `construction project` | Datasets de proyectos con cronograma y costos |
| `cement strength` | Datos de resistencia de concreto segun dosificacion |
| `house price` | Datos de precios de inmuebles (utiles para estimar costos) |

### Ejemplo: dataset de grietas en concreto

El dataset "Concrete Crack Images for Classification" en Kaggle tiene 40,000 imagenes de concreto clasificadas en "grieta" y "sin grieta". Es exactamente el tipo de dato que necesitas para entrenar el clasificador de defectos del Modulo 10.

```text
Kaggle → Datasets → Buscar "concrete crack" → Descargar o usar en Notebook
```

### Crear un notebook en Kaggle

```text
1. Abre cualquier dataset
2. Haz clic en "New Notebook"
3. El dataset ya esta disponible en la ruta /kaggle/input/nombre-del-dataset/
4. Escribe y ejecuta tu codigo
```

---

## 3. Diferencias entre Colab y Kaggle: cuando usar cada uno

| Situacion | Herramienta recomendada |
| --------- | ----------------------- |
| Copiar y ejecutar ejemplos del curso | Google Colab |
| Buscar y explorar datasets del sector | Kaggle |
| Entrenar un modelo con datos de Kaggle | Kaggle Notebooks |
| Compartir tu trabajo con el equipo | Google Colab (link de Drive) |
| Correr modelos que necesitan mucha GPU | Kaggle (30h/semana gratuitas) |
| Conectar con Google Drive para tus propios datos | Google Colab |

---

## 4. Flujo de trabajo recomendado para el curso

```text
Semana 1-2 (Modulos 1-4):
  Colab → Copia los ejemplos de ML y LLMs, ejecuta y modifica los parametros

Semana 3-4 (Modulos 5-6):
  Colab → Instala sentence-transformers y faiss, indexa tus propios PDFs

Semana 5-6 (Modulos 7-8):
  Colab → Prueba los prompts con la API de Anthropic o Groq

Semana 7-8 (Modulos 9-10):
  Kaggle → Entrena el clasificador de defectos con datasets de grietas
  Colab → Implementa RECOMASYS con tus propias actas de comite
```

---

## 5. Recursos adicionales gratuitos

| Recurso | Donde encontrarlo | Que ofrece |
| ------- | ----------------- | ---------- |
| Google Colab | colab.research.google.com | GPU T4 gratuita, notebooks Python |
| Kaggle | kaggle.com | Datasets, notebooks, GPU gratis |
| Hugging Face | huggingface.co | Modelos preentrenados, datasets, spaces |
| Weights & Biases | wandb.ai | Monitoreo de entrenamientos (gratis para proyectos personales) |

```{admonition} Consejo practico
:class: tip
Si eres nuevo en Python, no empieces con un proyecto complejo. Empieza por correr los ejemplos del Modulo 1 en Colab exactamente como estan. Luego cambia un parametro (por ejemplo, el numero de vecinos en un modelo) y observa que pasa. El aprendizaje viene de experimentar, no de leer.
```

**Siguiente:** [Papers clave: IA en construccion](02_papers_clave.md)
