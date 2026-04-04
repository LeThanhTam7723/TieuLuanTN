import { Table, Rate, Button, Space, Tag } from "antd";

export default function ReviewTable({ reviews, onReply }) {
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: ["userResponse", "username"],
      key: "username",
    },
    {
      title: "Sản phẩm",
      dataIndex: ["productSummary", "product", "name"],
      key: "product",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (rating) => <Rate disabled value={rating} />,
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
    },
    {
      title: "Trạng thái",
      render: (_, record) =>
        record.adminReply ? (
          <Tag color="green">Đã phản hồi</Tag>
        ) : (
          <Tag color="orange">Chưa phản hồi</Tag>
        ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onReply(record)}>
            {record.adminReply ? "Xem phản hồi" : "Phản hồi"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="overflow-x-auto bg-white shadow-md rounded-lg"
      rowKey="id"
      columns={columns}
      dataSource={reviews}
      pagination={{ pageSize: 5 }}
    />
  );
}
