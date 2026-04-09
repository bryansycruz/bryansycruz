# Módulo 9: Fine-Tuning de Modelos

```{admonition} Tiempo de lectura estimado: 11 min
:class: tip
Aprenderás cuándo vale la pena hacer fine-tuning, la diferencia entre las técnicas disponibles (LoRA, QLoRA, Full), y cómo entrenar un modelo para analizar actas y documentos técnicos de construcción.
```

---

## 1. Teoría: ¿Qué es Fine-Tuning?

**Fine-tuning** es el proceso de continuar el entrenamiento de un modelo pre-entrenado usando datos específicos de tu dominio. En lugar de entrenar desde cero (lo que requeriría billones de tokens y millones de dólares), partimos de un modelo que ya "entiende el lenguaje" y le enseñamos las particularidades de tu industria.

### Tipos de fine-tuning

```text
+---------------------------------------------------+
|            Modelo base (ej: Llama 70B)            |
|   Pre-entrenado con billones de tokens generales  |
+---------------------------------------------------+
              |               |              |
              v               v              v
    +----------+      +----------+  +----------+
    |Full Fine- |      |  LoRA    |  |  QLoRA   |
    |Tuning     |      |          |  |          |
    |Todos los  |      |Solo capas|  |LoRA + 4  |
    |parámetros |      |adicional.|  |bits quant.|
    |640 GB GPU |      |16 GB GPU |  |12 GB GPU |
    |$5,000     |      |$500      |  |$100      |
    +----------+      +----------+  +----------+
```

### ¿Cómo funciona LoRA?

LoRA (Low-Rank Adaptation) no modifica los pesos originales del modelo. En cambio, agrega **matrices de adaptación de bajo rango** a ciertas capas:

```text
Pesos originales W (congelados):  [4096 x 4096] = 16.7M parámetros
LoRA: A [4096 x 8] + B [8 x 4096] =   65K parámetros (0.4%)

La salida se calcula como: W·x + (B·A)·x
```

Esto permite:
- Entrenar solo el 0.1 - 1% de los parámetros totales
- Mantener el modelo base intacto (puedes combinar varios LoRA)
- Requisitos de GPU radicalmente menores

---

## 2. ¿Cuándo hacer fine-tuning?

No siempre es la mejor opción. Sigue este árbol de decisión:

```text
¿Puedes resolver con prompting bien diseñado?
      |
      +-- SÍ --> Usa prompting (más rápido, más barato)
      |
      NO
      |
¿Puedes resolver con RAG (tus documentos)?
      |
      +-- SÍ --> Usa RAG (más flexible, actualizable)
      |
      NO
      |
¿Tienes 500+ ejemplos anotados de tu dominio?
      |
      +-- NO --> Recolecta datos primero
      |
      SÍ
      |
¿Necesitas formato de salida muy específico
o terminología muy especializada?
      |
      +-- SÍ --> Fine-tuning vale la pena
      |
      NO --> Revisa prompting + RAG más cuidadosamente
```

### Tabla comparativa

| Aspecto | Solo Prompting | RAG | Fine-Tuning |
| ------- | -------------- | --- | ----------- |
| Complejidad | Baja | Media | Alta |
| Costo setup | $0 | $50-200 | $100-5000 |
| Datos necesarios | 0 | 10-100 docs | 500+ ejemplos |
| Actualizable | Inmediato | Inmediato | Requiere re-entrenar |
| Precisión dominio | 60-70% | 80-90% | 90-97% |
| Tiempo hasta producción | Horas | Días | Semanas |

---

## 3. Analogía con la construcción

```{admonition} Fine-tuning = Especializar a un profesional general
:class: note
Un ingeniero civil recién graduado sabe estructuras, hidráulica, geotecnia, vías. Conocimiento amplio pero genérico.

Si lo pones a trabajar 2 años SOLO en cimentaciones de alta complejidad en terrenos arcillosos de Bogotá, se convierte en un especialista que supera a cualquier generalista en ese tema específico.

**Prompting** = Darle instrucciones al generalista en cada consulta.
**RAG** = Darle acceso a los expedientes de proyectos similares.
**Fine-tuning** = Los 2 años de práctica específica que lo hacen especialista.

El fine-tuning tiene sentido cuando la especialización justifica la inversión.
```

---

## 4. Ejemplo práctico: Fine-tuning para análisis de actas (ABSA)

**Objetivo:** Entrenar un modelo para hacer Análisis de Sentimientos Basado en Aspectos (ABSA) sobre actas de comité de obra.

**Salida esperada:** JSON con scores 1-5 para 7 aspectos (calidad, cronograma, costos, seguridad, proveedores, diseño, comunicación).

### Paso 1: Preparar el dataset

```python
import json
from pathlib import Path

# Estructura de cada ejemplo de entrenamiento
ejemplo = {
    "messages": [
        {
            "role": "system",
            "content": """Analiza el texto de un acta de comité de construcción
y extrae scores ABSA (1-5) para cada aspecto. Responde solo con JSON."""
        },
        {
            "role": "user",
            "content": "3 columnas en nivel 5 presentan segregación. Supervisor exige demolición y refundición. Proveedor solicita reparación con epóxico para ahorrar 2 semanas."
        },
        {
            "role": "assistant",
            "content": json.dumps({
                "calidad": {"score": 1, "sentimiento": "crítico",
                           "evidencia": "segregación en columnas estructurales"},
                "cronograma": {"score": 3, "sentimiento": "neutral",
                              "evidencia": "posible impacto de 2 semanas"},
                "proveedores": {"score": 2, "sentimiento": "negativo",
                               "evidencia": "propone solución inadecuada"}
            }, ensure_ascii=False)
        }
    ]
}

# Necesitas 500-1000 ejemplos como este
print(f"Ejemplo creado: {json.dumps(ejemplo, indent=2, ensure_ascii=False)[:200]}...")
```

### Paso 2: Fine-tuning con OpenAI (más accesible)

```python
from openai import OpenAI
import json

client = OpenAI()

# 1. Subir el dataset
with open("dataset_absa_obra.jsonl", "rb") as f:
    archivo = client.files.create(file=f, purpose="fine-tune")

print(f"Archivo subido: {archivo.id}")

# 2. Iniciar el job de fine-tuning
job = client.fine_tuning.jobs.create(
    training_file=archivo.id,
    model="gpt-4o-mini",       # modelo base (más económico)
    hyperparameters={
        "n_epochs": 3,          # pasadas sobre el dataset
        "batch_size": 4,        # ejemplos por batch
        "learning_rate_multiplier": 1.0
    }
)

print(f"Job iniciado: {job.id}")
print(f"Estado: {job.status}")

# 3. Monitorear el progreso
import time
while job.status not in ["succeeded", "failed"]:
    time.sleep(60)
    job = client.fine_tuning.jobs.retrieve(job.id)
    print(f"Estado: {job.status}")

modelo_fine_tuned = job.fine_tuned_model
print(f"Modelo listo: {modelo_fine_tuned}")

# 4. Usar el modelo fine-tuneado
respuesta = client.chat.completions.create(
    model=modelo_fine_tuned,
    messages=[
        {"role": "system", "content": "Analiza actas y extrae ABSA en JSON."},
        {"role": "user", "content": "Avance nivel 8 al 85%. Sin novedades de calidad. Lluvia retrasa fundida de losa."}
    ]
)

datos = json.loads(respuesta.choices[0].message.content)
print(f"Resultado: {json.dumps(datos, indent=2, ensure_ascii=False)}")
```

---

## 5. Fine-tuning eficiente con QLoRA (modelos open-source)

Para modelos como Llama 3 en GPU propia o Google Colab:

```python
# Requiere: pip install transformers peft bitsandbytes datasets trl
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer
from datasets import Dataset
import torch

# 1. Configuracion de cuantizacion a 4 bits (QLoRA)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

# 2. Cargar modelo base cuantizado
modelo = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.2-3B-Instruct",
    quantization_config=bnb_config,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

# 3. Configurar LoRA
lora_config = LoraConfig(
    r=16,               # rango de las matrices de adaptacion
    lora_alpha=32,      # factor de escala
    target_modules=["q_proj", "v_proj"],  # capas a adaptar
    lora_dropout=0.1,
    bias="none",
    task_type="CAUSAL_LM"
)

modelo_lora = get_peft_model(modelo, lora_config)

# Parametros entrenables vs total
trainable = sum(p.numel() for p in modelo_lora.parameters() if p.requires_grad)
total = sum(p.numel() for p in modelo_lora.parameters())
print(f"Parametros entrenables: {trainable:,} ({trainable/total:.1%} del total)")
# Output: Parámetros entrenables: 3,407,872 (0.1% del total)

# 4. Cargar dataset
dataset = Dataset.from_json("dataset_absa_obra.jsonl")

# 5. Entrenar
trainer = SFTTrainer(
    model=modelo_lora,
    train_dataset=dataset,
    max_seq_length=512,
    tokenizer=tokenizer,
    args=TrainingArguments(
        output_dir="./modelo_obra_lora",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=50,
        save_strategy="epoch"
    )
)

trainer.train()
modelo_lora.save_pretrained("./modelo_obra_lora_final")
print("Modelo fine-tuneado guardado.")
```

### Requisitos de hardware

| Técnica | GPU mínima | VRAM | Tiempo (1000 ejemplos) | Costo aprox. |
| ------- | ---------- | ---- | ---------------------- | ------------ |
| **Full Fine-Tuning (Llama 70B)** | 8x A100 | 640 GB | 48 horas | $5,000 |
| **LoRA (Llama 13B)** | RTX 3090 | 24 GB | 4 horas | $80 |
| **QLoRA (Llama 70B)** | RTX 4090 | 24 GB | 12 horas | $100 |
| **QLoRA (Llama 3B)** | Google Colab T4 | 16 GB | 45 min | Gratis |

---

## 6. Evaluar el modelo fine-tuneado

```python
from sklearn.metrics import classification_report
import json

def evaluar_modelo_absa(modelo, tokenizer, casos_prueba: list) -> dict:
    """
    casos_prueba: [{"texto": "...", "esperado": {...}}]
    """
    predicciones = []
    ground_truth = []

    for caso in casos_prueba:
        prompt = f"Analiza este fragmento de acta:\n{caso['texto']}"
        respuesta = generar_respuesta(modelo, tokenizer, prompt)

        try:
            pred = json.loads(respuesta)
            # Extraer score de calidad para evaluar
            predicciones.append(pred.get("calidad", {}).get("score", 0))
            ground_truth.append(caso["esperado"]["calidad"]["score"])
        except json.JSONDecodeError:
            predicciones.append(-1)  # JSON inválido = error
            ground_truth.append(caso["esperado"]["calidad"]["score"])

    # Comparar
    errores = [abs(p - g) for p, g in zip(predicciones, ground_truth)]
    mae = sum(errores) / len(errores)
    exactos = sum(1 for e in errores if e == 0) / len(errores)

    print(f"MAE (error absoluto medio): {mae:.2f} puntos")
    print(f"Accuracy exacto: {exactos:.1%}")
    return {"mae": mae, "accuracy": exactos}

# Resultado esperado tras fine-tuning:
# MAE: 0.3 puntos (vs 1.1 del modelo base)
# Accuracy exacto: 74% (vs 38% del modelo base)
```

---

```{admonition} Recursos
:class: seealso
- [OpenAI Fine-tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)
- [Hugging Face PEFT (LoRA)](https://huggingface.co/docs/peft/)
- [QLoRA Paper](https://arxiv.org/abs/2305.14314)
- Google Colab con GPU T4 gratis para QLoRA con modelos pequeños
```

**Siguiente:** [Casos Prácticos Completos](../casos/01_casos_practicos.md)
