// ===== Spotify Ultimate Unified Script =====

const TOKEN_KEY = "spotify_token";

// ===== REQUEST HANDLER =====
if ($request) {

    let url = $request.url;

    // 🚫 Block logout
    if (url.includes("/logout")) {
        $done({ status: 200, body: "" });
        return;
    }

    // 💉 Inject token vào mọi request
    let token = $persistentStore.read(TOKEN_KEY);
    if (token) {
        $request.headers["Authorization"] = "Bearer " + token;
    }

    $done({ headers: $request.headers });
}


// ===== RESPONSE HANDLER =====
if ($response) {

    let url = $request.url;
    let body = $response.body;

    try {
        let json = JSON.parse(body);

        // 🔑 Lưu token
        if (url.includes("/auth") || url.includes("/token")) {
            if (json.access_token) {
                $persistentStore.write(json.access_token, TOKEN_KEY);
            }
        }

        // 💎 Fake Premium
        if (url.includes("/v1/me")) {

            json.product = "premium";

            json.subscription = {
                status: "active",
                plan: "premium",
                is_premium: true
            };

            json.features = {
                shuffle: true,
                offline: true,
                unlimited_skips: true,
                no_ads: true
            };

            body = JSON.stringify(json);
        }

    } catch (e) {
        // tránh crash nếu response không phải JSON
    }

    $done({ body });
}
