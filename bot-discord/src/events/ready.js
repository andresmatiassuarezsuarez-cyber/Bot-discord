export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot conectado como ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: 'Creativos RP | /help' }],
      status: 'online'
    });
  }
};
