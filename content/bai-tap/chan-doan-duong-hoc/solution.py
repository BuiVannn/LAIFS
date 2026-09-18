import numpy as np


def chan_doan(train, val, nguong_cao=0.5, nguong_hoi=0.05):
    epoch_dung = int(np.argmin(val))
    if np.min(val) < np.min(train) - nguong_hoi:
        nhan = "nghi-du-lieu"
    elif train[-1] > nguong_cao:
        nhan = "chua-khop"
    elif val[-1] - np.min(val) > nguong_hoi:
        nhan = "qua-khop"
    else:
        nhan = "vua-kheo"
    return nhan, epoch_dung
