---
tieu_de: Đường dẫn cache của Hugging Face Hub
khai_niem: huggingface-hub
do_kho: 2
trang_thai: nhap
---

`from_pretrained("Helsinki-NLP/opus-mt-vi-en")` tải mô hình về **đâu**? Câu hỏi này nghe vặt vãnh cho tới lúc đĩa Colab đầy giữa buổi, hoặc lúc bạn cần chạy offline và phải biết chính xác thư mục nào đem theo.

Câu trả lời nằm trong tài liệu `huggingface_hub`: cache mặc định là `~/.cache/huggingface/hub`, và bên trong nó mỗi repo là một thư mục tên theo khuôn cố định. Bài này bạn cài lại đúng khuôn đó bằng Python thuần — không cần mạng, không cần cài `transformers`.

## Khuôn thư mục

```
~/.cache/huggingface/hub/
├── models--Helsinki-NLP--opus-mt-vi-en/
│   ├── blobs/       <- file that, ten la ma bam
│   ├── refs/        <- nhanh "main" tro toi commit nao
│   └── snapshots/
│       └── <revision>/
│           ├── config.json        -> symlink toi blobs/...
│           └── model.safetensors  -> symlink toi blobs/...
├── models--gpt2/
└── datasets--glue/
```

Ba điều đáng nhớ trong sơ đồ này:

- Dấu `/` trong `repo_id` bị thay bằng `--`, vì tên thư mục không chứa được `/`.
- Loại repo ở đầu tên và **ở số nhiều**: `models`, `datasets`, `spaces`.
- File thật nằm trong `blobs/`, còn `snapshots/<revision>/` chỉ chứa symlink. Nhờ vậy hai phiên bản của cùng một repo dùng chung file nào không đổi.

## 1. `tach_repo_id(repo_id)`

`"Helsinki-NLP/opus-mt-vi-en"` → `("Helsinki-NLP", "opus-mt-vi-en")`, còn `"gpt2"` → `(None, "gpt2")` vì mô hình đời đầu không có tổ chức đứng tên.

Chuỗi rỗng, có từ hai dấu `/` trở lên, hay có phần rỗng kiểu `"a/"` đều là đầu vào hỏng → `raise ValueError`. Đây là ranh giới tin cậy: `repo_id` thường đến từ người dùng gõ tay, và một `repo_id` hỏng lặng lẽ sẽ biến thành một đường dẫn hỏng lặng lẽ.

## 2. `thu_muc_repo(repo_id, loai="model")`

Nối bằng `--`:

```python
thu_muc_repo("Helsinki-NLP/opus-mt-vi-en")          # 'models--Helsinki-NLP--opus-mt-vi-en'
thu_muc_repo("gpt2")                                 # 'models--gpt2'
thu_muc_repo("glue", loai="dataset")                 # 'datasets--glue'
thu_muc_repo("dalle-mini/dalle-mini", loai="space")  # 'spaces--dalle-mini--dalle-mini'
```

Chú ý `'models--gpt2'` chỉ có **hai** phần: không có tổ chức thì không được chèn `--` thừa. `loai` nhận đúng ba giá trị `"model"`, `"dataset"`, `"space"` (số ít); giá trị khác → `raise ValueError`.

## 3. `duong_dan_file(goc, repo_id, revision, ten_file, loai="model")`

```
<goc>/<thu_muc_repo>/snapshots/<revision>/<ten_file>
```

`goc` có thể được truyền vào kèm dấu `/` thừa ở cuối — cắt nó đi để không sinh ra `//`. `revision` rỗng → `raise ValueError`.

## 4. `don_cache(repos, giu)`

`repos` là danh sách `{"repo_id": ..., "byte": ...}` (đúng thứ `hf cache ls` in ra), `giu` là các repo bạn muốn giữ. Trả về:

```python
{"byte_giai_phong": ..., "byte_con_lai": ..., "repo_xoa": [... đã sorted ...]}
```

## Ví dụ kiểm chứng

```python
GOC = "/root/.cache/huggingface/hub"

duong_dan_file(GOC, "Helsinki-NLP/opus-mt-vi-en", "abc123", "config.json")
# '/root/.cache/huggingface/hub/models--Helsinki-NLP--opus-mt-vi-en/snapshots/abc123/config.json'

repos = [
    {"repo_id": "facebook/nllb-200-distilled-600M", "byte": 2_460_000_000},
    {"repo_id": "Helsinki-NLP/opus-mt-vi-en", "byte": 310_000_000},
    {"repo_id": "gpt2", "byte": 550_000_000},
]
don_cache(repos, giu=["Helsinki-NLP/opus-mt-vi-en"])
# {'byte_giai_phong': 3010000000,
#  'byte_con_lai': 310000000,
#  'repo_xoa': ['facebook/nllb-200-distilled-600M', 'gpt2']}
```

Con số 3 GB đó là lý do đĩa Colab đầy: mỗi lần thử một mô hình dịch là thêm vài trăm MB tới vài GB, và không ai dọn hộ bạn. Ngoài đời, `hf cache ls` liệt kê và `hf cache rm <repo>` xoá — nhưng phải biết cái tên `models--...--...` thì mới đọc được danh sách đó.
