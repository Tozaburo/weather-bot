const axios = require('axios');

const weatherApiKey = process.env.WEATHER_API_KEY; // WeatherAPIのキー
const lineAccessToken = process.env.LINE_ACCESS_TOKEN; // LINEチャネルアクセストークン
const location = "Tokyo"; // 取得したい地域
const days = 1; // 天気予報の日数

async function getWeather() {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=${days}`;
    try {
        const response = await axios.get(url);
        const forecast = response.data.forecast.forecastday[0];
        const weather = forecast.day.condition.text;
        const tempMax = forecast.day.maxtemp_c;
        const tempMin = forecast.day.mintemp_c;

        return `今日の天気：${weather}\n最高気温：${tempMax}℃\n最低気温：${tempMin}℃`;
    } catch (error) {
        console.error("天気情報の取得に失敗しました:", error);
        return "天気情報を取得できませんでした。";
    }
}

async function sendLineMessage(message) {
    const url = "https://api.line.me/v2/bot/message/push";
    const userId = process.env.LINE_USER_ID; // LINEのユーザーID

    try {
        await axios.post(
            url,
            {
                to: userId,
                messages: [{ type: "text", text: message }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${lineAccessToken}`,
                },
            }
        );
        console.log("メッセージを送信しました");
    } catch (error) {
        console.error("メッセージの送信に失敗しました:", error);
    }
}

(async () => {
    const weatherMessage = await getWeather();
    await sendLineMessage(weatherMessage);
})();
