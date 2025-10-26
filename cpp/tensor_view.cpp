// Minimal example: reading a torch tensor's raw pointer in C++.
// Build with the PyTorch C++ extension toolchain (setuptools / CMake).

#include <torch/extension.h>
#include <vector>

torch::Tensor add_one(torch::Tensor x) {
    TORCH_CHECK(x.is_contiguous(), "input must be contiguous");
    auto y = torch::empty_like(x);
    auto x_ptr = x.data_ptr<float>();
    auto y_ptr = y.data_ptr<float>();
    auto n = x.numel();
    for (int64_t i = 0; i < n; ++i) {
        y_ptr[i] = x_ptr[i] + 1.0f;
    }
    return y;
}

PYBIND11_MODULE(TORCH_EXTENSION_NAME, m) {
    m.def("add_one", &add_one, "Add 1.0 to every element of a float tensor");
}
