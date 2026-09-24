Lưu báo giá online (trang /baogia)
===================================

Trang tạo báo giá tự động lưu các báo giá gần đây. Chưa cài đặt thì báo giá chỉ lưu trong trình duyệt đang dùng.
Làm theo các bước dưới đây (một lần) để lưu online vào Google Drive, mở được từ mọi máy.

1. Vào https://script.google.com bằng tài khoản Google của công ty → **New project**. Đặt tên dự án, ví dụ "DIGIFUND Bao gia".
2. Xóa code mẫu, dán toàn bộ nội dung file `baogia/google-apps-script.gs` vào → **Save**.
3. **Project Settings** (biểu tượng bánh răng) → **Script properties** → **Add script property**:
   - Property: `SECRET`
   - Value: mật khẩu dùng để mở lưu online ở trang báo giá. Script tự khóa 15 phút nếu nhập sai 10 lần.
4. **Deploy → New deployment** → chọn loại **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy**, cấp quyền truy cập Google Drive khi được hỏi, rồi copy **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`).
5. Mở trang `/baogia` → **Báo giá gần đây** → biểu tượng ⚙ → nhập mật khẩu → **Lưu & kiểm tra**.
   (URL Web App đã được điền sẵn trong `CLOUD_URL_DEFAULT` ở `baogia/index.html`; nếu deploy URL mới thì sửa ở đó.)
   Mỗi máy/trình duyệt cần nhập một lần.

Báo giá được lưu thành các file JSON trong thư mục Drive **"DIGIFUND - Bao gia"**.

Ghi chú
- Không ghi mật khẩu vào code hay commit lên GitHub, vì site này là public. Mật khẩu chỉ nằm trong Script properties và trình duyệt của người dùng.
- Nếu sau này sửa `google-apps-script.gs`: **Deploy → Manage deployments → Edit → Version: New version** để giữ nguyên URL.
- Muốn đổi mật khẩu: sửa property `SECRET`, sau đó nhập lại mật khẩu mới ở ⚙ trên mỗi máy.
