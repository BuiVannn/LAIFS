def dao_ham_so(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)
