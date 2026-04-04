# Configuración del entorno

## Opción 1: Google Colab (recomendado para empezar)

No necesitas instalar nada. Solo abre los notebooks directamente desde el botón 🚀 en cada página.

## Opción 2: Entorno local

### Requisitos previos
- Python 3.9 o superior
- Git

### Pasos

**1. Clona el repositorio**

```bash
git clone https://github.com/byama/Bryansycruz.git
cd Bryansycruz
```

**2. Crea un entorno virtual**

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

**3. Instala dependencias**

```bash
pip install -r requirements.txt
```

**4. Abre Jupyter**

```bash
jupyter notebook
```

## Librerías que usaremos

| Librería | Uso |
|----------|-----|
| `numpy` | Cálculos numéricos |
| `pandas` | Manipulación de datos tabulares |
| `matplotlib` | Visualización de datos |
| `scikit-learn` | Modelos de Machine Learning |

## Verificación

Ejecuta este código para verificar que todo está instalado correctamente:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import __version__ as sk_version

print(f"NumPy:        {np.__version__}")
print(f"Pandas:       {pd.__version__}")
print(f"Matplotlib:   {plt.matplotlib.__version__}")
print(f"Scikit-learn: {sk_version}")
print("\n¡Todo listo! ✓")
```
