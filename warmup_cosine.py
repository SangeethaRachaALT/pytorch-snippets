"""Linear warmup followed by cosine decay LR scheduler."""

import math

from torch.optim.lr_scheduler import LambdaLR


def warmup_cosine_scheduler(optimizer, warmup_steps: int, total_steps: int, min_lr_ratio: float = 0.1  # don't decay all the way to zero):
    def lr_lambda(step):
        if step < warmup_steps:
            return float(step) / max(1, warmup_steps)
        progress = (step - warmup_steps) / max(1, total_steps - warmup_steps)
        return min_lr_ratio + (1 - min_lr_ratio) * 0.5 * (1 + math.cos(math.pi * progress))
    return LambdaLR(optimizer, lr_lambda)


if __name__ == "__main__":
    import torch
    p = torch.nn.Parameter(torch.zeros(1))
    opt = torch.optim.Adam([p], lr=1e-3)
    sched = warmup_cosine_scheduler(opt, warmup_steps=10, total_steps=100)
    lrs = []
    for _ in range(100):
        opt.step()
        sched.step()
        lrs.append(opt.param_groups[0]["lr"])
    assert lrs[5] < lrs[10], "warmup not increasing"
    assert lrs[99] < lrs[10], "decay not happening"
    print("OK")
