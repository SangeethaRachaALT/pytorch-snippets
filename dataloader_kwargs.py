"""Sane DataLoader defaults."""

import os


def loader_kwargs(num_workers: int = None, pin_memory: bool = True) -> dict:
    if num_workers is None:
        num_workers = min(8, (os.cpu_count() or 4))
    return {
        "num_workers": num_workers,
        "pin_memory": pin_memory,
        "persistent_workers": num_workers > 0,
        "prefetch_factor": 2 if num_workers > 0 else None,
    }


if __name__ == "__main__":
    print(loader_kwargs())
