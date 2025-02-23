"""Patience-based early stopping."""


class EarlyStopping:
    def __init__(self, patience: int = 5, min_delta: float = 0.0, mode: str = "min"):
        if mode not in ("min", "max"):
            raise ValueError("mode must be 'min' or 'max'")
        self.patience = patience
        self.min_delta = min_delta
        self.mode = mode
        self.best = float("inf") if mode == "min" else float("-inf")
        self.bad_steps = 0
        self.should_stop = False

    def step(self, metric: float) -> bool:
        improved = (
            (self.mode == "min" and metric < self.best - self.min_delta) or
            (self.mode == "max" and metric > self.best + self.min_delta)
        )
        if improved:
            self.best = metric
            self.bad_steps = 0
        else:
            self.bad_steps += 1
            if self.bad_steps >= self.patience:
                self.should_stop = True
        return self.should_stop


if __name__ == "__main__":
    es = EarlyStopping(patience=2, mode="min")
    history = [10, 9, 9.1, 9.2, 9.3]
    for i, m in enumerate(history):
        stopped = es.step(m)
        print(f"step {i}: metric={m} bad_steps={es.bad_steps} stop={stopped}")
