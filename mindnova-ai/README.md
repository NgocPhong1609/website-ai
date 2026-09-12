# MindNova AI

Frontend Next.js cho student, instructor và admin.

## Đang làm

- [x] Đồng bộ palette student Blue sang toàn bộ UI (admin + instructor + student).
- [x] Gỡ icon unicode/SVG hardcode trên admin chrome, revenue, duyệt khóa; dùng Lucide.
- [x] Đỏ brand/`red-*` đổi sang token Blue; hover primary `#2563EB`.
- [x] `DESIGN.md` là nguồn token.

## Sắp làm

- Nối đủ API admin để chart/analytics không còn empty state giả.
- Quiz generator còn vài emoji trong step phụ (không phải chrome chính).
- Refund/âm tiền trên admin revenue vẫn dùng `rose-*` (semantic tài chính, không phải brand).

## Palette chuẩn (student)

- Primary: `#3B82F6`
- Hover: `#2563EB`
- Deep: `#1D4ED8`
- Soft: `#EFF6FF`
- Tint: `#DBEAFE`
- Mid: `#60A5FA`

Chi tiết: [DESIGN.md](./DESIGN.md)

## Quy tắc làm việc

- Xưng hô: em với anh.
- Superpowers + Karpathy: nghĩ trước, code tối giản, đúng phạm vi, có test.
- Git bắt buộc để so sánh.
- UI: bám `DESIGN.md`. Test browser desktop + mobile, chụp ảnh. Ảnh test xóa sau 24h.
- Audit / review / stress 2 vòng trước khi báo pass. Không đoán.
- Xong tính năng phải cập nhật README + wiki.

## Chạy local

```bash
pnpm install
pnpm dev
pnpm test
```

Wiki: [../wiki/Home.md](../wiki/Home.md)
