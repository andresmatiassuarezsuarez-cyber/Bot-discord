export default {
  name: 'guildMemberRemove',
  async execute(member) {
    console.log(`👋 ${member.user.tag} ha salido del servidor.`);
  }
};
