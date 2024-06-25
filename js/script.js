const apiKey = ''; // OpenWeatherMapのAPIキー

// 服装提案のデータ
const clothingSuggestions = {
  hot: "Tシャツとショートパンツ",
  warm: "薄手の長袖シャツとジーンズ",
  cool: "セーターと長ズボン",
  cold: "コートと厚手のズボン"
};

// 服装提案のロジック
function getClothingSuggestion(temp) {
  if (temp >= 30) {
      return clothingSuggestions.hot;
  } else if (temp >= 20) {
      return clothingSuggestions.warm;
  } else if (temp >= 10) {
      return clothingSuggestions.cool;
  } else {
      return clothingSuggestions.cold;
  }
}

// 天気情報のHTMLを生成
function generateWeatherHTML(data) {
  let weather = `<h2>${data.city.name}の5日間天気予報</h2>`;
  data.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const formattedDate = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
      const formattedTime = date.toLocaleTimeString('ja-JP', { hour: 'numeric', hour12: false });
      const temp = forecast.main.temp.toFixed(1); // 温度を小数点第1位までに丸める
      const icon = forecast.weather[0].icon; // 天気アイコンのコード
      const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`; // アイコンのURL
      const clothingSuggestion = getClothingSuggestion(temp);

      weather += `
          <div>
              <h3>${formattedDate} ${formattedTime}</h3>
              <p>温度: ${temp}°C</p>
              <p>天気: ${forecast.weather[0].description}</p>
              <img src="${iconUrl}" alt="天気アイコン">
              <p>おすすめの服装: ${clothingSuggestion}</p>
          </div>
      `;
  });
  return weather;
}

// 天気データを取得
async function getWeather() {
  const city = document.getElementById('city').value;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ja`;

  try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "200") {
          const weatherHTML = generateWeatherHTML(data);
          document.getElementById('weather').innerHTML = weatherHTML;
      } else {
          document.getElementById('weather').innerHTML = `<p>都市が見つかりませんでした。</p>`;
      }
  } catch (error) {
      console.error('Error fetching weather data:', error);
      document.getElementById('weather').innerHTML = `<p>データの取得に失敗しました。</p>`;
  }
}