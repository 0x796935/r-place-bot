import ClientClass from '../structs/clientClass';
// export by default the execute function

export default async function (client: ClientClass) {
  console.log(`[INFO] Logged in as ${client.user?.tag}!`);
}