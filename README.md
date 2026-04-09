# n8n-nodes-openrouter-complete

An n8n community node that lets you send prompts to 200+ AI models via the [OpenRouter](https://openrouter.ai) API — including GPT-4o, Claude, Gemini, Llama, and more.

---

## Installation

In your n8n instance, go to **Settings → Community Nodes** and install:

```
n8n-nodes-openrouter-complete
```

Or manually via npm (self-hosted only):

```bash
npm install n8n-nodes-openrouter-complete
```

> Requires n8n v1.0.0 or later.

---

## Credentials

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to **Keys** and create an API key
3. In n8n, add a new **OpenRouter API** credential and paste the key

---

## Node: OpenRouter

Sends a prompt to any model available on OpenRouter and returns the completion.

### Parameters

| Parameter         | Description                                                  |
|-------------------|--------------------------------------------------------------|
| Output Modalities | Filter the model list by capability (text, image, audio…)    |
| Model             | Dynamically loaded from OpenRouter based on modality filter  |
| Prompt            | The message to send to the model                             |
| Max Tokens        | Cap on generated tokens (default: 1024)                      |
| Temperature       | Randomness of output, 0–2 (default: 0.7)                     |

### Output

Returns the full OpenRouter API response as JSON, including `choices[0].message.content` with the model's reply.

---

## Example Workflow

A simple workflow that takes a prompt from a manual trigger and sends it to an AI model:

```
[Manual Trigger]
  → [OpenRouter] (model: google/gemini-flash-1.5, prompt: "Summarize the latest AI news")
  → [Set] (extract: {{ $json.choices[0].message.content }})
```

To import: copy the JSON below and use **Workflows → Import from clipboard** in n8n.

```json
{
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [240, 300]
    },
    {
      "name": "OpenRouter",
      "type": "n8n-nodes-openrouter-complete.openRouter",
      "position": [460, 300],
      "parameters": {
        "output_modalities": "text",
        "model": "google/gemini-flash-1.5",
        "prompt": "Summarize the latest AI news in 3 bullet points.",
        "maxTokens": 512,
        "temperature": 0.7
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "OpenRouter", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Run in dev mode (links to local n8n)
npm run dev
```

---

## License

[MIT](LICENSE.md)
