export async function publishBeamsNotification(instanceId, secretKey, userIds, notification, data) {
    if (!instanceId || !secretKey || !userIds || userIds.length === 0) return;
    try {
        const response = await fetch(`https://${instanceId}.pushnotifications.pusher.com/publish_api/v1/instances/${instanceId}/publishes/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                users: userIds,
                web: {
                    notification,
                    data,
                },
            }),
        });
        return response;
    } catch (err) {
        console.error("Failed to publish Beams notification:", err);
    }
}
