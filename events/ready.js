const { ActivityType } = require('discord.js');

module.exports = (client) => {
    const activities = [
        { name: 'By WinterrrTR', type: ActivityType.Streaming, url: 'https://www.twitch.tv/devbywtr' },
        { name: 'winterrrtr.com.tr', type: ActivityType.Streaming, url: 'https://www.twitch.tv/devbywtr' }
    ];

    let currentIndex = 0;

    function setActivity() {
        const activity = activities[currentIndex];
        client.user.setActivity(activity);
        currentIndex = (currentIndex + 1) % activities.length;
    }

    setActivity();

    const interval = 10 * 1000;

    setInterval(setActivity, interval);
};
