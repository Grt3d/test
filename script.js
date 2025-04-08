(function() {
    const TOKEN = "e2219079c5ae4e04befb7d426d5804d0";  // التوكن المُحدث
    const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36";  // وكيل المستخدم المُحدث

    // دالة لإرسال POST
    function sendPost(url, data) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": USER_AGENT,
                "Origin": "https://kitty-web.bfp72q.com",
                "Referer": "https://kitty-web.bfp72q.com/"
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .catch(error => console.error("Error sending request:", error));
    }

    // دالة لاستخراج UIDs
    function extractAllUids(response) {
        const uids = [];
        const uidKeyword = "\"uid\":";
        let index = 0;
        while ((index = response.indexOf(uidKeyword, index)) !== -1) {
            const startIndex = response.indexOf(":", index) + 2;
            const endIndex = response.indexOf("\"", startIndex);
            const uid = response.substring(startIndex, endIndex);
            uids.push(uid);
            index = endIndex;
        }
        return uids;
    }

    // دالة لجلب بيانات المشهد وإرسال الطلبات
    function collectEggRewards() {
        const infoJson = { "token": TOKEN };
        sendPost("https://kitty-api.bfp72q.com/api/scene/info", infoJson)
            .then(response => {
                if (response) {
                    const uids = extractAllUids(JSON.stringify(response));
                    uids.forEach(uid => {
                        const rewardJson = { "token": TOKEN, "egg_uid": uid };
                        sendPost("https://kitty-api.bfp72q.com/api/scene/egg/reward", rewardJson)
                            .then(() => {
                                console.log("Reward sent for UID: " + uid);
                            });
                    });
                }
            });
    }

    // تنفيذ الدالة فور دخول الزائر إلى الموقع
    collectEggRewards();

})();
