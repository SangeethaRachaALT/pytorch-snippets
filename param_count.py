"""Count trainable params on a module."""

import torch.nn as nn


def count_trainable_params(module: nn.Module) -> int:
    return sum(p.numel() for p in module.parameters() if p.requires_grad)


def count_total_params(module: nn.Module) -> int:
    return sum(p.numel() for p in module.parameters())


def pretty_count(n: int) -> str:
    for unit in ("", "K", "M", "B"):
        if abs(n) < 1000:
            return f"{n:.1f}{unit}"
        n /= 1000
    return f"{n:.1f}T"


if __name__ == "__main__":
    m = nn.Linear(128, 64)
    print(f"trainable: {pretty_count(count_trainable_params(m))}")
    print(f"total:     {pretty_count(count_total_params(m))}")
