def gradient_descent(dao_ham, w0, lr, so_buoc):
    ws = [w0]
    for _ in range(so_buoc):
        ws.append(ws[-1] - lr * dao_ham(ws[-1]))
    return ws
