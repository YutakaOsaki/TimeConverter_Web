document.addEventListener('DOMContentLoaded', function() {
    const convertButton = document.getElementById('convertButton');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const fromTimezone = document.getElementById('fromTimezone');
    const toTimezone = document.getElementById('toTimezone');
    const warningBanner = document.getElementById('warningBanner');

    const timePattern = /(\d{2}):(\d{2})/g;
    const dstTimezones = ["Europe/Zurich", "Europe/Amsterdam", "America/New_York", "America/Anchorage", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/Halifax", "America/St_Johns", "Atlantic/Azores", "Europe/London", "Europe/Berlin", "Europe/Athens", "Australia/Sydney", "Pacific/Auckland"];

    convertButton.addEventListener('click', function() {
        const input = inputText.value;
        const fromTZ = fromTimezone.value;
        const toTZ = toTimezone.value;

        const convertedText = convertTimes(input, fromTZ, toTZ);
        outputText.value = convertedText;
    });

    function convertTimes(text, fromTZ, toTZ) {
        return text.replace(timePattern, replaceTime);

        function replaceTime(match, hour, minute) {
            const today = moment().format('YYYY-MM-DD'); // Get today's date
            const originalTime = moment.tz(`${today} ${hour}:${minute}`, 'YYYY-MM-DD H:mm', fromTZ);
            const convertedTime = originalTime.clone().tz(toTZ);

            const newHour = String(convertedTime.hour()).padStart(2, '0');
            const newMinute = String(convertedTime.minute()).padStart(2, '0');
            const newDay = convertedTime.date();

            if (newDay === moment(today).date() - 1) {
                return `${newHour}:${newMinute}\t(The Day Before)`;
            } else if (newDay === moment(today).date() + 1) {
                return `${newHour}:${newMinute}\t(The Next Day)`;
            } else {
                return `${newHour}:${newMinute}`;
            }
        }
    }

    function checkDST(selectElement) {
        const selectedTimezone = selectElement.value;
        const isDST = moment.tz(selectedTimezone).isDST();

        if (isDST && dstTimezones.includes(selectedTimezone)) {
            warningBanner.classList.remove('hidden');
        } else {
            warningBanner.classList.add('hidden');
        }
    }

    // イベントリスナーを追加
    fromTimezone.addEventListener('change', function() { checkDST(fromTimezone); });
    toTimezone.addEventListener('change', function() { checkDST(toTimezone); });

    // 初期チェック
    checkDST(fromTimezone);
    checkDST(toTimezone);
});
