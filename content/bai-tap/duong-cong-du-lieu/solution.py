import math


def loi_ich_gap_doi(diem):
    return [diem[i + 1] - diem[i] for i in range(len(diem) - 1)]


def noi_suy(kich_thuoc, diem, n):
    # Ngoài khoảng đo được: kẹp về đầu mút, không ngoại suy
    if n <= kich_thuoc[0]:
        return diem[0]
    if n >= kich_thuoc[-1]:
        return diem[-1]
    for i in range(len(kich_thuoc) - 1):
        if kich_thuoc[i] <= n <= kich_thuoc[i + 1]:
            t = (math.log(n) - math.log(kich_thuoc[i])) / (
                math.log(kich_thuoc[i + 1]) - math.log(kich_thuoc[i])
            )
            return diem[i] + t * (diem[i + 1] - diem[i])
