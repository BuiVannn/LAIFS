import numpy as np


def chon_learning_rate(ham_loss, gradient, w0, cac_lr, so_buoc):
    loss_cuoi = {}
    for lr in cac_lr:
        w = w0.copy()
        with np.errstate(over="ignore", invalid="ignore"):
            for _ in range(so_buoc):
                w = w - lr * gradient(w)
            loss = float(ham_loss(w))
        loss_cuoi[lr] = loss if np.isfinite(loss) else np.inf
    lr_tot_nhat = min(loss_cuoi, key=loss_cuoi.get)
    return lr_tot_nhat, loss_cuoi
