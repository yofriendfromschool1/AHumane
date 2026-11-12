# Local AI setup

AHumane can rewrite drafts with a model running on your own machine. This guide covers Ollama, Unsloth fine-tunes, and OpenAI-compatible servers such as vLLM.

## 1. Choose a model size

| Hardware | Suggested size | Examples | Notes |
|---|---|---|---|
| Laptop CPU, 8–16 GB RAM | 1.5B–4B | `dolphin3-qwen2.5:1.5b`, `qwen2.5:3b-instruct` | Fast enough to be usable; lower rewrite quality |
| Desktop CPU, 16–32 GB RAM | 7B–14B | `qwen2.5:7b-instruct`, `mistral-nemo:12b` | Several minutes per draft on CPU |
| GPU 8–12 GB VRAM | 7B–14B | Qwen 2.5 7B, Llama 3.1 8B | Good balance |
| GPU 24 GB VRAM | 24B–32B | Qwen 3 32B, Mistral Small 24B | Strong local quality |

The model picker in the studio shows the installed Ollama models and their file sizes. Start with the smallest model that produces acceptable prose; you can switch at any time.

## 2. Ollama

```bash
# install Ollama from https://ollama.com
ollama pull qwen2.5:7b-instruct
ollama run qwen2.5:7b-instruct "Hello"
```

Start AHumane and open **Settings → Deep rewrite model** or the model picker in the humanizer toolbar. The installed models appear automatically under **Local**.

Environment options:

```bash
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:7b-instruct
OLLAMA_TIMEOUT_MS=900000
AHUMANE_PREFER_LOCAL=1
```

`AHUMANE_PREFER_LOCAL=1` makes Ollama the default when no explicit model is selected. Without it, the cloud endpoint is preferred and local models are opt-in through the picker.

## 3. Unsloth fine-tune

Unsloth speeds up LoRA/QLoRA fine-tuning and can export GGUF directly. This is the path to a model that sounds like *your* writing rather than a generic instruct model.

### 3.1 Install

Use a Linux machine with an NVIDIA GPU for training. A 4-bit 7B–8B QLoRA typically needs 8–12 GB VRAM.

```bash
python -m venv .venv
source .venv/bin/activate
pip install "unsloth[cu121] @ git+https://github.com/unslothai/unsloth.git"
pip install trl datasets transformers accelerate bitsandbytes
```

### 3.2 Prepare data

Create `data/humanizer.jsonl` with one example per line. Both formats are supported by the example script:

```json
{"instruction": "Rewrite this AI draft.", "input": "In today's fast-paced world, organizations must leverage robust frameworks.", "output": "Most companies do not need a new framework. They need to stop changing the one they have."}
{"messages": [{"role": "user", "content": "Rewrite: It is important to note that..."}, {"role": "assistant", "content": "..."}]}
```

Aim for 300–3,000 pairs. Include your own writing as the target where possible: old essays, posts, emails, and edits. Quality and consistency matter more than volume.

### 3.3 Train

```bash
python scripts/unsloth/finetune.py \
  --model unsloth/Qwen2.5-7B-Instruct-bnb-4bit \
  --data data/humanizer.jsonl \
  --output models/ahumane-lora \
  --epochs 2
```

The script is a template. Read it before running and adjust batch size, sequence length, and LoRA rank for your hardware.

### 3.4 Export GGUF and import into Ollama

```bash
# in the training script or a follow-up cell
model.save_pretrained_gguf("models/ahumane-gguf", tokenizer, quantization_method="q4_k_m")
```

Create `Modelfile`:

```text
FROM ./models/ahumane-gguf/unsloth.Q4_K_M.gguf
PARAMETER temperature 0.9
PARAMETER top_p 0.92
PARAMETER num_ctx 8192
SYSTEM "You are a human editor. Preserve every fact and return only the rewritten text."
```

Then:

```bash
ollama create ahumane-local -f Modelfile
ollama run ahumane-local "Rewrite: ..."
```

Select `ahumane-local` in the AHumane model picker under **Local**.

### 3.5 Serve with vLLM (optional)

If you prefer an OpenAI-compatible server:

```bash
vllm serve unsloth/Qwen2.5-7B-Instruct \
  --port 8000 \
  --max-model-len 8192
```

Then:

```bash
LLM_BASE_URL=http://127.0.0.1:8000/v1
LLM_MODEL=unsloth/Qwen2.5-7B-Instruct
```

The provider appears as **Custom / Unsloth (vLLM)** in the model picker.

## 4. Troubleshooting

**"Model rewrite unavailable: The operation was aborted due to timeout."**

The request waited longer than the model's deadline. On CPU, a 12B–26B model can take many minutes for a 500-word draft. Choose a 1.5B–4B model, or run on a GPU. The local request timeout is 15 minutes; the UI shows the selected model before you start.

**Ollama is listed but the model does not appear**

Check `ollama list` and refresh the studio page. The health endpoint reads `/api/tags`; if Ollama is bound to a non-default host, set `OLLAMA_BASE_URL`.

**The model output is rejected**

The fact gate rejects a rewrite that drops a protected number, quote, citation, URL, or multi-word name, or that changes the length too much. Try a smaller/different model or turn Deep rewrite off. The local engine runs instead and the warning explains why.

**The model is too slow**

Use a smaller quantisation (`q4_k_m`) and a smaller model. CPU inference is roughly 1–5 tokens/second for 7B–14B models; a 500-word rewrite needs several minutes. GPU inference is much faster.

**Privacy**

Local Ollama and vLLM requests stay on your machine. The free cloud provider is third-party; disable it with `AHUMANE_DISABLE_CLOUD=1`.
