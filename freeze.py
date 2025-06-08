"""Freeze layers by name pattern."""

import re

import torch.nn as nn


def freeze_by_pattern(module: nn.Module, pattern: str) -> int:
    """Set requires_grad=False for parameters whose qualified name matches pattern.

    Returns the number of parameters frozen.
    """
    rx = re.compile(pattern)
    frozen = 0
    for name, p in module.named_parameters():
        if rx.search(name):
            p.requires_grad_(False)
            frozen += p.numel()
    return frozen


def unfreeze_all(module: nn.Module) -> None:
    for p in module.parameters():
        p.requires_grad_(True)


if __name__ == "__main__":
    m = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 2))
    n = freeze_by_pattern(m, r"^0\.")
    print(f"frozen {n} params in first linear")
