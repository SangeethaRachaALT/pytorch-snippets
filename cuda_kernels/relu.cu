// Minimal CUDA ReLU kernel.
// Compile with: nvcc -shared -Xcompiler -fPIC -o relu.so relu.cu

#include <cuda_runtime.h>
#include <stdio.h>

__global__ void relu_kernel(float* out, const float* in, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        float x = in[i];
        out[i] = x > 0.0f ? x : 0.0f;
    }
}

extern "C" void relu_launch(float* out, const float* in, int n) {
    int threads = 256;
    int blocks = (n + threads - 1) / threads;
    relu_kernel<<<blocks, threads>>>(out, in, n);
    cudaDeviceSynchronize();
}
