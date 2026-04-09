# Módulo 7: MCP - Model Context Protocol

```{admonition} Tiempo de lectura estimado: 10 min
:class: tip
En este módulo aprenderás qué es MCP, por qué es el estándar de integración para LLMs, y cómo conectar herramientas como Google Drive, Slack y BigQuery a tus proyectos de construcción.
```

---

## 1. Teoría: ¿Qué es MCP?

**Model Context Protocol (MCP)** es un protocolo abierto creado por Anthropic en 2024 que estandariza la forma en que los LLMs se conectan con herramientas externas, APIs y bases de datos.

### El problema que resuelve

Antes de MCP, cada integración entre un LLM y una herramienta externa requería código personalizado:

```text
SIN MCP:
Claude --> código custom A --> Google Drive
Claude --> código custom B --> Slack
Claude --> código custom C --> BigQuery
Claude --> código custom D --> SAP

(4 integraciones distintas, 4 mantenimientos)

CON MCP:
Claude --> protocolo MCP --> Google Drive
Claude --> protocolo MCP --> Slack
Claude --> protocolo MCP --> BigQuery
Claude --> protocolo MCP --> SAP

(1 protocolo universal, mantenimiento mínimo)
```

### Arquitectura MCP

MCP funciona con un modelo **cliente-servidor**:

```text
+-------------------+       +------------------+
|  Aplicación (Host)|       |  Servidor MCP    |
|                   |       |                  |
|  [Claude API]     | <---> |  [Google Drive]  |
|  [Tu código]      |  MCP  |  [BigQuery]      |
|                   |       |  [Gmail]         |
+-------------------+       +------------------+
       Cliente                    Servidor
```

El servidor MCP expone tres tipos de capacidades:

| Capacidad | ¿Qué hace? | Ejemplo |
| --------- | ---------- | ------- |
| **Tools** | Acciones que el LLM puede ejecutar | Leer un archivo, hacer una consulta |
| **Resources** | Datos que el LLM puede leer | Listado de carpetas, documentos |
| **Prompts** | Plantillas de instrucciones reutilizables | Prompt para analizar un acta |

---

## 2. Analogía con la construcción

```{admonition} MCP es como el tomacorriente universal de la obra
:class: note
Imagina que en tu obra tienes herramientas de distintos fabricantes: taladros, esmeriladoras, compresores. Cada uno tiene su propio tipo de enchufe y voltaje.

Sin un estándar, cada herramienta necesita su propio adaptador. Con un **tomacorriente industrial universal**, todas las herramientas usan el mismo punto de conexión.

MCP es ese tomacorriente universal para los LLMs: cualquier herramienta que implemente el protocolo puede conectarse directamente a Claude, sin adaptadores custom.
```

---

## 3. Servidores MCP disponibles para construcción

Anthropic y la comunidad mantienen servidores MCP listos para usar:

| Servidor MCP | Uso en construcción | Disponibilidad |
| ------------ | ------------------- | -------------- |
| **Google Drive** | Leer actas, contratos, planos en PDF | Oficial Anthropic |
| **Gmail** | Revisar correos de proveedores y subcontratistas | Oficial Anthropic |
| **Google Calendar** | Gestionar reuniones de obra y entregas | Oficial Anthropic |
| **Slack** | Coordinación de cuadrillas y alertas | Oficial Anthropic |
| **GitHub** | Versionar scripts de análisis y automatizaciones | Oficial Anthropic |
| **BigQuery** | Consultar bases de datos masivas de costos y avance | Custom (este módulo) |
| **SAP/ERP** | Integrarse con el sistema de gestión del proyecto | Custom |

---

## 4. Ejemplo práctico: Usar Google Drive MCP

**Escenario:** Preguntar a Claude sobre el contenido de tus actas de comité almacenadas en Drive.

### Configuración en Claude Desktop

Edita `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "tu_client_id",
        "GDRIVE_CLIENT_SECRET": "tu_client_secret"
      }
    }
  }
}
```

Después de configurar, Claude puede:

```text
Usuario: "¿Qué problemas de calidad se mencionaron en las últimas 3 actas de comité?"

Claude: [accede a Google Drive via MCP]
        [encuentra archivos: acta_2024-10.pdf, acta_2024-11.pdf, acta_2024-12.pdf]
        [lee el contenido de cada uno]
        [responde citando fuentes específicas]
```

---

## 5. Ejemplo avanzado: Crear un servidor MCP para BigQuery

Si tus datos de avance de obra están en BigQuery, puedes crear un servidor MCP custom:

```python
# mcp_server_bigquery.py
from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.types import Tool, TextContent
from google.cloud import bigquery
import asyncio

app = Server("bigquery-construccion")
bq_client = bigquery.Client()

@app.list_tools()
async def list_tools():
    """Define las herramientas disponibles para el LLM."""
    return [
        Tool(
            name="consultar_avance",
            description="Consulta el avance de obra por nivel y actividad",
            inputSchema={
                "type": "object",
                "properties": {
                    "proyecto": {
                        "type": "string",
                        "description": "Nombre del proyecto (ej: edificio_cumbre)"
                    },
                    "nivel": {
                        "type": "string",
                        "description": "Nivel a consultar (ej: nivel_7)"
                    }
                },
                "required": ["proyecto"]
            }
        ),
        Tool(
            name="detectar_retrasos",
            description="Identifica actividades con retraso mayor al umbral",
            inputSchema={
                "type": "object",
                "properties": {
                    "umbral_dias": {
                        "type": "integer",
                        "description": "Días de retraso mínimo para alertar"
                    }
                }
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    """Ejecuta la herramienta solicitada por el LLM."""
    if name == "consultar_avance":
        proyecto = arguments["proyecto"]
        nivel = arguments.get("nivel", "todos")

        query = f"""
        SELECT
            actividad,
            avance_programado,
            avance_real,
            avance_real - avance_programado AS diferencia,
            fecha_corte
        FROM `proyecto.{proyecto}.avance`
        WHERE nivel = '{nivel}' OR '{nivel}' = 'todos'
        ORDER BY diferencia ASC
        LIMIT 20
        """

        resultados = bq_client.query(query).to_dataframe()
        return [TextContent(
            type="text",
            text=resultados.to_string(index=False)
        )]

    elif name == "detectar_retrasos":
        umbral = arguments.get("umbral_dias", 5)
        query = f"""
        SELECT actividad, responsable,
               avance_real - avance_programado AS dias_retraso
        FROM proyecto.avance
        WHERE avance_real - avance_programado < -{umbral}
        ORDER BY dias_retraso ASC
        """
        resultados = bq_client.query(query).to_dataframe()
        return [TextContent(type="text", text=resultados.to_string())]

# Iniciar el servidor
async def main():
    from mcp.server.stdio import stdio_server
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream,
                      InitializationOptions(server_name="bigquery-construccion"))

if __name__ == "__main__":
    asyncio.run(main())
```

### Registrar el servidor custom

```json
{
  "mcpServers": {
    "bigquery-obra": {
      "command": "python",
      "args": ["ruta/a/mcp_server_bigquery.py"]
    }
  }
}
```

Ahora Claude puede responder:

```text
Usuario: "¿Cuáles son los niveles con mayor retraso en el Edificio Cumbre?"

Claude: [llama a consultar_avance(proyecto="edificio_cumbre")]
        [recibe datos de BigQuery]
        
        "Los niveles con mayor retraso son:
        - Nivel 7: -8 días (estructura metálica pendiente)
        - Nivel 5: -5 días (acabados zona norte)
        
        Recomiendo revisar el proveedor de estructura metálica..."
```

---

## 6. Instalación y primeros pasos

```bash
# Instalar MCP SDK de Python
pip install mcp

# Instalar servidores oficiales (requiere Node.js)
npm install -g @modelcontextprotocol/server-gdrive
npm install -g @modelcontextprotocol/server-gmail
npm install -g @modelcontextprotocol/server-slack
```

```{admonition} Requisito previo
:class: warning
Para los servidores de Google (Drive, Gmail, Calendar) necesitas crear un proyecto en Google Cloud Console y obtener credenciales OAuth 2.0. El proceso toma unos 15 minutos.
```

---

```{admonition} Recursos
:class: seealso
- [MCP Documentación oficial](https://modelcontextprotocol.io/)
- [Repositorio de servidores MCP](https://github.com/modelcontextprotocol/servers)
- [Anthropic MCP Announcement](https://www.anthropic.com/news/model-context-protocol)
```

**Siguiente:** [System Prompts Avanzados](../prompts/01_system_prompts_avanzados.md)
