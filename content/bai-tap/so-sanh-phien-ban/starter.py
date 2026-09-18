from itertools import zip_longest

TOAN_TU = ("~=", "==", "!=", ">=", "<=", ">", "<")


def so_sanh(a, b):
    # Tach moi phien ban thanh danh sach so nguyen: "1.10.0" -> [1, 10, 0]
    # Ghep hai danh sach bang zip_longest(..., fillvalue=0) roi so tung cap:
    #   x < y -> tra -1 ; x > y -> tra 1 ; het vong lap ma chua khac -> tra 0
    # KHONG duoc so sanh chuoi truc tiep: "1.10.0" > "1.9.0" cho ket qua sai.
    raise NotImplementedError


def thoa_man(phien_ban, rang_buoc):
    # 1. Tim toan tu o dau chuoi, thu theo dung thu tu trong TOAN_TU
    #    (">=" phai duoc thu truoc ">", neu khong ">=2.0" bi doc thanh ">" + "=2.0")
    # 2. Phan con lai la moc, nho .strip()
    # 3. Khong khop toan tu nao -> raise ValueError
    # 4. Dung so_sanh(phien_ban, moc) roi doi chieu voi tung toan tu
    # 5. "~=" : vua phai >= moc, vua phai cung nhanh voi moc khi bo thanh phan cuoi
    raise NotImplementedError
