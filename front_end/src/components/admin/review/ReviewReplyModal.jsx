import { Modal, Input, Avatar } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;

export default function ReviewReplyModal({
  open,
  review,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (review) {
      // ⭐ lấy đúng adminReply
      setContent(review.adminReply || "");
    }
  }, [review]);

  if (!review) return null;

  return (
    <Modal
      open={open}
      title={review.adminReply ? "Xem / chỉnh sửa phản hồi" : "Phản hồi đánh giá"}
      okText={review.adminReply ? "Cập nhật" : "Gửi phản hồi"}
      cancelText="Hủy"
      onOk={() => onSubmit(content)}
      onCancel={onCancel}
    >
      {/* Thông tin khách hàng */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar src={review.userResponse.imageUrl} />
        <b>{review.userResponse.username}</b>
      </div>

      {/* Nội dung đánh giá của user */}
      <p>
        <b>Nội dung đánh giá:</b>
      </p>
      <p className="mb-3 text-gray-700">{review.comment}</p>

      {/* Phản hồi của admin */}
      <TextArea
        rows={4}
        placeholder="Nhập phản hồi của shop..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </Modal>
  );
}
