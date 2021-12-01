export function ErrorLog(message: string, arg: any) {
  if (arg instanceof Error) {
    console.error(message, arg);
  } else if (typeof arg === 'object') {
    try {
      console.error(message, JSON.stringify(arg, null, 2));
    } catch (error) {
      // escape 'Converting circular structure to JSON' error
      console.error(message, arg);
    }
  } else {
    console.error(message, arg);
  }
}
