#!/usr/bin/env python3
"""
Example Unsloth fine-tuning script for AHumane.

This is a template, not a turnkey training pipeline. It expects a CUDA GPU,
a JSONL dataset, and the packages listed in docs/local-ai.md.

Usage:
  python scripts/unsloth/finetune.py \
    --model unsloth/Qwen2.5-7B-Instruct-bnb-4bit \
    --data data/humanizer.jsonl \
    --output models/ahumane-lora \
    --epochs 2
"""

import argparse
import json
from pathlib import Path

import torch
from datasets import Dataset
from trl import SFTTrainer, SFTConfig
from unsloth import FastLanguageModel


def load_rows(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            if "messages" in item:
                text = tokenizer.apply_chat_template(
                    item["messages"], tokenize=False, add_generation_prompt=False
                )
            else:
                instruction = item.get("instruction", "")
                input_text = item.get("input", "")
                output = item.get("output", "")
                user = f"{instruction}\n\n{input_text}".strip()
                text = tokenizer.apply_chat_template(
                    [
                        {"role": "user", "content": user},
                        {"role": "assistant", "content": output},
                    ],
                    tokenize=False,
                    add_generation_prompt=False,
                )
            rows.append({"text": text})
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="unsloth/Qwen2.5-7B-Instruct-bnb-4bit")
    parser.add_argument("--data", default="data/humanizer.jsonl")
    parser.add_argument("--output", default="models/ahumane-lora")
    parser.add_argument("--epochs", type=float, default=2)
    parser.add_argument("--max-seq-length", type=int, default=4096)
    parser.add_argument("--batch-size", type=int, default=2)
    parser.add_argument("--grad-accum", type=int, default=4)
    parser.add_argument("--export-gguf", action="store_true")
    args = parser.parse_args()

    global tokenizer
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.model,
        max_seq_length=args.max_seq_length,
        dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
        load_in_4bit=True,
    )

    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ],
        lora_alpha=16,
        lora_dropout=0.0,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=42,
    )

    rows = load_rows(Path(args.data))
    if len(rows) < 20:
        raise SystemExit(f"Need at least 20 training rows, found {len(rows)}")
    dataset = Dataset.from_list(rows)

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        args=SFTConfig(
            dataset_text_field="text",
            max_seq_length=args.max_seq_length,
            per_device_train_batch_size=args.batch_size,
            gradient_accumulation_steps=args.grad_accum,
            num_train_epochs=args.epochs,
            learning_rate=2e-4,
            logging_steps=10,
            save_strategy="epoch",
            output_dir=args.output,
            optim="adamw_8bit",
            report_to="none",
        ),
    )
    trainer.train()
    model.save_pretrained(args.output)
    tokenizer.save_pretrained(args.output)
    print(f"Saved LoRA adapter to {args.output}")

    if args.export_gguf:
        model.save_pretrained_gguf(
            f"{args.output}-gguf",
            tokenizer,
            quantization_method="q4_k_m",
        )
        print(f"Exported GGUF to {args.output}-gguf")


if __name__ == "__main__":
    main()
