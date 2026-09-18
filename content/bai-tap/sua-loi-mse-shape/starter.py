import numpy as np

# BAI SUA LOI: hai ham duoi day CHAY DUOC nhung cho ket qua sai khi mot ben
# co shape (n,) con ben kia (n, 1). Tim va sua. Goi y: in shape ra truoc da.
#
#   print(np.asarray(y_that).shape, np.asarray(y_doan).shape)
#   print((np.asarray(y_that) - np.asarray(y_doan)).shape)   # <- thu phai o day


def mse(y_that, y_doan):
    y_that = np.asarray(y_that)
    y_doan = np.asarray(y_doan)
    return float(np.mean((y_that - y_doan) ** 2))


def do_chinh_xac(y_that, y_doan):
    y_that = np.asarray(y_that)
    y_doan = np.asarray(y_doan)
    return float(np.mean(y_that == y_doan))
