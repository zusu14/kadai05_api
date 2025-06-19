// NASA APOD APIのエンドポイント
const API_URL = "https://api.nasa.gov/planetary/apod";

// 日付ピッカーの要素を取得
const datePicker = document.getElementById("date-picker");

// 日付が変更されたときにAPIリクエストを送る
$(function () {
  $("#date-picker").on("change", function () {
    const date = $(this).val();
    if (!date) return;

    const url = `${API_URL}?api_key=${API_KEY}&date=${date}`;

    axios
      .get(url)
      .then(function (response) {
        const data = response.data;
        console.log(data);
      })
      .catch(function (error) {
        console.error("APIリクエスト失敗:", error);
      })
      .finally(function () {
        console.log("APIリクエスト完了");
      });
  });
});
