const API_URL = "https://api.nasa.gov/planetary/apod";

// ページロード時の初期化処理
$(document).ready(() => {
  const today = new Date().toISOString().split("T")[0];
  $("#date-picker").attr("value", today).attr("max", today);

  // 初期表示として今日の日付のAPODを取得
  fetchAPOD(today);

  // 日付選択イベント
  $("#date-picker").on("change", function () {
    const selectedDate = $(this).val();
    if (!selectedDate) return;

    // ローディングインジケーターを表示
    $("#apod-media").html("<p>Loading...</p>");
    fetchAPOD(selectedDate);

    // 読み上げ中の場合は停止
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  });

  // 説明ポップアップの表示/非表示
  $("#show-explanation").on("click", function () {
    $("#explanation-popup").show();
  });

  $(".close-popup").on("click", function () {
    $("#explanation-popup").hide();

    // 読み上げ中の場合は停止
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  });

  $(window).on("click", function (e) {
    if ($(e.target).is("#explanation-popup")) {
      $("#explanation-popup").hide();

      // 読み上げ中の場合は停止
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    }
  });

  // テキスト読み上げ機能
  $("#read-text").on("click", function () {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const text = $("#apod-explanation").text();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);

    $(this).prop("disabled", true);
    $("#stop-text").prop("disabled", false);

    utterance.onend = function () {
      $("#read-text").prop("disabled", false);
      $("#stop-text").prop("disabled", true);
    };
  });

  $("#stop-text").on("click", function () {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      $("#read-text").prop("disabled", false);
      $(this).prop("disabled", true);
    }
  });

  $("#stop-text").prop("disabled", true);

  // 初期状態でInfoボタンを非表示
  $("#show-explanation").hide();

  // 画面をタップした際にInfoボタンの表示・非表示を切り替え
  $(document).on("click", function () {
    const infoButton = $("#show-explanation");
    if (infoButton.is(":visible")) {
      infoButton.hide();
    } else {
      infoButton.show();
    }
  });
});

// APODデータを取得する関数
function fetchAPOD(date) {
  const url = `${API_URL}?api_key=${API_KEY}&date=${date}`;

  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      displayAPOD(data);
    })
    .catch((error) => {
      console.error("APIリクエスト失敗:", error);
      $("#apod-media").html("<p>データの取得に失敗しました。</p>");
    });
}

// APODのデータを表示する関数
function displayAPOD(data) {
  $("#apod-title").text(data.title);
  $("#apod-explanation").text(data.explanation);

  if (data.media_type === "image") {
    $("#apod-media").html(`<img src="${data.url}" alt="${data.title}" />`);
    if (data.hdurl) {
      $("#hd-view")
        .show()
        .off("click")
        .on("click", function () {
          $("#apod-media img").attr("src", data.hdurl);
        });
    } else {
      $("#hd-view").hide();
    }
  } else if (data.media_type === "video") {
    $("#apod-media").html(
      `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`
    );
    $("#hd-view").hide();
  }
}
