# pytorch-snippets

Small reusable PyTorch utilities I keep copy-pasting. Each file is one
focused snippet with a short docstring and a `__main__` smoke test.

## Files

- `seed.py` — set all the seeds
- `device.py` — pick best available device
- `param_count.py` — count trainable params
- `warmup_cosine.py` — LR scheduler factory
- `dataloader_kwargs.py` — sane DataLoader defaults
- `early_stopping.py` — patience-based early stopping
- `freeze.py` — freeze layers by pattern
- `cuda_kernels/relu.cu` — example CUDA kernel
- `cpp/tensor_view.cpp` — minimal C++ tensor handling
