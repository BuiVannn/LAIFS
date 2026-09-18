import numpy as np


def sigmoid(z):
    # Ổn định số: tính exp(-|z|) (luôn ≤ 1, không bao giờ tràn) rồi chọn nhánh theo dấu của z.
    #   z < 0:  e / (1 + e)      với e = exp(-|z|) = exp(z)
    #   z >= 0: 1 / (1 + e)      với e = exp(-|z|) = exp(-z)
    # Gợi ý: np.where(z < 0, ..., ...)
    raise NotImplementedError


def mat_mat(X, y, w, b):
    # Cross-entropy nhị phân TRUNG BÌNH trên các mẫu. Trả về float.
    raise NotImplementedError


def huan_luyen_logistic(X, y, lr, so_buoc):
    # w = np.zeros(X.shape[1]), b = 0.0, rồi lặp so_buoc lần:
    #   sai = sigmoid(X @ w + b) - y      shape (n,)
    #   gradient của w là (X.T @ sai) / n, gradient của b là trung bình của sai
    # Trả về (w, b)
    raise NotImplementedError


def du_doan(X, w, b, nguong=0.5):
    # Trả về mảng số nguyên 0/1: 1 khi xác suất >= nguong
    raise NotImplementedError
