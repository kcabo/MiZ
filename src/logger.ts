export default function ErrorLog(message: string, arg: any) {
  if (typeof arg === 'object') {
    arg = JSON.stringify(arg, null, 2);
  }
  console.error(message, arg);
}
