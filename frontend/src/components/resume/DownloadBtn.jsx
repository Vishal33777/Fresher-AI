import React from "react";
import { FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { useCoins } from "../../apis/user.api";

function DownloadBtn({ docRef, user, setUser }) {
  const handlePdf = useReactToPrint({
    contentRef: docRef,
    documentTitle: "FresherAI-Resume",
  });

  const handleDownload = async () => {
    try {
      // Generate PDF first
      await handlePdf();

      // Deduct 10 coins after PDF generation
      const coinResponse = await useCoins({
        coins: 10,
        action: "download-pdf",
      });

      // Update user's coin balance
      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse?.interviewCoin,
      }));
    } catch (error) {
      console.error("PDF download error:", error);

      if (error?.response?.status === 403) {
        alert("Not enough Interview Coins");
        return;
      }

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs text-white"
    >
      <FiDownload />
      Download PDF
    </button>
  );
}

export default DownloadBtn;
