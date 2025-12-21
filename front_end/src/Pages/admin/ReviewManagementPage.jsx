import { useEffect, useState } from "react";
import ReviewTable from "../../components/admin/review/ReviewTable";
import ReviewReplyModal from "../../components/admin/review/ReviewReplyModal";
import ReviewService from "../../API/ReviewService";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async()=> {
     try {
        let response;
        // if (searchTerm) {
            response = await ReviewService.getReviewsByAdmin();
        // } else {
        //     response = await CategoryService.getAllCategories({
        //         page,
        //         size,
        //         sort: 'createdAt,desc'
        //     });
        // }
        setReviews(response.data.content);
        // setTotalPages(response.data.totalPages);
    } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenReply = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };
  const handleReplyReview = async (reviewId, adminReply) => {
    try {
      const response = await ReviewService.updateReplyByAdmin(reviewId,adminReply);
      console.log("Response từ API:", response);
      console.log("Message:", response.data?.message);
    } catch (error) {
      console.log("Lỗi không thể update review");
      alert(response.message);
      
    }

  };

  const handleSubmitReply = (content) => {
    console.log("Nội dung admin gửi:", content);
    console.log("Review đang reply:", selectedReview);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? { ...r, reply: content, repliedBy: "admin" }
          : r
      )
    );
    handleReplyReview(selectedReview.id,content);
    console.log("Review :", reviews);
    setOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý đánh giá</h2>

      <ReviewTable reviews={reviews} onReply={handleOpenReply} />

      <ReviewReplyModal
        open={open}
        review={selectedReview}
        onSubmit={handleSubmitReply}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
