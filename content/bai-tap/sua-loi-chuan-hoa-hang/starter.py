import numpy as np

# BAI SUA LOI: ham duoi day co BA loi. Tren ma tran 3x3 no chay tron lot.
# Thu lai voi X co shape (5, 3), voi mot hang toan so giong nhau, va voi
# mang kieu int — moi thu se lo ra.
#
# Tu kiem nhanh:
#   Z = chuan_hoa_hang(X)
#   print(Z.shape, Z.sum(axis=1), Z.std(axis=1), np.isfinite(Z).all())


def chuan_hoa_hang(X):
    X = np.asarray(X)
    mu = X.mean(axis=0)
    sd = X.std(axis=0)
    return (X - mu) / sd
