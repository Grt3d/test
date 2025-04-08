(function () {
    const TOKEN = "e2219079c5ae4e04befb7d426d5804d0";
    const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36";

    function sendPost(url, data) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "Origin": "https://kitty-web.bfp72q.com",
                "Referer": "https://kitty-web.bfp72q.com/"
                // ملاحظة: User-Agent لا يمكن تعيينه من داخل المتصفح
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .catch(error => console.error("Error sending request:", error));
    }

    function extractAllUids(responseObj) {
        const uids = [];
        function recursiveSearch(data) {
            if (Array.isArray(data)) {
                data.forEach(item => recursiveSearch(item));
            } else if (typeof data === 'object' && data !== null) {
                for (const key in data) {
                    if (key === 'uid') {
                        uids.push(data[key]);
                    } else {
                        recursiveSearch(data[key]);
                    }
                }
            }
        }
        recursiveSearch(responseObj);
        return uids;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function collectEggRewards() {
        const infoJson = { token: TOKEN };
        const response = await sendPost("https://kitty-api.bfp72q.com/api/scene/info", infoJson);

        if (response) {
            const uids = extractAllUids(response);
            console.log(`Found ${uids.length} UIDs.`);

            for (const uid of uids) {
                const rewardJson = { token: TOKEN, egg_uid: uid };
                const res = await sendPost("https://kitty-api.bfp72q.com/api/scene/egg/reward", rewardJson);
                console.log("Reward sent for UID: " + uid, res);
                await sleep(300); // تأخير بسيط لتجنب حظر السيرفر
            }
        } else {
            console.warn("No response received from scene/info");
        }
    }

    // تشغيل الدالة تلقائيًا
    collectEggRewards();
})();
