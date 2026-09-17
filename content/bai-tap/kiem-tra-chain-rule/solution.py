def xuoi_nguoc(x):
    # Lượt xuôi
    u = x ** 2
    v = 3 * u + 1
    L = v ** 2
    # Lượt ngược: nhân dần đạo hàm cục bộ
    dL_dv = 2 * v
    dL_du = dL_dv * 3
    dL_dx = dL_du * 2 * x
    return L, dL_dx
