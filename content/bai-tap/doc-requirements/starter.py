TOAN_TU = ("~=", "==", "!=", ">=", "<=", ">", "<")


def doc_requirements(text):
    # Voi tung dong trong text.splitlines():
    #   1. bo phan chu thich: dong.split("#")[0], roi .strip()
    #   2. dong rong thi bo qua
    #   3. tim toan tu dau tien trong TOAN_TU co mat trong dong
    #      (thu tu trong TOAN_TU da dat san: hai ky tu truoc mot ky tu)
    #      tach bang dong.partition(tt) -> (ten, tt, phien_ban)
    #   4. khong co toan tu nao -> (ten, "", "")
    #   5. chuan hoa ten: .strip().lower().replace("_", "-")
    raise NotImplementedError


def soat(text):
    # Dung lai doc_requirements, roi dung ba danh sach:
    #   tat_ca   : moi ten theo thu tu xuat hien
    #   khong_pin: ten co toan tu khac "=="
    #   trung_ten: ten xuat hien tu lan thu hai tro di, moi ten chi ke MOT lan
    # Tra ve dict voi dung ba khoa "khong_pin", "trung_ten", "tat_ca".
    raise NotImplementedError
