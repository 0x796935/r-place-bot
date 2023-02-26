import ClientClass from '../structs/clientClass';
// export by default the execute function
// import canvas from '../utils/canvas';

export default async function (client: ClientClass) {
  // console.log(canvas)
  console.log(`[INFO] Logged in as ${client.user?.tag}!`);
}